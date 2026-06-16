import {
  HF_MODELS,
  buildChatSystemPrompt,
  getHfClient,
  hasHfToken,
  localFallbackChat,
  searchCorpusLocal,
  withModelFallback,
} from '@/lib/ai/huggingface';
import { checkRateLimit, jsonError, jsonOk, parseBody, rateLimitKey } from '@/lib/ai/api-utils';

export const maxDuration = 60;

interface ChatBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  mode?: 'copilot' | 'explain' | 'summary';
}

export async function POST(req: Request) {
  const key = rateLimitKey(req);
  if (!checkRateLimit(key)) return jsonError('Rate limit exceeded. Please wait a moment.', 429);

  let message = '';
  try {
    const body = await parseBody<ChatBody>(req);
    message = body.message ?? '';
    const { history = [], mode = 'copilot' } = body;
    if (!message.trim()) return jsonError('Message is required', 400);

    const rag = searchCorpusLocal(message, 4);
    const ragContext = rag.map((r) => `[${r.title}]: ${r.text.slice(0, 400)}`).join('\n\n');

    if (!hasHfToken()) {
      return jsonOk({
        reply: localFallbackChat(message),
        source: 'offline',
        rag: rag.map(({ title, snippet, category }) => ({ title, snippet, category })),
      });
    }

    const system = `${buildChatSystemPrompt(mode)}\n\nRetrieved context:\n${ragContext}`;
    const messages = [
      { role: 'system' as const, content: system },
      ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: message },
    ];

    const { result, model } = await withModelFallback(
      [HF_MODELS.chat, ...HF_MODELS.chatFallbacks],
      async (modelId) => {
        const hf = getHfClient();
        const out = await hf.chatCompletion({
          model: modelId,
          messages,
          max_tokens: 512,
          temperature: 0.7,
        });
        const reply = out.choices?.[0]?.message?.content?.trim();
        if (reply) return reply;
        throw new Error('Empty chat response');
      },
    );

    return jsonOk({
      reply: result,
      model,
      source: 'huggingface',
      rag: rag.map(({ title, snippet, category }) => ({ title, snippet, category })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Chat failed';
    if (/body|JSON/i.test(msg)) return jsonError(msg, 400);
    if (!message.trim()) return jsonError('Message is required', 400);
    return jsonOk({
      reply: localFallbackChat(message || 'Hello'),
      source: 'offline',
      rag: message ? searchCorpusLocal(message, 4).map(({ title, snippet, category }) => ({ title, snippet, category })) : [],
      notice: 'Live AI unavailable - showing offline response.',
    });
  }
}
