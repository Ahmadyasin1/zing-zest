'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Leaf, Wallet, Utensils, ChevronRight } from 'lucide-react';
import { recommend, type RecoPrefs } from '@/lib/data/platform';
import { SectionHead, GlassCard, Tag } from '@/components/ui/primitives';
import { formatRs } from '@/lib/utils';

const CATEGORIES: { id: RecoPrefs['category']; label: string; emoji: string }[] = [
  { id: 'any', label: 'Anything', emoji: '🍽️' },
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'shawarma', label: 'Shawarma', emoji: '🌯' },
  { id: 'sides', label: 'Fries', emoji: '🍟' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
];

const HEAT = ['Mild', 'Medium', 'Hot', 'Blazing'];
const FILL = ['Light bite', 'Snack', 'Meal', 'Feast'];

/* ── Animated percentage bar ── */
function MatchBar({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = score;
    prev.current = score;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + (end - start) * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted font-medium">Match</span>
        <span className="font-black text-emerald-400">{displayed}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`glass rounded-xl p-5 ${tall ? 'md:p-6' : ''}`}>
      <div className="flex gap-4">
        <div className={`${tall ? 'h-24 w-24' : 'h-12 w-12'} skeleton shrink-0 rounded-2xl`} />
        <div className="flex-1 space-y-2.5">
          <div className="skeleton h-4 w-2/3 rounded-lg" />
          <div className="skeleton h-3 w-full rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
          <div className="flex gap-2 pt-1">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Recommendations() {
  const [prefs, setPrefs] = useState<RecoPrefs>({ budget: 600, spicy: 2, hunger: 2, vegOnly: false, category: 'any' });
  const [loading, setLoading] = useState(false);
  const prevPrefsRef = useRef(prefs);

  // Brief loading state when prefs change
  useEffect(() => {
    if (prevPrefsRef.current === prefs) return;
    prevPrefsRef.current = prefs;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [prefs]);

  const picks = useMemo(() => recommend(prefs, 4), [prefs]);
  const top = picks[0];

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Personalised"
        title="AI Recommendations"
        subtitle="Set your mood, budget and appetite. The engine scores every menu item on taste fit, value and popularity to serve your perfect order."
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ── Preference controls ── */}
        <GlassCard premium className="space-y-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-orange-400" /> Your preferences
          </h3>

          {/* Budget slider */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
              <Wallet className="h-3.5 w-3.5" />
              Budget per item: <span className="ml-1 text-orange-400">{formatRs(prefs.budget)}</span>
            </label>
            <div className="relative">
              <input
                type="range" min={150} max={1000} step={50}
                value={prefs.budget}
                onChange={e => setPrefs({ ...prefs, budget: +e.target.value })}
                className="w-full accent-orange-500"
                style={{ cursor: 'pointer' }}
              />
              <div className="mt-1 flex justify-between text-[0.58rem] text-muted">
                <span>Rs. 150</span><span>Rs. 1,000</span>
              </div>
            </div>
          </div>

          <Segmented icon={<Flame className="h-3.5 w-3.5" />} label="Spice level" options={HEAT} value={prefs.spicy} onChange={v => setPrefs({ ...prefs, spicy: v })} />
          <Segmented icon={<Utensils className="h-3.5 w-3.5" />} label="How hungry?" options={FILL} value={prefs.hunger} onChange={v => setPrefs({ ...prefs, hunger: v })} />

          {/* Category chips */}
          <div>
            <p className="mb-2.5 text-xs font-semibold text-muted">Craving</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setPrefs({ ...prefs, category: c.id })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    prefs.category === c.id
                      ? 'bg-orange-500 text-white shadow-[0_4px_16px_rgba(249,115,22,0.35)]'
                      : 'border border-[var(--border-medium)] text-muted hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Veg toggle */}
          <button
            onClick={() => setPrefs({ ...prefs, vegOnly: !prefs.vegOnly })}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${
              prefs.vegOnly ? 'border-emerald-500 bg-emerald-500/10' : 'border-[var(--border-medium)] hover:border-[var(--border-accent)]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-400" /> Vegetarian only
            </span>
            <span className={`relative h-5 w-9 rounded-full p-0.5 transition-colors duration-300 ${prefs.vegOnly ? 'bg-emerald-500' : 'bg-white/15'}`}>
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                className={`block h-4 w-4 rounded-full bg-white shadow ${prefs.vegOnly ? 'ml-4' : 'ml-0'}`}
              />
            </span>
          </button>
        </GlassCard>

        {/* ── Results ── */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <SkeletonCard tall />
                <SkeletonCard />
                <SkeletonCard />
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {top ? (
                  <motion.div key={top.name} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <GlassCard premium className="border-t-2 border-t-orange-500">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-orange-400">
                          <Sparkles className="h-3.5 w-3.5" /> Top match for you
                        </span>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                          {top.score}% match
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-teal-500/10">
                          <Image src={top.image} alt={top.name} width={88} height={88} className="object-contain drop-shadow-md" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-lg font-bold leading-tight">{top.name}</h3>
                            <p className="food-price shrink-0">{formatRs(top.price)}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted leading-relaxed">{top.desc}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {top.reasons.map(r => <Tag key={r} variant="teal">{r}</Tag>)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <MatchBar score={top.score} />
                      </div>
                    </GlassCard>
                  </motion.div>
                ) : (
                  <GlassCard className="py-10 text-center">
                    <p className="text-2xl mb-2">🍽️</p>
                    <p className="text-sm font-semibold text-muted">No items match these filters</p>
                    <p className="mt-1 text-xs text-muted opacity-70">Try widening your budget or changing your craving</p>
                  </GlassCard>
                )}

                {picks.slice(1).map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <GlassCard className="flex items-center gap-3 group cursor-default">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-muted">
                        #{i + 2}
                      </span>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/8 to-teal-500/8">
                        <Image src={p.image} alt={p.name} width={40} height={40} className="object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="truncate text-[0.65rem] text-muted">{p.reasons[0] ?? p.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-400">{formatRs(p.price)}</p>
                        <p className="text-[0.6rem] text-muted">{p.score}% match</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Segmented({ icon, label, options, value, onChange }: {
  icon: React.ReactNode;
  label: string;
  options: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted">{icon} {label}</p>
      <div className="flex rounded-xl bg-white/5 p-1">
        {options.map((o, i) => (
          <button
            key={o}
            onClick={() => onChange(i)}
            className={`relative flex-1 rounded-lg py-1.5 text-[0.7rem] font-semibold transition-all duration-200 ${
              value === i ? 'text-white' : 'text-muted hover:text-[var(--text-secondary)]'
            }`}
          >
            {value === i && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-lg btn-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
