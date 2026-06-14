'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';

const QUESTIONS = [
  { id: 'budget', label: 'Typical meal budget?', options: ['Under Rs. 400', 'Rs. 400–600', 'Rs. 600+'] },
  { id: 'time', label: 'When do you usually eat out?', options: ['Lunch (12–3 PM)', 'Evening (5–10 PM)', 'Late night'] },
  { id: 'priority', label: 'What matters most?', options: ['Price & combos', 'Hygiene & speed', 'Experience & photos'] },
  { id: 'channel', label: 'How do you discover food?', options: ['TikTok / Instagram', 'WhatsApp / colleagues', 'Friends & influencers'] },
];

export function PersonaMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    persona: { name: string; avatar: string; role: string; quote: string };
    confidence: number;
    recommendedCombo: string;
    recommendedLocation: string;
    marketingTip: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const q = QUESTIONS[step];

  const select = (opt: string) => {
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else submit(next);
  };

  const submit = async (final: Record<string, string>) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchJson<typeof result & object>('/api/ai/persona-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: final }),
      });
      setResult(data as NonNullable<typeof result>);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-violet-400" />
        <h3 className="font-bold">AI Persona Matcher</h3>
        <span className="text-[0.65rem] text-stone-500">Interactive quiz</span>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-2 flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <p className="mb-1 text-xs text-stone-500">Question {step + 1} of {QUESTIONS.length}</p>
            <h4 className="mb-4 text-lg font-bold">{q.label}</h4>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => select(opt)}
                  disabled={loading}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:border-orange-500/40 hover:bg-orange-500/5"
                >
                  {opt}
                  <ChevronRight className="h-4 w-4 text-stone-500" />
                </button>
              ))}
            </div>
            {loading && <div className="mt-4 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-orange-400" /></div>}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <span className="text-5xl">{result.persona.avatar}</span>
            <h4 className="mt-2 text-xl font-black text-gradient">{result.persona.name}</h4>
            <p className="text-sm text-stone-400">{result.persona.role}</p>
            <p className="mt-2 text-xs italic text-stone-500">{result.persona.quote}</p>
            <div className="mt-4 grid gap-2 text-left text-sm">
              <div className="rounded-lg bg-white/5 p-2"><span className="text-stone-500">Match confidence:</span> <strong className="text-orange-400">{result.confidence}%</strong></div>
              <div className="rounded-lg bg-white/5 p-2"><span className="text-stone-500">Recommended:</span> {result.recommendedCombo}</div>
              <div className="rounded-lg bg-white/5 p-2"><span className="text-stone-500">Visit:</span> {result.recommendedLocation}</div>
              <div className="rounded-lg bg-teal-500/10 p-2 text-teal-300">{result.marketingTip}</div>
            </div>
            <Btn onClick={reset} variant="secondary" className="mt-4">Retake Quiz</Btn>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <ErrorBanner message={error} />}
    </GlassCard>
  );
}
