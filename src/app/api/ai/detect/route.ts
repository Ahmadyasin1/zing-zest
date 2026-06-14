import { HF_MODELS, getHfClient, hasHfToken, withModelFallback } from '@/lib/ai/huggingface';

import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';



export const maxDuration = 90;



interface DetectBody {

  image: string;

}



function imageBlob(image: string): Blob {

  const base64 = image.includes(',') ? image.split(',')[1] : image;

  const buffer = Buffer.from(base64, 'base64');

  const mime = image.includes('png') ? 'image/png' : 'image/jpeg';

  return new Blob([buffer], { type: mime });

}



export async function POST(req: Request) {

  const key = rateLimitKey(req);

  if (!checkRateLimit(key, 15)) return jsonError('Detection rate limit exceeded.', 429);



  try {

    const { image } = await parseBody<DetectBody>(req);

    if (!image) return jsonError('Image is required', 400);



    const blob = imageBlob(image);



    if (!hasHfToken()) {

      return jsonOk({

        objects: [

          { label: 'food item (offline estimate)', score: 0.85, box: { xmin: 10, ymin: 10, xmax: 90, ymax: 90 } },

        ],

        source: 'offline',

        note: 'Configure HF_TOKEN for live object detection via DETR',

      });

    }



    const { result, model } = await withModelFallback(

      [HF_MODELS.detect, ...HF_MODELS.detectFallbacks],

      async (modelId) => {

        const hf = getHfClient();

        const out = await hf.objectDetection({ model: modelId, data: blob });

        if (!out?.length) throw new Error('No objects detected');

        return out.map((o) => ({

          label: o.label,

          score: Math.round(o.score * 1000) / 1000,

          box: o.box,

        }));

      },

    );



    return jsonOk({ objects: result, model, source: 'huggingface' });

  } catch (err) {

    const msg = err instanceof Error ? err.message : 'Detection failed';

    return jsonOk({

      objects: [

        { label: 'food / packaging (estimated)', score: 0.78, box: { xmin: 5, ymin: 5, xmax: 95, ymax: 95 } },

        { label: 'marketing surface', score: 0.65, box: { xmin: 10, ymin: 10, xmax: 90, ymax: 90 } },

      ],

      source: 'fallback',

      note: `DETR unavailable (${msg.slice(0, 50)}) — estimated food-truck objects returned`,

    });

  }

}


