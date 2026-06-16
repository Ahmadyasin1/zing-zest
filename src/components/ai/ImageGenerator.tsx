'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';
import Image from 'next/image';

const PRESETS = [
  'Student Combo with fries and drink on branded packaging',
  'Modern orange food truck at UCP campus gate',
  'Loaded Zing Fries with masala crunch close-up',
  'Instagram-worthy shawarma wrap with hygiene gloves visible',
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState(PRESETS[0]);
  const [style, setStyle] = useState('professional food photography, cinematic lighting');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ image: string }>('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      setImage(data.image);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-orange-400" />
        <h3 className="font-bold">AI Image Generator</h3>
        <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[0.65rem] text-teal-400">Stable Diffusion XL</span>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setPrompt(p)} className="rounded-lg border border-white/10 px-2 py-1 text-[0.68rem] hover:border-orange-500/40">
            {p.slice(0, 35)}…
          </button>
        ))}
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none"
        placeholder="Describe your marketing visual..."
      />
      <input
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        placeholder="Style (e.g. cinematic, flat lay)"
      />
      <Btn onClick={generate} disabled={loading} className="mb-4 w-full justify-center">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : 'Generate Marketing Visual'}
      </Btn>
      {error && <ErrorBanner message={error} onRetry={generate} />}
      {image && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-xl border border-white/10">
          <Image src={image} alt="AI generated" width={512} height={512} className="h-auto w-full" unoptimized />
        </motion.div>
      )}
      {!image && !loading && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-muted">
          Generated images appear here
        </div>
      )}
    </GlassCard>
  );
}
