'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AiFeature {
  id: string;
  name: string;
  status: string;
  icon: string;
}

const CACHE_KEY = 'zz-ai-status';
const CACHE_TTL_MS = 60_000;

function readCache(): { connected: boolean; features: AiFeature[] } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: { connected: boolean; features: AiFeature[] } };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: { connected: boolean; features: AiFeature[] }) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* ignore quota */
  }
}

export function AiStatusBar() {
  const [connected, setConnected] = useState(false);
  const [features, setFeatures] = useState<AiFeature[]>([]);

  useEffect(() => {
    const hit = readCache();
    if (hit) {
      setConnected(hit.connected);
      setFeatures(hit.features);
      return;
    }

    const ctrl = new AbortController();
    fetch('/api/ai/status', { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: { connected: boolean; features: AiFeature[] }) => {
        setConnected(d.connected);
        setFeatures(d.features);
        writeCache(d);
      })
      .catch(() => {});

    return () => ctrl.abort();
  }, []);

  const active = features.filter((f) => f.status === 'ready').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="elite-status-bar holo-panel mb-6 rounded-xl p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-orange-soft)] to-[var(--brand-teal-soft)]">
            <Sparkles className="h-4 w-4 accent-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connected ? 'animate-pulse bg-[var(--brand-teal)] shadow-[0_0_8px_var(--glow-teal)]' : 'bg-[var(--brand-gold)]'}`} />
              <span className="font-cyber text-sm font-bold">
                Neural Engine {connected ? 'Online' : 'Offline Mode'}
              </span>
            </div>
            <p className="text-muted text-[0.65rem]">
              {features.length ? `${active}/${features.length} features active` : 'Checking status…'} · Hugging Face
            </p>
          </div>
        </div>
        {!connected && (
          <span className="tag-brand rounded-full px-3 py-1 text-[0.65rem] font-bold">
            Add HF_TOKEN for full AI
          </span>
        )}
      </div>
      {features.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {features.map((f) => (
            <div
              key={f.id}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold transition-transform hover:scale-105 ${
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
      )}
    </motion.div>
  );
}

export function AiFeatureMarquee() {
  const items = [
    '🤖 ZestAI Copilot', '🎨 SDXL Image Gen', '👁️ Computer Vision', '🔍 Object Detection',
    '🔎 Semantic RAG', '📣 Campaign Copy', '🎤 Pitch Generator', '📊 Sentiment AI', '🎯 Persona Matcher',
  ];
  return (
    <div className="marquee-elite holo-panel relative mb-6 rounded-xl py-3">
      <motion.div
        animate={{ x: [0, -900] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex gap-10 whitespace-nowrap px-6 text-xs font-semibold tracking-wide"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-holo font-tech">{item}</span>
        ))}
      </motion.div>
    </div>
  );
}
