import {
  CORPUS,
  HF_MODELS,
  cosineSimilarity,
  getHfClient,
  hasHfToken,
  searchCorpusLocal,
  withModelFallback,
} from '@/lib/ai/huggingface';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 60;

interface SearchBody {
  query: string;
  topK?: number;
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Search rate limit exceeded.', 429);

  try {
    const { query, topK = 6 } = await parseBody<SearchBody>(req);
    if (!query?.trim()) return jsonError('Query is required', 400);

    const local = searchCorpusLocal(query, topK);

    if (!hasHfToken()) {
      return jsonOk({
        results: local.map(({ id, title, snippet, category, score }) => ({
          id, title, snippet, category, score: score / 10,
        })),
        source: 'keyword',
      });
    }

    try {
      const hf = getHfClient();
      const { result: queryEmbed } = await withModelFallback(
        [HF_MODELS.embed, ...HF_MODELS.embedFallbacks],
        async (modelId) => {
          const out = await hf.featureExtraction({ model: modelId, inputs: query });
          return Array.isArray(out) ? (out as number[]) : (out as number[][])[0];
        },
      );

      const sampleDocs = CORPUS.slice(0, 40);
      const scored = await Promise.all(
        sampleDocs.map(async (doc) => {
          try {
            const out = await hf.featureExtraction({
              model: HF_MODELS.embed,
              inputs: doc.text.slice(0, 512),
            });
            const embed = Array.isArray(out) ? (out as number[]) : (out as number[][])[0];
            return { ...doc, score: cosineSimilarity(queryEmbed, embed), snippet: doc.text.slice(0, 280) };
          } catch {
            return { ...doc, score: 0, snippet: doc.text.slice(0, 280) };
          }
        }),
      );

      const semantic = scored.filter((d) => d.score > 0).sort((a, b) => b.score - a.score).slice(0, topK);
      if (semantic.length > 0) {
        return jsonOk({
          results: semantic.map(({ id, title, snippet, category, score }) => ({ id, title, snippet, category, score })),
          source: 'semantic',
        });
      }
    } catch {
      /* fall through to keyword */
    }

    return jsonOk({
      results: local.map(({ id, title, snippet, category, score }) => ({
        id, title, snippet, category, score: score / 10,
      })),
      source: 'keyword',
    });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Search failed', 500);
  }
}
