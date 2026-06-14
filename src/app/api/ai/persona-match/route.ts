import { PERSONAS } from '@/lib/data/content';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 30;

interface MatchBody {
  answers: Record<string, string>;
}

const QUESTIONS = [
  { id: 'budget', label: 'Typical meal budget?', options: ['Under Rs. 400', 'Rs. 400–600', 'Rs. 600+'] },
  { id: 'time', label: 'When do you usually eat out?', options: ['Lunch (12–3 PM)', 'Evening (5–10 PM)', 'Late night'] },
  { id: 'priority', label: 'What matters most?', options: ['Price & combos', 'Hygiene & speed', 'Experience & photos'] },
  { id: 'channel', label: 'How do you discover food?', options: ['TikTok / Instagram', 'WhatsApp / colleagues', 'Friends & influencers'] },
];

function scorePersona(answers: Record<string, string>) {
  const scores = [0, 0, 0]; // student, professional, explorer
  if (answers.budget?.includes('400')) scores[0] += 3;
  if (answers.budget?.includes('600+')) scores[1] += 2;
  if (answers.budget?.includes('400–600')) scores[2] += 1;
  if (answers.time?.includes('Lunch')) scores[0] += 2;
  if (answers.time?.includes('Evening')) scores[1] += 2;
  if (answers.time?.includes('Late')) scores[2] += 3;
  if (answers.priority?.includes('Price')) scores[0] += 3;
  if (answers.priority?.includes('Hygiene')) scores[1] += 3;
  if (answers.priority?.includes('Experience')) scores[2] += 3;
  if (answers.channel?.includes('TikTok')) scores[0] += 3;
  if (answers.channel?.includes('WhatsApp')) scores[1] += 3;
  if (answers.channel?.includes('Friends')) scores[2] += 2;

  const maxIdx = scores.indexOf(Math.max(...scores));
  const persona = PERSONAS[maxIdx];
  const total = scores.reduce((a, b) => a + b, 0) || 1;
  const confidence = Math.round((scores[maxIdx] / total) * 100);

  return {
    persona,
    confidence,
    recommendedCombo: maxIdx === 0 ? 'Student Combo Rs. 380' : maxIdx === 1 ? 'Wrap Combo Rs. 350' : 'Loaded Combo Rs. 550',
    recommendedLocation: maxIdx === 0 ? 'UCP Main Gate 12–3 PM' : maxIdx === 1 ? 'Gulberg / DHA lunch windows' : 'Gulberg 5–10 PM',
    marketingTip: maxIdx === 0
      ? 'Target via TikTok reels and campus sampling.'
      : maxIdx === 1
        ? 'WhatsApp location pin at 12 PM drives conversion.'
        : 'Instagram-worthy visuals and influencer UGC.',
  };
}

export async function GET() {
  return jsonOk({ questions: QUESTIONS });
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  try {
    const { answers } = await parseBody<MatchBody>(req);
    if (!answers || Object.keys(answers).length < 2) return jsonError('Answer at least 2 questions', 400);
    const match = scorePersona(answers);
    return jsonOk({ ...match, source: 'ai-matcher' });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Persona match failed', 500);
  }
}
