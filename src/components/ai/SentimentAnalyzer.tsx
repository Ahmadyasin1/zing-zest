'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';

const SAMPLES = [
  'The burger was amazing and the packaging looked so clean! Will come again.',
  'Too expensive for students and the queue was very long during lunch.',
  'Love the Student Combo value. Hygiene visible with gloves — finally trust street food.',
];

export function SentimentAnalyzer() {
  const [text, setText] = useState(SAMPLES[0]);
  const [result, setResult] = useState<{
    label: string; confidence: number; themes: string[]; recommendation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<{ label: string; confidence: number; themes: string[]; recommendation: string }>(
        '/api/ai/sentiment',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) },
      );
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const color = result?.label === 'Positive' ? 'text-teal-400' : result?.label === 'Negative' ? 'text-rose-400' : 'text-amber-400';

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-rose-400" />
        <h3 className="font-bold">Customer Sentiment AI</h3>
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        {SAMPLES.map((s, i) => (
          <button key={i} onClick={() => setText(s)} className="rounded-lg border border-white/10 px-2 py-1 text-[0.65rem] hover:border-orange-500/40">
            Sample {i + 1}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none"
        placeholder="Paste customer review or feedback..."
      />
      <Btn onClick={analyze} disabled={loading} className="mb-3 w-full justify-center">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</> : 'Analyze Sentiment'}
      </Btn>
      {error && <ErrorBanner message={error} onRetry={analyze} />}
      {result && (
        <div className="space-y-3 rounded-xl bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-black ${color}`}>{result.label}</span>
            <span className="text-sm text-stone-400">{result.confidence}% confidence</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {result.themes.map((t) => <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{t}</span>)}
          </div>
          <p className="text-xs text-stone-400"><strong>Action:</strong> {result.recommendation}</p>
        </div>
      )}
    </GlassCard>
  );
}
