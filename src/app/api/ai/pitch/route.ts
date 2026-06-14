import { hfComplete, hasHfToken } from '@/lib/ai/huggingface';

import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';



export const maxDuration = 60;



interface PitchBody {

  audience?: 'investor' | 'professor' | 'customer';

  duration?: '30sec' | '2min' | '5min';

}



const OFFLINE: Record<string, string> = {

  investor: `**Zing & Zest — 60-Second Investor Pitch**\n\nLahore's UCP corridor has 12,000+ daily lunch seekers but no affordable-premium mobile option with visible hygiene trust.\n\nZing & Zest is a data-validated food truck: 20 interviews, Rs. 5.9M Year-1 base forecast, break-even Month 2, 24% margin.\n\nRs. 45,150 IMC targets 100 Day-1 customers. We're raising for truck #2 and Foodpanda integration.\n\nFresh. Fast. Full of Flavor — backed by AI-driven marketing intelligence.`,

  professor: `**Academic Presentation Opener**\n\nOur Assignment 4 deliverable integrates primary research (20 interviews), AI-assisted persona synthesis, predictive forecasting, competitive benchmarking, and crisis recovery planning for Zing & Zest Street Bites — demonstrating how street-food entrepreneurship can operate with technology-startup analytical rigor.`,

  customer: `**Customer Hook (15 sec)**\n\nHungry at UCP? Zing & Zest serves Student Combo — burger, fries, drink — for Rs. 380. Visible hygiene. Bold flavor. Find us at Main Gate 12–3 PM. Fresh. Fast. Full of Flavor.`,

};



export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  let audience: PitchBody['audience'] = 'investor';
  try {
    const body = await parseBody<PitchBody>(req);
    audience = body.audience ?? 'investor';
    const { duration = '2min' } = body;



    if (!hasHfToken()) {

      return jsonOk({ pitch: OFFLINE[audience] || OFFLINE.investor, source: 'offline', audience });

    }



    const { text, model } = await hfComplete(

      `Write a ${duration} ${audience} pitch for Zing & Zest Street Bites. Include key numbers: 20 interviews, Rs. 45,150 IMC, Rs. 5.9M forecast, 100 Day-1 customers, 3 personas, break-even Month 2. Make it compelling and structured with bullet points.`,

      'summary',

      { maxTokens: 400, temperature: 0.7 },

    );



    return jsonOk({ pitch: text || OFFLINE[audience], model, source: 'huggingface', audience });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Pitch generation failed';
    if (/body|JSON/i.test(msg)) return jsonError(msg, 400);
    return jsonOk({
      pitch: OFFLINE[audience] || OFFLINE.investor,
      source: 'offline',
      audience,
      notice: 'Live AI unavailable — showing offline pitch.',
    });
  }
}


