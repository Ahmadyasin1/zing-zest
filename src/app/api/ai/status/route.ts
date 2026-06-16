import { HF_MODELS, hasHfToken } from '@/lib/ai/huggingface';
import { jsonOk } from '@/lib/ai/api-utils';

export async function GET() {
  return jsonOk({
    connected: hasHfToken(),
    features: [
      { id: 'chat', name: 'ZestAI Copilot', status: 'ready', icon: '💬' },
      { id: 'image', name: 'SDXL Image Gen', status: hasHfToken() ? 'ready' : 'needs-token', icon: '🎨' },
      { id: 'vision', name: 'Computer Vision', status: hasHfToken() ? 'ready' : 'needs-token', icon: '👁️' },
      { id: 'detect', name: 'Object Detection', status: hasHfToken() ? 'ready' : 'needs-token', icon: '🔍' },
      { id: 'search', name: 'Semantic RAG', status: 'ready', icon: '🔎' },
      { id: 'campaign', name: 'Campaign Copy AI', status: 'ready', icon: '📣' },
      { id: 'pitch', name: 'Pitch Generator', status: 'ready', icon: '🎤' },
      { id: 'sentiment', name: 'Sentiment Analysis', status: 'ready', icon: '📊' },
      { id: 'persona', name: 'Persona Matcher', status: 'ready', icon: '🎯' },
    ],
    models: {
      chat: HF_MODELS.chat,
      image: HF_MODELS.image,
      vision: HF_MODELS.vision,
      detect: HF_MODELS.detect,
    },
  }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
