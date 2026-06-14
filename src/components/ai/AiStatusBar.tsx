'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchJson } from '@/lib/utils';

interface AiFeature {
  id: string;
  name: string;
  status: string;
  icon: string;
}

export function AiStatusBar() {
  const [connected, setConnected] = useState(false);
  const [features, setFeatures] = useState<AiFeature[]>([]);

  useEffect(() => {
    fetchJson<{ connected: boolean; features: AiFeature[] }>('/api/ai/status')
      .then((d) => { setConnected(d.connected); setFeatures(d.features); })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-2xl border border-[var(--border-medium)] bg-gradient-to-r from-[var(--brand-orange-soft)] via-transparent to-[var(--brand-teal-soft)] p-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${connected ? 'animate-pulse bg-[var(--brand-teal)]' : 'bg-[var(--brand-gold)]'}`} />
          <span className="text-sm font-bold">
            AI Engine {connected ? 'Connected' : 'Offline Mode'}
          </span>
          <span className="rounded-full surface-muted px-2 py-0.5 text-[0.65rem] text-muted">
            {features.filter((f) => f.status === 'ready').length}/{features.length} features active
          </span>
        </div>
        {!connected && (
          <span className="text-[0.65rem] text-accent">Add HF_TOKEN to .env.local for full LLM + image gen</span>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {features.map((f) => (
          <div
            key={f.id}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] ${
              f.status === 'ready' ? 'tag-teal' :
              f.status === 'needs-token' ? 'tag-brand' :
              'border-[var(--border-medium)] surface-muted text-muted'
            }`}
          >
            <span>{f.icon}</span>
            {f.name}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function AiFeatureMarquee() {
  const items = [
    '🤖 ZestAI Copilot', '🎨 SDXL Image Gen', '👁️ Computer Vision', '🔍 Object Detection',
    '🔎 Semantic RAG', '📣 Campaign Copy', '🎤 Pitch Generator', '📊 Sentiment AI', '🎯 Persona Matcher',
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] py-2">
      <motion.div
        animate={{ x: [0, -800] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap px-4 text-xs font-medium text-secondary"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-gradient">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}
