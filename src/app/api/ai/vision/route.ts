import { HF_MODELS, getHfClient, hasHfToken, withModelFallback } from '@/lib/ai/huggingface';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 90;

interface VisionBody {
  image: string;
  question?: string;
  task?: 'caption' | 'vqa' | 'ocr';
}

function imageBlob(image: string): Blob {
  const base64 = image.includes(',') ? image.split(',')[1] : image;
  const buffer = Buffer.from(base64, 'base64');
  const mime = image.includes('png') ? 'image/png' : 'image/jpeg';
  return new Blob([buffer], { type: mime });
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key, 15)) return jsonError('Vision rate limit exceeded.', 429);

  let task: VisionBody['task'] = 'caption';

  try {
    const body = await parseBody<VisionBody>(req);
    const { image, question } = body;
    task = body.task || 'caption';
    if (!image) return jsonError('Image is required (base64 data URL)', 400);

    const blob = imageBlob(image);

    if (!hasHfToken()) {
      return jsonOk({
        result: task === 'vqa' && question
          ? `[Offline mode] Based on typical food truck imagery: This appears to be food/marketing content relevant to "${question}".`
          : '[Offline mode] Image uploaded. Configure HF_TOKEN for live vision analysis.',
        source: 'offline',
        task,
      });
    }

    const hf = getHfClient();
    const captionPrompt =
      task === 'ocr' ? 'ocr' : task === 'vqa' && question ? question : 'a photo of';

    const { result, model } = await withModelFallback(
      [HF_MODELS.vision, ...HF_MODELS.visionFallbacks],
      async (modelId) => {
        const out = await hf.imageToText({
          model: modelId,
          data: blob,
          ...(captionPrompt !== 'a photo of' ? { inputs: captionPrompt } : {}),
        });
        const text = typeof out === 'string' ? out : out?.generated_text?.trim();
        if (text) return text;
        throw new Error('Empty vision response');
      },
    );

    return jsonOk({ result, model, source: 'huggingface', task });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Vision analysis failed';
    return jsonOk({
      result: `Food marketing image received - likely street food, burger/shawarma, or branded truck content for Zing & Zest. (${msg.slice(0, 60)})`,
      source: 'fallback',
      task,
      note: 'Live vision model unavailable - contextual fallback used',
    });
  }
}
