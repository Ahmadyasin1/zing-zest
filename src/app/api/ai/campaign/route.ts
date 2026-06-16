import { hfComplete, hasHfToken } from '@/lib/ai/huggingface';
import { ZZ } from '@/lib/data/zz';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 60;

type CampaignType = 'instagram' | 'whatsapp' | 'tiktok' | 'email';

interface CampaignBody {
  type?: CampaignType;
  product?: string;
  persona?: string;
  tone?: string;
}

const OFFLINE_COPY: Record<CampaignType, string> = {
  instagram: `🔥 **Student Combo - Rs. 380 only!**\n\nClassic Burger + Fries + Drink. Visible gloves. Sealed packaging. Clean truck. Fresh. Fast. Full of Flavor.\n\n📍 UCP Main Gate 12-3 PM\n#ZingAndZest #UCPEats #FreshFastFull`,
  whatsapp: `Assalam-o-Alaikum! 🍔 Zing & Zest is at UCP Main Gate today 12-3 PM.\n\nStudent Combo Rs. 380 - burger, fries, drink.\nHygiene you can see. Order at the truck or DM us!\n\nFresh. Fast. Full of Flavor.`,
  tiktok: `POV: You find a food truck that actually looks CLEAN 😳\nStudent Combo Rs. 380 | UCP 12-3 PM\n#foodtruck #lahore #UCPEats #zingandzest`,
  email: `Subject: Launch Week - Zing & Zest at UCP\n\nDear Student,\n\nWe're launching at UCP Main Gate with the Rs. 380 Student Combo. Hygiene-first street food with premium taste.\n\nSee you at lunch!`,
};

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  let type: CampaignType = 'instagram';

  try {
    const body = await parseBody<CampaignBody>(req);
    type = body.type ?? 'instagram';
    const { product = 'Student Combo Rs. 380', persona = 'UCP Student', tone = 'energetic, hygienic, affordable-premium' } = body;

    if (!hasHfToken()) {
      return jsonOk({ copy: OFFLINE_COPY[type], source: 'offline', type });
    }

    const { text, model } = await hfComplete(
      `Write ${type} marketing copy for Zing & Zest Street Bites Lahore.
Product: ${product}
Target persona: ${persona}
Tone: ${tone}
Budget context: Rs. ${ZZ.imc.budgetTotal} IMC plan
Include relevant hashtags for Instagram/TikTok.
Keep WhatsApp messages under 280 characters.
Max 120 words.`,
      'copilot',
      { maxTokens: 280, temperature: 0.85 },
    );

    return jsonOk({ copy: text || OFFLINE_COPY[type], model, source: 'huggingface', type });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Campaign generation failed';
    if (/body|JSON/i.test(msg)) return jsonError(msg, 400);
    return jsonOk({
      copy: OFFLINE_COPY[type],
      source: 'offline',
      type,
      notice: 'Live AI unavailable - showing offline campaign copy.',
    });
  }
}
