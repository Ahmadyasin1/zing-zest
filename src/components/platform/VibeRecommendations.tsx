'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Wallet, ShoppingCart, Check, ChevronRight, Flame } from 'lucide-react';
import { SectionHead, GlassCard, Btn } from '@/components/ui/primitives';
import { useCart } from '@/components/providers/CartProvider';
import { useNav } from '@/components/providers/NavProvider';
import { formatRs } from '@/lib/utils';
import { ZZ } from '@/lib/data/zz';

// ─── Types ───────────────────────────────────────────────────────────────────
type ZZItem = (typeof ZZ.menu.items)[number];
type ZZCombo = (typeof ZZ.menu.combos)[number];
type AnyItem = ZZItem | ZZCombo;

const getCategory = (item: AnyItem) => ('category' in item ? item.category : 'combo');
const getTag = (item: AnyItem) => ('tag' in item ? item.tag : undefined);

// ─── Simulated trending data (seeded by hour so it feels "live") ──────────────
const HOUR = new Date().getHours();
const seed = (n: number) => ((n * HOUR * 7 + 13) % 80) + 20;

const TRENDING_ITEMS = [
  { name: 'Smoky Grill Burger',     price: 380, category: 'burgers',  image: '/food/burger.png',   tag: 'Bestseller', base: seed(1)  + 40, trendPct: 23, spark: '🔥' },
  { name: 'Student Combo',          price: 380, category: 'combo',    image: '/food/combo.png',    tag: 'Top Pick',   base: seed(2)  + 20, trendPct: 18, spark: '📈' },
  { name: 'Masala Crunch Fries',    price: 150, category: 'sides',    image: '/food/fries.png',    tag: 'Spicy',      base: seed(3),        trendPct: 12, spark: '🚀' },
  { name: 'Zesty Chicken Shawarma', price: 250, category: 'shawarma', image: '/food/shawarma.png', tag: 'Popular',    base: seed(4)  + 10, trendPct: 9,  spark: '⚡' },
  { name: 'Loaded Combo',           price: 550, category: 'combo',    image: '/food/combo.png',    tag: 'Premium',    base: seed(5),        trendPct: 7,  spark: '💥' },
  { name: 'Street Mango Shake',     price: 350, category: 'drinks',   image: '/food/drink.png',    tag: 'Popular',    base: seed(6),        trendPct: 6,  spark: '✨' },
];

// ─── Flavor DNA pairs ─────────────────────────────────────────────────────────
const FLAVOR_PAIRS = [
  { id: 'heat',    left: { label: 'Spicy',    emoji: '🌶️' }, right: { label: 'Mild',       emoji: '🌿' } },
  { id: 'texture', left: { label: 'Crispy',   emoji: '🍟' }, right: { label: 'Soft',        emoji: '🫓' } },
  { id: 'boldness',left: { label: 'Bold',     emoji: '💥' }, right: { label: 'Subtle',      emoji: '✨' } },
  { id: 'fill',    left: { label: 'Hearty',   emoji: '🥩' }, right: { label: 'Light',       emoji: '🥗' } },
  { id: 'style',   left: { label: 'Classic',  emoji: '🏆' }, right: { label: 'Adventurous', emoji: '🎲' } },
];
type FlavorPicks = Partial<Record<string, 'left' | 'right'>>;

function flavorScore(item: AnyItem, picks: FlavorPicks): number {
  const cat = getCategory(item);
  const tag = getTag(item);
  let score = 50;

  if (picks.heat === 'left') {
    if (tag === 'Spicy' || cat === 'shawarma') score += 20;
    if (cat === 'sides') score += 8;
  } else if (picks.heat === 'right') {
    if (cat === 'drinks') score += 15;
    if (cat === 'burgers' && tag !== 'Spicy') score += 10;
  }
  if (picks.texture === 'left') {
    if (cat === 'sides') score += 25;
    if (tag === 'Loaded' || tag === 'Spicy') score += 15;
  } else if (picks.texture === 'right') {
    if (cat === 'shawarma') score += 20;
    if (cat === 'combo') score += 8;
  }
  if (picks.boldness === 'left') {
    if (tag === 'Loaded' || tag === 'Premium' || tag === 'Hearty') score += 20;
    if (cat === 'combo') score += 10;
  } else if (picks.boldness === 'right') {
    if (cat === 'drinks') score += 20;
    if (tag === 'Classic') score += 15;
  }
  if (picks.fill === 'left') {
    if (cat === 'combo') score += 20;
    if (cat === 'burgers') score += 12;
  } else if (picks.fill === 'right') {
    if (cat === 'drinks') score += 15;
    if (cat === 'shawarma') score += 10;
  }
  if (picks.style === 'left') {
    if (tag === 'Classic' || tag === 'Top Pick' || tag === 'Bestseller') score += 20;
  } else if (picks.style === 'right') {
    if (tag === 'Signature' || tag === 'Veg' || tag === 'Refresher') score += 20;
    if (cat === 'drinks') score += 10;
  }

  return Math.min(98, Math.max(51, Math.round(score + Math.random() * 6 - 3)));
}

// ─── Budget optimizer ─────────────────────────────────────────────────────────
interface MealOption { label: string; items: { name: string; price: number }[]; total: number; saving?: number; valueScore: number }

function buildBudgetOptions(budget: number): MealOption[] {
  const options: MealOption[] = [];
  const allItems = ZZ.menu.items;
  const allCombos = ZZ.menu.combos;

  // Best single combo within budget
  const bestCombo = [...allCombos].filter(c => c.price <= budget).sort((a, b) => b.price - a.price)[0];
  if (bestCombo) {
    const leftover = budget - bestCombo.price;
    const extra = allItems.filter(i => i.price <= leftover && i.category === 'drinks').sort((a, b) => b.price - a.price)[0];
    options.push({
      label: '🎁 Best Combo',
      items: extra ? [{ name: bestCombo.name, price: bestCombo.price }, { name: extra.name, price: extra.price }] : [{ name: bestCombo.name, price: bestCombo.price }],
      total: bestCombo.price + (extra?.price ?? 0),
      saving: Math.round((bestCombo.price + (extra?.price ?? 0)) * 0.08),
      valueScore: Math.min(98, 70 + Math.round((bestCombo.price / budget) * 28)),
    });
  }

  // Build-your-own: best main + side + drink
  const main = allItems.filter(i => (i.category === 'burgers' || i.category === 'shawarma') && i.price <= budget - 100).sort((a, b) => b.price - a.price)[0];
  if (main) {
    const remaining1 = budget - main.price;
    const side = allItems.filter(i => i.category === 'sides' && i.price <= remaining1 - 50).sort((a, b) => b.price - a.price)[0];
    const remaining2 = remaining1 - (side?.price ?? 0);
    const drink = allItems.filter(i => i.category === 'drinks' && i.price <= remaining2).sort((a, b) => b.price - a.price)[0];
    const items = [main, side, drink].filter(Boolean).map(x => ({ name: x!.name, price: x!.price }));
    const total = items.reduce((s, i) => s + i.price, 0);
    if (total > 0 && (!options[0] || total !== options[0].total)) {
      options.push({ label: '⚡ Build-Your-Own', items, total, valueScore: Math.min(95, 60 + Math.round((total / budget) * 35)) });
    }
  }

  // Max value: fill up to budget with highest-rated individual items
  const sorted = [...allItems].filter(i => i.price <= budget).sort((a, b) => b.price - a.price);
  let remaining = budget;
  const maxItems: { name: string; price: number }[] = [];
  for (const item of sorted) {
    if (item.price <= remaining && !maxItems.find(x => x.name === item.name)) {
      maxItems.push({ name: item.name, price: item.price });
      remaining -= item.price;
      if (maxItems.length >= 3) break;
    }
  }
  if (maxItems.length > 0) {
    const total = maxItems.reduce((s, i) => s + i.price, 0);
    options.push({ label: '💡 Max Value', items: maxItems, total, valueScore: Math.min(92, 55 + Math.round((total / budget) * 37)) });
  }

  return options.slice(0, 3);
}

// ─── Shared Add-to-cart button ────────────────────────────────────────────────
function AddBtn({ name, price, category, image, isCombo }: { name: string; price: number; category: string; image: string; isCombo?: boolean }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const qty = items.find(i => i.name === name)?.qty ?? 0;
  const handleAdd = () => { add({ name, price, category, image, isCombo }); setAdded(true); setTimeout(() => setAdded(false), 1100); };
  return (
    <button onClick={handleAdd} className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${added ? 'bg-emerald-500/20 text-emerald-400' : 'btn-primary text-white'}`}>
      {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
      {added ? 'Added!' : qty > 0 ? `Add (${qty})` : 'Add'}
    </button>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, color = 'orange' }: { score: number; color?: 'orange' | 'teal' | 'violet' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = () => { v = Math.min(score, v + 3); setN(v); if (v < score) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [score]);
  const grad = color === 'orange' ? 'from-orange-500 to-amber-400' : color === 'teal' ? 'from-teal-500 to-cyan-400' : 'from-violet-500 to-fuchsia-400';
  const text = color === 'orange' ? 'text-orange-400' : color === 'teal' ? 'text-teal-400' : 'text-violet-400';
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-[0.6rem]">
        <span className="text-muted">match</span>
        <span className={`font-bold ${text}`}>{n}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${grad}`} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'trending', label: 'Trending', icon: <TrendingUp className="h-3.5 w-3.5" />, badge: '🔥 Live' },
  { id: 'dna',      label: 'Flavor DNA', icon: <Zap className="h-3.5 w-3.5" />,         badge: '🧬 New' },
  { id: 'budget',   label: 'Budget Builder', icon: <Wallet className="h-3.5 w-3.5" />,  badge: '💰' },
] as const;
type TabId = typeof TABS[number]['id'];

// ═══════════════════════════════════════════════════════════════════════════════
export function VibeRecommendations() {
  const { goTo } = useNav();
  const [tab, setTab] = useState<TabId>('trending');

  return (
    <div className="space-y-5">
      <SectionHead
        eyebrow="Smart Recommendations"
        title="Three ways to find your perfect bite"
        subtitle="Live trends, flavor profiling, and budget optimization. Pick your mode."
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl border border-[var(--border-medium)] bg-white/3 p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${tab === t.id ? 'text-white shadow-sm' : 'text-muted hover:text-[var(--text-primary)]'}`}
          >
            {tab === t.id && (
              <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500" style={{ zIndex: -1 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
            )}
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[0.55rem] font-bold">{t.badge}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'trending' && (
          <motion.div key="trending" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <TrendingPanel goTo={goTo} />
          </motion.div>
        )}
        {tab === 'dna' && (
          <motion.div key="dna" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <FlavorDnaPanel goTo={goTo} />
          </motion.div>
        )}
        {tab === 'budget' && (
          <motion.div key="budget" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <BudgetPanel goTo={goTo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 1 — Trending Now
// ═══════════════════════════════════════════════════════════════════════════════
function TrendingPanel({ goTo }: { goTo: (p: 'checkout' | 'cover') => void }) {
  const [counts, setCounts] = useState(TRENDING_ITEMS.map(i => i.base));
  const [tick, setTick] = useState(0);
  const [justUpdated, setJustUpdated] = useState<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setCounts(prev => {
        const next = prev.map((c, i) => c + Math.floor(Math.random() * 4));
        const changed = next.map((n, i) => n !== prev[i] ? i : -1).filter(x => x >= 0);
        setJustUpdated(changed);
        setTimeout(() => setJustUpdated([]), 800);
        return next;
      });
      setTick(t => t + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const peakLabel = HOUR < 11 ? 'Morning' : HOUR < 15 ? '🔥 Lunch Peak' : HOUR < 18 ? 'Afternoon' : HOUR < 21 ? '🌙 Evening Rush' : 'Late Night';

  return (
    <div className="space-y-4">
      {/* Live header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          <span className="text-sm font-bold">Live Orders · {peakLabel}</span>
        </div>
        <span className="text-[0.65rem] text-muted">updates every 3s · simulated</span>
      </div>

      {/* Leaderboard */}
      <GlassCard className="p-0">
        {TRENDING_ITEMS.map((item, idx) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 border-b border-[var(--border-medium)] px-4 py-3.5 last:border-0 transition-colors duration-500 ${justUpdated.includes(idx) ? 'bg-orange-500/6' : ''}`}
          >
            {/* Rank */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-slate-500/20 text-slate-400' : idx === 2 ? 'bg-orange-900/20 text-orange-700' : 'bg-white/5 text-muted'}`}>
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
            </div>

            {/* Image */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-10 w-10 object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold">{item.name}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[0.65rem] text-muted">
                <span className="text-orange-400 font-semibold">{formatRs(item.price)}</span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" /> +{item.trendPct}% today</span>
              </div>
            </div>

            {/* Live count */}
            <div className="flex flex-col items-end gap-1">
              <motion.span
                key={counts[idx]}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-sm font-black tabular-nums"
              >
                {counts[idx]}
              </motion.span>
              <span className="text-[0.6rem] text-muted">orders</span>
            </div>

            {/* Spark + add */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-lg">{item.spark}</span>
              <AddBtn name={item.name} price={item.price} category={item.category} image={item.image} isCombo={item.category === 'combo'} />
            </div>
          </div>
        ))}
      </GlassCard>

      {/* Heat bar */}
      <GlassCard>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Order activity by hour</p>
        <div className="flex h-16 items-end gap-1">
          {Array.from({ length: 13 }, (_, i) => {
            const h = i + 10;
            const heat = h === 12 || h === 13 ? 95 : h === 18 || h === 19 ? 85 : h === 20 ? 70 : h === 14 ? 60 : h === 11 || h === 22 ? 40 : 20;
            const active = h === Math.min(22, Math.max(10, HOUR));
            return (
              <div key={h} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className={`w-full rounded-t-sm ${active ? 'bg-orange-500' : 'bg-white/15'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${heat}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
                <span className="text-[0.5rem] text-muted">{h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <Btn onClick={() => goTo('checkout')}><ShoppingCart className="h-4 w-4" /> Go to Checkout</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 2 — Flavor DNA
// ═══════════════════════════════════════════════════════════════════════════════
function FlavorDnaPanel({ goTo }: { goTo: (p: 'checkout') => void }) {
  const [picks, setPicks] = useState<FlavorPicks>({});
  const [results, setResults] = useState<{ item: AnyItem; score: number }[] | null>(null);

  const allItems: AnyItem[] = [...ZZ.menu.items, ...ZZ.menu.combos];
  const done = Object.keys(picks).length === FLAVOR_PAIRS.length;

  const pick = (id: string, side: 'left' | 'right') => {
    const updated = { ...picks, [id]: side };
    setPicks(updated);
    if (Object.keys(updated).length === FLAVOR_PAIRS.length) {
      const scored = allItems
        .map(item => ({ item, score: flavorScore(item, updated) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
      setResults(scored);
    }
  };

  const reset = () => { setPicks({}); setResults(null); };

  // DNA tag cloud — flavors the user leaned toward
  const dnaLabels = FLAVOR_PAIRS.filter(p => picks[p.id]).map(p => picks[p.id] === 'left' ? p.left : p.right);

  return (
    <div className="space-y-4">
      {!done ? (
        <>
          <p className="text-sm text-muted">Pick one from each pair and we will map your flavor fingerprint.</p>
          {/* Progress */}
          <div className="flex gap-1">
            {FLAVOR_PAIRS.map((p, i) => (
              <div key={p.id} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${picks[p.id] ? 'bg-orange-500' : 'bg-white/10'}`} />
            ))}
          </div>

          {FLAVOR_PAIRS.map((pair, pairIdx) => (
            <motion.div key={pair.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pairIdx * 0.06 }}>
              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted">Pick {pairIdx + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['left', 'right'] as const).map(side => {
                  const opt = side === 'left' ? pair.left : pair.right;
                  const chosen = picks[pair.id] === side;
                  const other = picks[pair.id] && picks[pair.id] !== side;
                  return (
                    <button
                      key={side}
                      onClick={() => pick(pair.id, side)}
                      className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${chosen ? 'border-orange-500 bg-orange-500/12 scale-[1.02]' : other ? 'border-white/5 opacity-40' : 'border-[var(--border-medium)] hover:border-orange-400/50 hover:bg-orange-500/5 hover:scale-[1.02]'}`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <p className="font-bold">{opt.label}</p>
                        {chosen && <p className="text-[0.65rem] text-orange-400 font-semibold">Selected ✓</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* DNA profile */}
          <GlassCard className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">Your Flavor DNA</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dnaLabels.map(d => (
                    <span key={d.label} className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
                      {d.emoji} {d.label}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={reset} className="shrink-0 rounded-xl border border-[var(--border-medium)] px-3 py-1.5 text-xs text-muted transition hover:border-orange-500 hover:text-orange-400">
                Reset
              </button>
            </div>
          </GlassCard>

          {/* Results */}
          <div className="grid gap-3 sm:grid-cols-2">
            {results?.map(({ item, score }, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <GlassCard className={`h-full ${i === 0 ? 'ring-1 ring-violet-500/30' : ''}`}>
                  {i === 0 && <div className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-violet-400">🧬 DNA Match</div>}
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {getTag(item) && <span className="mb-1 inline-block rounded bg-violet-500/15 px-1.5 py-0.5 text-[0.58rem] font-bold uppercase text-violet-400">{getTag(item)}</span>}
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-orange-400 font-semibold">{formatRs(item.price)}</p>
                    </div>
                  </div>
                  <ScoreBar score={score} color="violet" />
                  <div className="mt-3 flex justify-end">
                    <AddBtn name={item.name} price={item.price} category={getCategory(item)} image={item.image} isCombo={!('category' in item)} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end">
            <Btn onClick={() => goTo('checkout')}><ShoppingCart className="h-4 w-4" /> Go to Checkout</Btn>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 3 — Budget Builder
// ═══════════════════════════════════════════════════════════════════════════════
function BudgetPanel({ goTo }: { goTo: (p: 'checkout') => void }) {
  const { add } = useCart();
  const [budget, setBudget] = useState(650);
  const options = buildBudgetOptions(budget);
  const [addedOption, setAddedOption] = useState<number | null>(null);

  const addAllItems = (opt: MealOption, idx: number) => {
    opt.items.forEach(i => {
      const found = [...ZZ.menu.items, ...ZZ.menu.combos].find(m => m.name === i.name);
      if (found) {
        const cat = 'category' in found ? found.category : 'combo';
        add({ name: found.name, price: found.price, category: cat, image: found.image, isCombo: !('category' in found) });
      }
    });
    setAddedOption(idx);
    setTimeout(() => setAddedOption(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Budget slider */}
      <GlassCard>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-bold">Your Budget</p>
          <motion.p key={budget} initial={{ scale: 1.2, color: '#f97316' }} animate={{ scale: 1, color: 'var(--text-primary)' }} className="text-2xl font-extrabold tabular-nums">
            {formatRs(budget)}
          </motion.p>
        </div>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          className="mt-3 w-full accent-orange-500"
        />
        <div className="mt-1 flex justify-between text-[0.6rem] text-muted">
          <span>Rs. 100</span>
          <span className="text-orange-400 font-semibold">
            {budget < 300 ? '🥤 Snack mode' : budget < 600 ? '🍟 Single meal' : budget < 1000 ? '🍔 Full meal' : '🎉 Feast mode'}
          </span>
          <span>Rs. 2000</span>
        </div>
      </GlassCard>

      {/* Options */}
      <AnimatePresence mode="wait">
        <motion.div key={budget} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
          {options.length === 0 ? (
            <GlassCard className="text-center py-10 text-muted text-sm">
              Increase your budget. Minimum combo starts at Rs. 350
            </GlassCard>
          ) : (
            options.map((opt, idx) => (
              <GlassCard key={opt.label} className={idx === 0 ? 'ring-1 ring-teal-500/30' : ''}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold">{opt.label}</span>
                      {idx === 0 && <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[0.58rem] font-bold text-teal-400 uppercase">Best Pick</span>}
                      {opt.saving && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.58rem] font-bold text-emerald-400">saves ~{formatRs(opt.saving)}</span>}
                    </div>

                    <div className="mt-2 space-y-1">
                      {opt.items.map(i => (
                        <div key={i.name} className="flex justify-between text-xs">
                          <span className="text-muted">{i.name}</span>
                          <span className="font-semibold">{formatRs(i.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-sm">
                      <span className="text-muted">Total</span>
                      <span className="font-black text-orange-400">{formatRs(opt.total)}</span>
                    </div>

                    <ScoreBar score={opt.valueScore} color="teal" />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => addAllItems(opt, idx)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${addedOption === idx ? 'bg-emerald-500/20 text-emerald-400' : 'btn-primary text-white'}`}
                  >
                    {addedOption === idx ? <><Check className="h-3.5 w-3.5" /> Added!</> : <><ShoppingCart className="h-3.5 w-3.5" /> Add All</>}
                  </button>
                </div>
              </GlassCard>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {options.length > 0 && (
        <div className="flex justify-end">
          <Btn onClick={() => goTo('checkout')}><ShoppingCart className="h-4 w-4" /> Go to Checkout</Btn>
        </div>
      )}
    </div>
  );
}
