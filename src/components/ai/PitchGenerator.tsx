'use client';

import { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';

const AUDIENCES = [
  { id: 'investor', label: 'Investor Pitch', icon: '💼' },
  { id: 'professor', label: 'Professor / Academic', icon: '🎓' },
  { id: 'customer', label: 'Customer Hook', icon: '🍔' },
] as const;

export function PitchGenerator() {
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]['id']>('investor');
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ pitch: string }>('/api/ai/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience, duration: audience === 'customer' ? '30sec' : '2min' }),
      });
      setPitch(data.pitch);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Mic className="h-5 w-5 text-teal-400" />
        <h3 className="font-bold">AI Pitch Generator</h3>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {AUDIENCES.map((a) => (
          <Btn key={a.id} variant={audience === a.id ? 'primary' : 'secondary'} onClick={() => setAudience(a.id)}>
            {a.icon} {a.label}
          </Btn>
        ))}
      </div>
      <Btn onClick={generate} disabled={loading} className="mb-3 w-full justify-center">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Crafting pitch…</> : 'Generate Pitch'}
      </Btn>
      {error && <ErrorBanner message={error} onRetry={generate} />}
      {pitch && (
        <div className="rounded-xl bg-teal-500/10 p-4 text-sm leading-relaxed text-secondary whitespace-pre-wrap">{pitch}</div>
      )}
    </GlassCard>
  );
}
