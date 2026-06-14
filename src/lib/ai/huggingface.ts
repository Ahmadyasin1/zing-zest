import { HfInference } from '@huggingface/inference';
import { REPORT, PERSONAS, AI_PROMPTS } from '@/lib/data/content';
import { ZZ, TEAM, LEAD_DEVELOPER } from '@/lib/data/zz';

export const HF_MODELS = {
  chat: process.env.HF_CHAT_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
  chatFallbacks: [
    'HuggingFaceH4/zephyr-7b-beta',
    'meta-llama/Llama-3.2-3B-Instruct',
  ],
  image: process.env.HF_IMAGE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0',
  imageFallbacks: ['stabilityai/stable-diffusion-2-1', 'runwayml/stable-diffusion-v1-5'],
  vision: process.env.HF_VISION_MODEL || 'Salesforce/blip-image-captioning-large',
  visionFallbacks: ['nlpconnect/vit-gpt2-image-captioning'],
  detect: process.env.HF_DETECT_MODEL || 'facebook/detr-resnet-50',
  detectFallbacks: [] as string[],
  embed: process.env.HF_EMBED_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
  embedFallbacks: ['sentence-transformers/paraphrase-MiniLM-L3-v2'],
};

let hfClient: HfInference | null = null;

export function getHfClient(): HfInference {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error('HF_TOKEN is not configured. Add it to .env.local — get a free token at huggingface.co/settings/tokens');
  if (!hfClient) hfClient = new HfInference(token);
  return hfClient;
}

export function hasHfToken(): boolean {
  return Boolean(process.env.HF_TOKEN && process.env.HF_TOKEN !== 'hf_your_token_here');
}

export async function withModelFallback<T>(
  models: string[],
  fn: (model: string) => Promise<T>,
): Promise<{ result: T; model: string }> {
  let lastError: unknown;
  for (const model of models) {
    try {
      const result = await fn(model);
      return { result, model };
    } catch (err) {
      lastError = err;
      console.warn(`[HF] Model ${model} failed:`, err instanceof Error ? err.message : err);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('All models failed');
}

export const SITE_CONTEXT = buildSiteContext();

function buildSiteContext(): string {
  const personaSummary = PERSONAS.map(
    (p) => `${p.name} (${p.segment}): ${p.role}, AOV Rs.${p.aov}, ${p.share} revenue share`,
  ).join('\n');

  return `Zing & Zest Street Bites — Lahore food truck marketing intelligence platform.
Tagline: ${ZZ.brand.tagline}
Positioning: ${ZZ.brand.positioning}
Platform developer: ${LEAD_DEVELOPER} (main developer). UCP team: ${TEAM.map((m) => m.name).join(', ')}.
Research: ${ZZ.research.interviews} interviews, hygiene mentioned ${ZZ.research.hygieneMentions}/20 times.
IMC Budget: Rs.${ZZ.imc.budgetTotal.toLocaleString()}, Day-1 target: ${ZZ.imc.targets.day1Customers} customers.
Forecast Year-1 base: Rs.5.9M, break-even Month 2, 24% margin.
Personas:\n${personaSummary}
Menu avg order: Rs.${ZZ.menu.avgOrder}
Locations: ${ZZ.imc.locations.map((l) => `${l.name} (${l.hours})`).join('; ')}
Competitors: ${ZZ.competitors.length} tracked including campus canteen, stalls, outlets, cafés, aggregators.
Crisis scenario: 25% Month-3 revenue drop, 3-phase recovery plan.
Report sections: ${REPORT.sections.map((s) => s.title).join(', ')}.
AI prompts documented: ${AI_PROMPTS.length}.`;
}

export async function hfComplete(
  userPrompt: string,
  mode: 'copilot' | 'explain' | 'summary' = 'copilot',
  options?: { maxTokens?: number; temperature?: number },
): Promise<{ text: string; model: string }> {
  const system = buildChatSystemPrompt(mode);
  const { result, model } = await withModelFallback(
    [HF_MODELS.chat, ...HF_MODELS.chatFallbacks.filter((m) => !m.includes('flan') && !m.includes('t5'))],
    async (modelId) => {
      const hf = getHfClient();
      const out = await hf.chatCompletion({
        model: modelId,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: options?.maxTokens ?? 400,
        temperature: options?.temperature ?? 0.7,
      });
      const reply = out.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
      throw new Error('Empty chat response');
    },
  );
  return { text: result, model };
}

export function buildChatSystemPrompt(mode: 'copilot' | 'explain' | 'summary' = 'copilot'): string {
  const base = `You are ZestAI, the intelligent copilot for Zing & Zest Street Bites marketing platform at UCP Lahore.
Use ONLY the following verified project context. Be concise, friendly, and actionable for both technical and non-technical users.

${SITE_CONTEXT}`;

  if (mode === 'explain') return `${base}\n\nExplain KPIs and metrics in plain language with business implications.`;
  if (mode === 'summary') return `${base}\n\nProvide executive summaries with bullet points and key takeaways.`;
  return `${base}\n\nHelp users navigate the platform, answer questions about research, forecasts, personas, competitors, IMC, journey, and recovery strategy.`;
}

export function localFallbackChat(message: string): string {
  const q = message.toLowerCase();
  const rag = searchCorpusLocal(message, 3);

  if (q.includes('forecast') || q.includes('revenue') || q.includes('5.9'))
    return `**Forecast Intelligence (offline mode)**\n\nYear-1 base revenue is **Rs. 5.9M** with break-even in **Month 2** at 359 units/month. Three scenarios: Conservative Rs. 4.2M, Base Rs. 5.9M, Optimistic Rs. 8.5M.\n\n${rag.map((r) => `• ${r.title}: ${r.snippet.slice(0, 120)}…`).join('\n')}\n\n_Add HF_TOKEN to enable live LLM responses._`;

  if (q.includes('persona') || q.includes('customer'))
    return `**Customer Personas (offline mode)**\n\nThree validated personas drive strategy:\n• **Usama Tariq** (Student, 60% share, Rs. 380 AOV)\n• **Fatima Rizvi** (Professional, 28%, Rs. 550)\n• **Bilal Sheikh** (Explorer, 12%, Rs. 420)\n\nHygiene and combo value are top conversion drivers.\n\n_Add HF_TOKEN for deeper AI analysis._`;

  if (q.includes('competitor') || q.includes('swot'))
    return `**Competitive Intelligence (offline mode)**\n\nZing & Zest occupies the **affordable-premium white space** at Rs. 380 with 4.6★ target rating. Key edges: hygiene (95), price-value (90), digital presence (88).\n\n${rag[0] ? rag[0].snippet.slice(0, 200) : ''}\n\n_Add HF_TOKEN for live LLM insights._`;

  if (q.includes('recovery') || q.includes('crisis'))
    return `**Recovery Strategy (offline mode)**\n\nMonth 3 scenario: **−25%** revenue drop (Rs. 810K → Rs. 540K).\n\n**Phase 1:** WhatsApp flash promo, Study Fuel bundle\n**Phase 2:** UGC ads, referral program\n**Phase 3:** Pre-order slots, Foodpanda pilot\n\nTarget Month 6: **Rs. 792K**`;

  if (q.includes('budget') || q.includes('imc'))
    return `**IMC Plan (offline mode)**\n\nTotal budget: **Rs. 45,150** across Meta ads, sampling, content, influencers, packaging, and loyalty.\n\nTargets: 5,000 impressions · 200 DMs · **100 Day-1 customers**`;

  return `**ZestAI (offline mode)**\n\nI can help with forecasts, personas, competitors, IMC, journey mapping, and recovery strategy.\n\n**Relevant content:**\n${rag.map((r) => `• **${r.title}**: ${r.snippet.slice(0, 100)}…`).join('\n') || '• Explore sections via the sidebar navigation.'}\n\nTip: Configure \`HF_TOKEN\` in \`.env.local\` for full LLM-powered responses via Hugging Face.`;
}

interface CorpusDoc {
  id: string;
  title: string;
  text: string;
  category: string;
}

export const CORPUS: CorpusDoc[] = buildCorpus();

function buildCorpus(): CorpusDoc[] {
  const docs: CorpusDoc[] = [];

  REPORT.sections.forEach((s, i) => {
    docs.push({ id: `report-${i}`, title: s.title, text: s.body, category: 'report' });
  });

  PERSONAS.forEach((p) => {
    docs.push({
      id: `persona-${p.id}`,
      title: `Persona: ${p.name}`,
      text: `${p.role}. ${p.quote} Pains: ${p.pains.join(', ')}. Channels: ${p.channels.join(', ')}. AOV Rs.${p.aov}.`,
      category: 'persona',
    });
  });

  AI_PROMPTS.forEach((p) => {
    docs.push({ id: `prompt-${p.id}`, title: p.title, text: `${p.prompt}\n${p.response}`, category: 'ai' });
  });

  docs.push({
    id: 'brand',
    title: 'Brand Positioning',
    text: `${ZZ.brand.positioning} Promise: ${ZZ.brand.promise}`,
    category: 'brand',
  });

  ZZ.forecast.monthly.forEach((m, i) => {
    docs.push({
      id: `forecast-${i}`,
      title: `Forecast: ${m.m}`,
      text: `${m.m}: ${m.c} customers, revenue Rs.${m.rev}, growth ${m.g}%, ${m.s}`,
      category: 'forecast',
    });
  });

  ZZ.competitors.forEach((c, i) => {
    docs.push({
      id: `comp-${i}`,
      title: `Competitor: ${c.name}`,
      text: `${c.name} type ${'type' in c ? c.type : 'Target'} price Rs.${c.price} quality ${c.quality} hygiene ${c.hygiene}`,
      category: 'competitor',
    });
  });

  return docs;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

export function searchCorpusLocal(query: string, topK = 5) {
  const qTokens = new Set(tokenize(query));
  return CORPUS.map((doc) => {
    const dTokens = tokenize(doc.text + ' ' + doc.title);
    let score = 0;
    for (const t of qTokens) {
      if (dTokens.includes(t)) score += 1;
      if (doc.title.toLowerCase().includes(t)) score += 2;
    }
    return { ...doc, score, snippet: doc.text.slice(0, 280) };
  })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
