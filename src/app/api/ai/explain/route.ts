import { hfComplete, hasHfToken } from '@/lib/ai/huggingface';

import { ZZ } from '@/lib/data/zz';

import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';



export const maxDuration = 60;



interface ExplainBody {

  kpi: string;

}



const KPI_MAP: Record<string, string> = {

  interviews: `20 semi-structured interviews: 12 students, 5 employees, 3 families. Hygiene mentioned 18 times - primary purchase driver.`,

  budget: `IMC budget Rs. ${ZZ.imc.budgetTotal.toLocaleString()} across Meta ads, sampling, influencers, content, packaging, loyalty.`,

  day1: `Day-1 target of ${ZZ.imc.targets.day1Customers} customers from campus sampling + social funnel (5000 impressions → 200 DMs).`,

  revenue: `Year-1 base revenue Rs. 5.9M with break-even Month 2 at 359 units/month. Conservative Rs. 4.2M, Optimistic Rs. 8.5M.`,

  margin: `Net profit margin 24% base case, expanding to 33% by Year 3 through operational leverage.`,

  personas: `3 personas: Student (60%, Rs.380), Professional (28%, Rs.550), Explorer (12%, Rs.420).`,

  crisis: `25% Month-3 revenue drop scenario with 3-phase recovery targeting Rs. 792K by Month 6.`,

  hygiene: `Hygiene trust is the #1 differentiator - 18/20 interview mentions. Visible gloves, sealed packaging.`,

};



export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  let kpiLabel = 'revenue';

  try {
    const { kpi } = await parseBody<ExplainBody>(req);
    if (!kpi?.trim()) return jsonError('KPI key is required', 400);
    kpiLabel = kpi;

    const k = kpi.toLowerCase();
    const context = Object.entries(KPI_MAP).find(([key]) => k.includes(key))?.[1] || KPI_MAP.revenue;
    const offlineExplanation = `**${kpi} Explained (offline):**\n\n${context}\n\n**Why it matters:** These metrics connect primary research to launch decisions - validated demand, funded acquisition, and measurable recovery plans.\n\n_Add HF_TOKEN for personalized AI explanations._`;

    if (!hasHfToken()) {
      return jsonOk({ explanation: offlineExplanation, source: 'offline' });
    }

    const { text, model } = await hfComplete(
      `Explain this KPI to a non-technical stakeholder in 2 short paragraphs: "${kpi}"\nContext: ${context}`,
      'explain',
      { maxTokens: 300, temperature: 0.5 },
    );

    return jsonOk({ explanation: text, model, source: 'huggingface' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Explain failed';
    if (/body|JSON|required/i.test(msg)) return jsonError(msg, 400);
    const k = kpiLabel.toLowerCase();
    const context = Object.entries(KPI_MAP).find(([key]) => k.includes(key))?.[1] || KPI_MAP.revenue;
    return jsonOk({
      explanation: `**${kpiLabel} Explained (offline):**\n\n${context}\n\n_Live AI temporarily unavailable._`,
      source: 'offline',
      notice: msg.includes('timed out') ? 'HF request timed out - showing offline explanation.' : 'Live AI unavailable.',
    });
  }
}


