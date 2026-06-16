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

  let fullPrompt = '';

  try {
    const { prompt, style = 'professional food photography' } = await parseBody<ImageBody>(req);
    if (!prompt?.trim()) return jsonError('Prompt is required', 400);

    if (!hasHfToken()) {
      return jsonError('HF_TOKEN required for image generation. Add free token to .env.local', 503);
    }

    fullPrompt = `Zing & Zest Street Bites Lahore food truck, ${style}, ${prompt}, vibrant orange and teal brand colors, hygienic modern street food, high quality, appetizing`;

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

    return jsonOk({ image: result, model, prompt: fullPrompt, source: 'huggingface' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Image generation failed';
    if (/body|JSON|required/i.test(msg)) return jsonError(msg, 400);
    // Graceful fallback - HF image models can cold-start slowly or rate-limit
    const placeholder =
      'data:image/svg+xml;base64,' +
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff9020"/><stop offset="100%" style="stop-color:#3ee8d5"/></linearGradient></defs><rect width="512" height="512" fill="#111016"/><rect x="32" y="32" width="448" height="448" rx="24" fill="url(#g)" opacity="0.15"/><text x="256" y="240" text-anchor="middle" fill="#ffb84d" font-family="sans-serif" font-size="22" font-weight="bold">Zing &amp; Zest</text><text x="256" y="280" text-anchor="middle" fill="#c8c0b4" font-family="sans-serif" font-size="14">Image preview unavailable</text></svg>`,
      ).toString('base64');
    return jsonOk({
      image: placeholder,
      source: 'fallback',
      prompt: fullPrompt,
      notice: `Live generation unavailable (${msg.slice(0, 80)})`,
    });
  }
}
