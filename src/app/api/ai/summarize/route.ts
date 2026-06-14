import { hfComplete, hasHfToken } from '@/lib/ai/huggingface';

import { REPORT } from '@/lib/data/content';

import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';



export const maxDuration = 60;



interface SummarizeBody {

  section?: string;

  type?: 'report' | 'kpi' | 'trends';

}



export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  let type: SummarizeBody['type'] = 'report';
  try {
    const body = await parseBody<SummarizeBody>(req);
    const { section } = body;
    type = body.type ?? 'report';



    const content =

      type === 'report'

        ? section

          ? REPORT.sections.find((s) => s.title.toLowerCase().includes(section.toLowerCase()))?.body

          : REPORT.sections.map((s) => `${s.title}: ${s.body.slice(0, 300)}`).join('\n\n')

        : `Generate executive KPI summary for Zing & Zest: 20 interviews, Rs.45,150 IMC, Rs.5.9M Year-1 forecast, 100 Day-1 customers, 3 personas, 25% crisis recovery plan.`;



    if (!content) return jsonError('Section not found', 404);



    if (!hasHfToken()) {

      const offline =

        type === 'kpi'

          ? '**KPI Snapshot:** 20 interviews validate demand · Rs. 45,150 IMC budget · 100 Day-1 target · Rs. 5.9M Year-1 base · Break-even Month 2 · 24% margin · 3 personas · 6-stage journey · 3-phase recovery.'

          : `**Executive Summary (offline):**\n\n${REPORT.sections[0].body.slice(0, 600)}…\n\n_Add HF_TOKEN for AI-generated summaries._`;

      return jsonOk({ summary: offline, source: 'offline' });

    }



    const { text, model } = await hfComplete(
      `Summarize the following in 4-6 bullet points for executives:\n\n${String(content).slice(0, 3000)}`,
      'summary',
      { maxTokens: 350, temperature: 0.5 },
    );

    return jsonOk({ summary: text, model, source: 'huggingface' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Summarize failed';
    if (/body|JSON|not found/i.test(msg)) return jsonError(msg, /not found/i.test(msg) ? 404 : 400);
    const offline =
      type === 'kpi'
        ? '**KPI Snapshot:** 20 interviews validate demand · Rs. 45,150 IMC budget · 100 Day-1 target · Rs. 5.9M Year-1 base · Break-even Month 2 · 24% margin · 3 personas · 6-stage journey · 3-phase recovery.'
        : `**Executive Summary (offline):**\n\n${REPORT.sections[0].body.slice(0, 600)}…\n\n_Live AI temporarily unavailable._`;
    return jsonOk({ summary: offline, source: 'offline', notice: 'Live AI unavailable — showing offline summary.' });
  }
}


