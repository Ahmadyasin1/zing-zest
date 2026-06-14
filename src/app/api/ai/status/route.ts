import { hasHfToken } from '@/lib/ai/huggingface';
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
      chat: process.env.HF_CHAT_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
      image: process.env.HF_IMAGE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0',
      vision: process.env.HF_VISION_MODEL || 'Salesforce/blip-image-captioning-large',
      detect: process.env.HF_DETECT_MODEL || 'facebook/detr-resnet-50',
    },
  });
}
