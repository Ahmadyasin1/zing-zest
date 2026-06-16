/**
 * Full AI feature test — requires server running with HF_TOKEN in .env.local
 */
const BASE = process.env.TEST_URL || 'http://localhost:3000';

// 1x1 red PNG
const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const results = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail });
    console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name, ok: false, error: msg });
    console.error(`✗ ${name}: ${msg}`);
  }
}

async function post(path, body, timeoutMs = 120_000) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`invalid JSON (${res.status}): ${text.slice(0, 100)}`);
  }
  if (!res.ok) throw new Error(`${res.status}: ${data.error || text.slice(0, 80)}`);
  return data;
}

console.log(`AI feature test → ${BASE}\n`);

await check('Status: HF connected', async () => {
  const res = await fetch(`${BASE}/api/ai/status`);
  const d = await res.json();
  if (!d.connected) throw new Error('connected=false — restart server after .env.local');
  const ready = d.features?.filter((f) => f.status === 'ready').length ?? 0;
  return `${ready}/${d.features?.length} features ready`;
});

await check('Chat (live LLM)', async () => {
  const d = await post('/api/ai/chat', { message: 'What is our Year-1 revenue forecast?', history: [], mode: 'copilot' });
  if (d.source === 'offline') throw new Error('still offline');
  if (!d.reply?.length) throw new Error('empty reply');
  return `source=${d.source}, ${d.reply.slice(0, 60)}…`;
});

await check('Semantic search', async () => {
  const d = await post('/api/ai/search', { query: 'hygiene interview findings', topK: 3 });
  if (!d.results?.length) throw new Error('no results');
  return `source=${d.source}, ${d.results.length} hits`;
});

await check('Summarize', async () => {
  const d = await post('/api/ai/summarize', { type: 'kpi' });
  if (!d.summary?.length) throw new Error('no summary');
  return `${d.summary.slice(0, 50)}…`;
});

await check('Explain KPI', async () => {
  const d = await post('/api/ai/explain', { kpi: 'budget' });
  if (!d.explanation?.length) throw new Error('no explanation');
  return `${d.explanation.slice(0, 50)}…`;
});

await check('Sentiment', async () => {
  const d = await post('/api/ai/sentiment', { text: 'Amazing hygienic food, fast service!' });
  if (!d.label) throw new Error('no label');
  return `${d.label} (${d.source})`;
});

await check('Campaign copy', async () => {
  const d = await post('/api/ai/campaign', { type: 'instagram' });
  if (!d.copy?.length) throw new Error('no copy');
  return `source=${d.source}`;
});

await check('Pitch generator', async () => {
  const d = await post('/api/ai/pitch', { audience: 'investor', duration: '2min' });
  if (!d.pitch?.length) throw new Error('no pitch');
  return `source=${d.source}`;
});

await check('Persona matcher', async () => {
  const d = await post('/api/ai/persona-match', {
    answers: { budget: 'Under Rs. 400', time: 'Lunch (12–3 PM)', priority: 'Price & combos', channel: 'TikTok / Instagram' },
  });
  if (!d.persona?.name) throw new Error('no persona');
  return d.persona.name;
});

await check('Vision caption', async () => {
  const d = await post('/api/ai/vision', { image: TINY_PNG, task: 'caption' }, 180_000);
  if (!d.result?.length) throw new Error('no vision result');
  if (d.source === 'offline') throw new Error('vision offline');
  return `source=${d.source}, model=${d.model || 'n/a'}`;
});

await check('Object detection', async () => {
  const d = await post('/api/ai/detect', { image: TINY_PNG }, 180_000);
  if (!d.objects?.length) throw new Error('no objects');
  if (d.source === 'offline') throw new Error('detect offline');
  return `source=${d.source}, ${d.objects.length} object(s)`;
});

await check('Image generation', async () => {
  const d = await post('/api/ai/image', { prompt: 'burger and fries on food truck counter', style: 'appetizing food photo' }, 180_000);
  if (!d.image?.startsWith('data:image')) throw new Error('no image data URL');
  return `source=${d.source || 'huggingface'}, model=${d.model || 'n/a'}`;
});

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} AI tests passed`);
if (failed.length) {
  console.error('\nFailures:', failed);
  process.exit(1);
}
