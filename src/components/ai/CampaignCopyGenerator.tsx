'use client';

import { useState } from 'react';
import { Megaphone, Copy, Loader2, Check } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';

const TYPES = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'email', label: 'Email', icon: '✉️' },
] as const;

export function CampaignCopyGenerator() {
  const [type, setType] = useState<(typeof TYPES)[number]['id']>('instagram');
  const [copy, setCopy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ copy: string }>('/api/ai/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, product: 'Student Combo Rs. 380', persona: 'UCP Student' }),
      });
      setCopy(data.copy);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const doCopy = () => {
    navigator.clipboard?.writeText(copy.replace(/\*\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-orange-400" />
        <h3 className="font-bold">AI Campaign Copy Generator</h3>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Btn key={t.id} variant={type === t.id ? 'primary' : 'secondary'} onClick={() => setType(t.id)}>
            {t.icon} {t.label}
          </Btn>
        ))}
      </div>
      <Btn onClick={generate} disabled={loading} className="mb-3 w-full justify-center">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : 'Generate Ad Copy'}
      </Btn>
      {error && <ErrorBanner message={error} onRetry={generate} />}
      {copy && (
        <div className="relative rounded-xl bg-orange-500/10 p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-stone-200">{copy}</pre>
          <button onClick={doCopy} className="absolute right-2 top-2 rounded-lg bg-white/10 p-2 hover:bg-white/20">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </GlassCard>
  );
}
