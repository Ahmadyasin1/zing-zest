'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Leaf, Wallet, Utensils } from 'lucide-react';
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

export function Recommendations() {
  const [prefs, setPrefs] = useState<RecoPrefs>({ budget: 600, spicy: 2, hunger: 2, vegOnly: false, category: 'any' });

  const picks = useMemo(() => recommend(prefs, 4), [prefs]);
  const top = picks[0];

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Personalised"
        title="AI Recommendations"
        subtitle="Tell us your mood, budget and appetite - our recommendation engine scores every menu item on taste fit, value and popularity to suggest your perfect order."
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* ── Preference controls ── */}
        <GlassCard premium className="space-y-5">
          <h3 className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-orange-400" /> Your preferences</h3>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted"><Wallet className="h-3.5 w-3.5" /> Budget per item: <span className="text-orange-400">{formatRs(prefs.budget)}</span></label>
            <input type="range" min={150} max={1000} step={50} value={prefs.budget} onChange={(e) => setPrefs({ ...prefs, budget: +e.target.value })} className="w-full accent-orange-500" />
          </div>

          <Segmented icon={<Flame className="h-3.5 w-3.5" />} label="Spice level" options={HEAT} value={prefs.spicy} onChange={(v) => setPrefs({ ...prefs, spicy: v })} />
          <Segmented icon={<Utensils className="h-3.5 w-3.5" />} label="How hungry?" options={FILL} value={prefs.hunger} onChange={(v) => setPrefs({ ...prefs, hunger: v })} />

          <div>
            <p className="mb-2 text-xs font-semibold text-muted">Craving</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setPrefs({ ...prefs, category: c.id })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    prefs.category === c.id ? 'bg-orange-500 text-white' : 'border border-[var(--border-medium)] text-muted hover:text-[var(--text-primary)]'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPrefs({ ...prefs, vegOnly: !prefs.vegOnly })}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
              prefs.vegOnly ? 'border-emerald-500 bg-emerald-500/10' : 'border-[var(--border-medium)]'
            }`}
          >
            <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-emerald-400" /> Vegetarian only</span>
            <span className={`h-5 w-9 rounded-full p-0.5 transition ${prefs.vegOnly ? 'bg-emerald-500' : 'bg-white/15'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition ${prefs.vegOnly ? 'translate-x-4' : ''}`} />
            </span>
          </button>
        </GlassCard>

        {/* ── Top pick + ranked list ── */}
        <div className="space-y-4">
          {top ? (
            <motion.div key={top.name} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard premium className="border-t-2 border-t-orange-500">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-orange-400"><Sparkles className="h-3.5 w-3.5" /> Top match for you</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{top.score}% match</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/5">
                    <Image src={top.image} alt={top.name} width={88} height={88} className="object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-bold">{top.name}</h3>
                      <p className="food-price shrink-0">{formatRs(top.price)}</p>
                    </div>
                    <p className="text-muted mt-1 text-xs">{top.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {top.reasons.map((r) => <Tag key={r} variant="teal">{r}</Tag>)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="text-center text-sm text-muted">No items match these filters - try widening your budget or craving.</GlassCard>
          )}

          {picks.slice(1).map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-muted">#{i + 2}</span>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Image src={p.image} alt={p.name} width={40} height={40} className="object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-muted truncate text-[0.65rem]">{p.reasons[0] ?? p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-400">{formatRs(p.price)}</p>
                  <p className="text-muted text-[0.6rem]">{p.score}% match</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Segmented({
  icon, label, options, value, onChange,
}: {
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
            className={`flex-1 rounded-lg py-1.5 text-[0.7rem] font-semibold transition ${
              value === i ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white' : 'text-muted'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
