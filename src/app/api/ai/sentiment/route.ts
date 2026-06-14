import { getHfClient, hasHfToken, withModelFallback } from '@/lib/ai/huggingface';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 45;

interface SentimentBody {
  text: string;
}

function offlineSentiment(text: string) {
  const lower = text.toLowerCase();
  const pos = ['good', 'great', 'love', 'hygien', 'clean', 'fast', 'delicious', 'best', 'amazing', 'fresh'].filter((w) => lower.includes(w)).length;
  const neg = ['bad', 'dirty', 'slow', 'expensive', 'worst', 'hygiene issue', 'cold', 'rude'].filter((w) => lower.includes(w)).length;
  const score = pos - neg;
  const label = score > 1 ? 'Positive' : score < -1 ? 'Negative' : 'Neutral';
  const pct = label === 'Positive' ? 74 : label === 'Negative' ? 12 : 45;
  return {
    label,
    score: Math.max(-1, Math.min(1, score / 3)),
    confidence: pct,
    themes: pos > 0 ? ['Quality', 'Hygiene', 'Speed'] : neg > 0 ? ['Price', 'Wait Time'] : ['General Feedback'],
    recommendation: label === 'Positive'
      ? 'Amplify in UGC campaigns and Instagram reposts.'
      : label === 'Negative'
        ? 'Address in WhatsApp response template and recovery Phase 1.'
        : 'Request specific rating via QR feedback at truck window.',
  };
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded.', 429);

  try {
    const { text } = await parseBody<SentimentBody>(req);
    if (!text?.trim()) return jsonError('Text is required', 400);

    if (!hasHfToken()) {
      return jsonOk({ ...offlineSentiment(text), source: 'offline' });
    }

    try {
      const { result, model } = await withModelFallback(
        ['cardiffnlp/twitter-roberta-base-sentiment-latest', 'distilbert-base-uncased-finetuned-sst-2-english'],
        async (modelId) => {
          const hf = getHfClient();
          const out = await hf.textClassification({ model: modelId, inputs: text.slice(0, 512) });
          const top = Array.isArray(out) ? out[0] : out;
          const items = Array.isArray(top) ? top : [top];
          const best = items.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
          return { label: best?.label || 'Neutral', score: best?.score || 0.5 };
        },
      );

      const labelMap: Record<string, string> = { LABEL_0: 'Negative', LABEL_1: 'Neutral', LABEL_2: 'Positive', NEGATIVE: 'Negative', POSITIVE: 'Positive' };
      const label = labelMap[result.label] || result.label;

      return jsonOk({
        label,
        score: result.score,
        confidence: Math.round(result.score * 100),
        themes: label === 'Positive' ? ['Quality', 'Hygiene', 'Value'] : ['Service', 'Price'],
        recommendation: label === 'Positive' ? 'Feature in social proof content.' : 'Route to recovery playbook.',
        model,
        source: 'huggingface',
      });
    } catch {
      return jsonOk({ ...offlineSentiment(text), source: 'keyword' });
    }
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Sentiment analysis failed', 500);
  }
}
