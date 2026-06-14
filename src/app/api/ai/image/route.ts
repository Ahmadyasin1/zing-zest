import { HF_MODELS, getHfClient, hasHfToken, withModelFallback } from '@/lib/ai/huggingface';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 120;

interface ImageBody {
  prompt: string;
  style?: string;
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key, 10)) return jsonError('Image generation rate limit exceeded.', 429);

  try {
    const { prompt, style = 'professional food photography' } = await parseBody<ImageBody>(req);
    if (!prompt?.trim()) return jsonError('Prompt is required', 400);

    if (!hasHfToken()) {
      return jsonError('HF_TOKEN required for image generation. Add free token to .env.local', 503);
    }

    const fullPrompt = `Zing & Zest Street Bites Lahore food truck, ${style}, ${prompt}, vibrant orange and teal brand colors, hygienic modern street food, high quality, appetizing`;

    const { result, model } = await withModelFallback(
      [HF_MODELS.image, ...HF_MODELS.imageFallbacks],
      async (modelId) => {
        const hf = getHfClient();
        const out = await hf.textToImage({
          model: modelId,
          inputs: fullPrompt,
          parameters: { negative_prompt: 'blurry, low quality, text, watermark, ugly' },
        });
        if (typeof out === 'string') {
          return out.startsWith('data:') ? out : `data:image/png;base64,${out}`;
        }
        const buffer = Buffer.from(await (out as Blob).arrayBuffer());
        return `data:image/png;base64,${buffer.toString('base64')}`;
      },
    );

    return jsonOk({ image: result, model, prompt: fullPrompt });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Image generation failed', 500);
  }
}
