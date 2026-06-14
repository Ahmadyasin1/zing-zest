/**
 * End-to-end smoke test for Zing & Zest platform (dev/prod server must be running)
 */
const BASE = process.env.TEST_URL || 'http://localhost:3000';

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`✓ ${name}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name, ok: false, error: msg });
    console.error(`✗ ${name}: ${msg}`);
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  if (text.length < 100) throw new Error(`GET ${path} → empty/short body`);
  return text;
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`POST ${path} → invalid JSON: ${text.slice(0, 120)}`);
  }
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${data.error || text}`);
  if (data.ok === false) throw new Error(`POST ${path} → ${data.error}`);
  return data;
}

console.log(`Testing ${BASE}\n`);

await check('Homepage loads', () => get('/'));

await check('GET /api/ai/status', async () => {
  const res = await fetch(`${BASE}/api/ai/status`);
  const data = await res.json();
  if (!res.ok || !data.features?.length) throw new Error('status missing features');
});

await check('POST /api/ai/chat', () =>
  post('/api/ai/chat', { message: 'What is Year-1 forecast?', history: [], mode: 'copilot' }).then(
    (d) => {
      if (!d.reply) throw new Error('no reply');
    },
  ),
);

await check('POST /api/ai/search', () =>
  post('/api/ai/search', { query: 'hygiene interview', topK: 3 }).then((d) => {
    if (!d.results?.length) throw new Error('no search results');
  }),
);

await check('POST /api/ai/summarize', () =>
  post('/api/ai/summarize', { type: 'kpi' }).then((d) => {
    if (!d.summary) throw new Error('no summary');
  }),
);

await check('POST /api/ai/explain', () =>
  post('/api/ai/explain', { kpi: 'budget' }).then((d) => {
    if (!d.explanation) throw new Error('no explanation');
  }),
);

await check('POST /api/ai/sentiment', () =>
  post('/api/ai/sentiment', { text: 'Great food and fast service!' }).then((d) => {
    if (!d.label) throw new Error('no sentiment label');
  }),
);

await check('POST /api/ai/campaign', () =>
  post('/api/ai/campaign', { type: 'instagram' }).then((d) => {
    if (!d.copy) throw new Error('no campaign copy');
  }),
);

await check('POST /api/ai/pitch', () =>
  post('/api/ai/pitch', { audience: 'investor', duration: '2min' }).then((d) => {
    if (!d.pitch) throw new Error('no pitch');
  }),
);

await check('POST /api/ai/persona-match', () =>
  post('/api/ai/persona-match', {
    answers: {
      budget: 'Under Rs. 400',
      time: 'Lunch (12–3 PM)',
      priority: 'Price & combos',
      channel: 'TikTok / Instagram',
    },
  }).then((d) => {
    if (!d.persona?.name) throw new Error('no persona match');
  }),
);

await check('POST /api/ai/chat empty body → 400', async () => {
  const res = await fetch(`${BASE}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  });
  if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
});

await check('Static logo asset', async () => {
  const res = await fetch(`${BASE}/zing_zest_logo.png`);
  if (!res.ok) throw new Error(`logo ${res.status}`);
});

await check('Team combined photo', async () => {
  const res = await fetch(`${BASE}/team/team-combined.png`);
  if (!res.ok) throw new Error(`team-combined ${res.status}`);
});

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.error('\nFailed:', failed);
  process.exit(1);
}
