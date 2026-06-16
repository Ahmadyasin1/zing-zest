'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';
import { ZZ } from '@/lib/data/zz';

const KPIS = [
  { key: 'interviews', label: '20 Interviews', icon: '🔬' },
  { key: 'budget', label: 'Rs. 45,150 IMC', icon: '📣' },
  { key: 'day1', label: '100 Day-1 Target', icon: '🎯' },
  { key: 'revenue', label: 'Rs. 5.9M Forecast', icon: '📈' },
  { key: 'margin', label: '24% Margin', icon: '💰' },
  { key: 'crisis', label: '25% Crisis Plan', icon: '🚨' },
];

export function InsightCards() {
  const [summary, setSummary] = useState('');
  const [explain, setExplain] = useState('');
  const [loading, setLoading] = useState<'summary' | 'explain' | ''>('');
  const [error, setError] = useState('');

  const runSummary = async () => {
    setLoading('summary');
    setError('');
    try {
      const data = await fetchJson<{ summary: string }>('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'kpi' }),
      });
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Summary failed');
    } finally {
      setLoading('');
    }
  };

  const runExplain = async (kpi: string) => {
    setLoading('explain');
    setError('');
    try {
      const data = await fetchJson<{ explanation: string }>('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kpi }),
      });
      setExplain(data.explanation);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Explain failed');
    } finally {
      setLoading('');
    }
  };

  const trends = ZZ.forecast.monthly.filter((m) => Math.abs(m.g) >= 10).slice(0, 4);

  return (
    <div className="space-y-6">
      <GlassCard premium>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-orange-soft)] to-[var(--brand-violet-soft)] shadow-[0_0_24px_var(--glow-orange)]">
              <Sparkles className="accent-orange h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow mb-1">Live AI</p>
              <h3 className="font-display text-lg font-extrabold tracking-tight">Insight Engine</h3>
            </div>
          </div>
          <Btn onClick={runSummary} disabled={loading === 'summary'}>
            {loading === 'summary' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Auto-Summary'}
          </Btn>
        </div>
        {summary && (
          <div className="rounded-xl border border-[var(--border-accent)] bg-gradient-to-br from-[var(--brand-orange-soft)] to-transparent p-5 text-sm leading-relaxed whitespace-pre-wrap">{summary}</div>
        )}
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KPIS.map((k) => (
          <button
            key={k.key}
            onClick={() => runExplain(k.key)}
            disabled={loading === 'explain'}
            className="glass-premium card-hover rounded-2xl p-4 text-left"
          >
            <span className="text-2xl">{k.icon}</span>
            <p className="font-display mt-3 font-bold">{k.label}</p>
            <p className="text-muted mt-1 text-[0.65rem]">Click for AI explanation</p>
          </button>
        ))}
      </div>

      {explain && (
        <GlassCard premium>
          <p className="eyebrow mb-3">Explainer</p>
          <div className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">{explain}</div>
        </GlassCard>
      )}

      <GlassCard>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg highlight-teal">
            <TrendingUp className="accent-teal h-4 w-4" />
          </div>
          <h4 className="font-display font-extrabold">Trend Detection</h4>
        </div>
        <div className="space-y-2">
          {trends.map((t) => (
            <div key={t.m} className="surface-muted flex items-center justify-between rounded-xl px-4 py-2.5 text-sm">
              <span className="font-medium">{t.m}</span>
              <span className={t.g >= 0 ? 'accent-teal font-bold' : 'text-[var(--brand-coral)] font-bold'}>{t.g >= 0 ? '+' : ''}{t.g}%</span>
              <span className="text-muted text-xs">{t.s}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {error && <ErrorBanner message={error} />}
    </div>
  );
}
