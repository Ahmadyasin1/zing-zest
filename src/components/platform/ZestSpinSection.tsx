'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Copy, Check, ShoppingBag, Trophy, Users, Zap } from 'lucide-react';
import { useNav } from '@/components/providers/NavProvider';
import { SectionHead, GlassCard, Btn, Tag } from '@/components/ui/primitives';

const PRIZES = [
  { id: 'off10', label: '10% OFF', sub: 'Any order', emoji: '🎉', color: '#f97316', weight: 22, code: 'ZEST10' },
  { id: 'fries', label: 'Free Fries', sub: 'Rs. 150 value', emoji: '🍟', color: '#ea580c', weight: 20, code: 'ZESTFRIES' },
  { id: 'drink', label: 'Free Drink', sub: 'Any size', emoji: '🥤', color: '#0d9488', weight: 18, code: 'ZESTDRINK' },
  { id: 'off15', label: '15% OFF', sub: 'Combos only', emoji: '🔥', color: '#f59e0b', weight: 14, code: 'ZEST15' },
  { id: 'points', label: '+50 Points', sub: 'Loyalty boost', emoji: '⭐', color: '#a78bfa', weight: 14, code: 'ZEST50' },
  { id: 'bogo', label: 'BOGO Burger', sub: 'Today only', emoji: '🍔', color: '#fb7185', weight: 6, code: 'ZESTBOGO' },
  { id: 'mystery', label: 'Mystery Box', sub: 'Surprise item', emoji: '🎁', color: '#38bdf8', weight: 4, code: 'ZESTMYST' },
  { id: 'retry', label: 'Try Again', sub: 'Come back tomorrow', emoji: '🔄', color: '#57534e', weight: 2, code: '' },
] as const;

const LIVE_WINS = [
  'Usama won Free Fries',
  'Fatima got 15% OFF',
  'Bilal unlocked BOGO Burger',
  'Ayesha scored +50 Points',
  'Hamza won Free Drink',
  'Zain got Mystery Box',
  'Mariam won 10% OFF',
  'Omar scored Free Fries',
];

const SEGMENTS = PRIZES.length;
const SEG_ANGLE = 360 / SEGMENTS;
const STORAGE_KEY = 'zing-zest-spin-v1';

type SpinRecord = { date: string; prizeId: string; code: string };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function pickPrizeIndex() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

function loadSpin(): SpinRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SpinRecord;
    return data.date === todayKey() ? data : null;
  } catch {
    return null;
  }
}

function saveSpin(prizeId: string, code: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), prizeId, code }));
}

function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: ['#f97316', '#0d9488', '#f59e0b', '#fb7185', '#a78bfa', '#38bdf8'][i % 6],
        rot: Math.random() * 360,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: '40%', x: `${p.x}%`, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, y: '120%', rotate: p.rot + 720, scale: 0.4 }}
          transition={{ duration: 2.2, delay: p.delay, ease: 'easeOut' }}
          className="absolute h-2 w-2 rounded-sm"
          style={{ background: p.color }}
        />
      ))}
    </div>
  );
}

export function ZestSpinSection() {
  const { goTo } = useNav();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<(typeof PRIZES)[number] | null>(null);
  const [saved, setSaved] = useState<SpinRecord | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveIdx, setLiveIdx] = useState(0);
  const [spinCount, setSpinCount] = useState(847);

  useEffect(() => {
    const record = loadSpin();
    if (record) {
      setSaved(record);
      const prize = PRIZES.find((p) => p.id === record.prizeId);
      if (prize) setWon(prize);
    }
  }, []);

  useEffect(() => {
    const a = setInterval(() => setLiveIdx((i) => (i + 1) % LIVE_WINS.length), 2800);
    const b = setInterval(() => setSpinCount((c) => c + Math.floor(Math.random() * 3)), 4000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const spin = useCallback(() => {
    if (spinning || saved) return;
    const index = pickPrizeIndex();
    const prize = PRIZES[index];
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const centerOffset = index * SEG_ANGLE + SEG_ANGLE / 2;
    const target = extraSpins * 360 + (360 - centerOffset);

    setSpinning(true);
    setWon(null);
    setConfetti(false);
    setRotation((r) => r + target);

    setTimeout(() => {
      setSpinning(false);
      setWon(prize);
      if (prize.id !== 'retry') {
        setConfetti(true);
        const code = prize.code ? `${prize.code}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` : '';
        saveSpin(prize.id, code);
        setSaved({ date: todayKey(), prizeId: prize.id, code });
        setTimeout(() => setConfetti(false), 2500);
      }
    }, 4200);
  }, [spinning, saved]);

  const promoCode = saved?.code || (won?.code ? `${won.code}-DEMO` : '');

  const copyCode = async () => {
    if (!promoCode) return;
    await navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradient = PRIZES.map((p, i) => `${p.color} ${i * SEG_ANGLE}deg ${(i + 1) * SEG_ANGLE}deg`).join(', ');

  return (
    <div className="page-section relative space-y-8 overflow-hidden">
      <Confetti active={confetti} />

      <SectionHead
        eyebrow="Daily Rewards"
        title="ZestSpin — Spin & Win"
        subtitle="Everyone loves a free meal. Spin once daily for instant discounts, free sides, loyalty points, and surprise treats from Zing & Zest."
      />

      {/* Live buzz strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-500/25 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-teal-500/10 px-5 py-3"
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
            <Users className="h-4 w-4 text-emerald-500" />
          </span>
          <span>
            <strong className="text-[var(--text-primary)]">{spinCount.toLocaleString()}</strong>
            <span className="text-muted"> spins today</span>
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={liveIdx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex items-center gap-2 text-sm font-semibold text-orange-500"
          >
            <Trophy className="h-4 w-4" />
            {LIVE_WINS[liveIdx]}
          </motion.p>
        </AnimatePresence>
        <Tag variant="teal">1 free spin / day</Tag>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        {/* Wheel */}
        <GlassCard premium className="relative flex flex-col items-center py-8">
          <div className="relative mb-6 aspect-square w-full max-w-[340px]">
            {/* Pointer */}
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
              <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-orange-500 drop-shadow-lg" />
            </div>

            {/* Outer ring glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-500/30 to-teal-500/20 blur-xl" />

            <motion.div
              className="absolute inset-4 rounded-full border-[6px] border-white/90 shadow-2xl"
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.15, 0.85, 0.2, 1] }}
              style={{ background: `conic-gradient(${gradient})` }}
            >
              {PRIZES.map((p, i) => (
                <div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{
                    width: '42%',
                    transform: `rotate(${i * SEG_ANGLE + SEG_ANGLE / 2}deg)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center pl-2 text-center"
                    style={{ transform: `rotate(${-(i * SEG_ANGLE + SEG_ANGLE / 2)}deg)` }}
                  >
                    <span className="text-lg leading-none">{p.emoji}</span>
                    <span className="mt-0.5 max-w-[52px] text-[0.55rem] font-bold leading-tight text-white drop-shadow-md">
                      {p.label}
                    </span>
                  </div>
                </div>
              ))}

              <div className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/80 bg-gradient-to-br from-orange-500 to-teal-600 shadow-inner">
                <Gift className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          </div>

          <Btn
            onClick={spin}
            disabled={spinning || !!saved}
            className="min-w-[200px] text-base"
          >
            {spinning ? (
              <>Spinning…</>
            ) : saved ? (
              <>Come back tomorrow</>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Spin Now — It&apos;s Free
              </>
            )}
          </Btn>

          {saved && (
            <p className="text-muted mt-3 text-center text-xs">
              You already spun today. Next spin unlocks at midnight.
            </p>
          )}
        </GlassCard>

        {/* Result panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {won ? (
              <motion.div
                key={won.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <GlassCard
                  className={`border-t-4 ${won.id === 'retry' ? 'border-t-stone-400' : 'border-t-orange-500'}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-4xl">
                      {won.emoji}
                    </span>
                    <div>
                      <p className="text-muted text-xs font-bold uppercase tracking-widest">
                        {won.id === 'retry' ? 'Almost!' : 'You won'}
                      </p>
                      <h3 className="font-display text-2xl font-black">{won.label}</h3>
                      <p className="text-muted text-sm">{won.sub}</p>
                    </div>
                  </div>

                  {promoCode && won.id !== 'retry' && (
                    <div className="mt-5 rounded-xl border border-dashed border-orange-500/40 bg-orange-500/5 p-4">
                      <p className="text-muted mb-2 text-xs font-semibold uppercase tracking-wide">Your promo code</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-black/20 px-3 py-2 font-mono text-lg font-bold text-orange-400">
                          {promoCode}
                        </code>
                        <button
                          type="button"
                          onClick={copyCode}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500 transition hover:bg-orange-500/25"
                          aria-label="Copy code"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-muted mt-2 text-xs">Show this at checkout or apply in the cart.</p>
                    </div>
                  )}

                  {won.id !== 'retry' && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Btn onClick={() => goTo('checkout')}>
                        <ShoppingBag className="h-4 w-4" /> Order Now
                      </Btn>
                      <Btn variant="secondary" onClick={() => goTo('live')}>
                        Find the Truck
                      </Btn>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard>
                  <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
                    <Zap className="h-5 w-5 text-amber-400" /> Why students love ZestSpin
                  </h3>
                  <ul className="space-y-3 text-sm text-secondary">
                    <li className="flex gap-2">
                      <span className="text-orange-500">✦</span>
                      <span>
                        <strong>Instant gratification</strong> — real prizes in seconds, no signup friction.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-500">✦</span>
                      <span>
                        <strong>Shareable wins</strong> — copy your code and flex it on Instagram Stories.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500">✦</span>
                      <span>
                        <strong>Daily habit loop</strong> — come back every day for another free spin.
                      </span>
                    </li>
                  </ul>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <GlassCard>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Prize pool</h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIZES.filter((p) => p.id !== 'retry').map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/5 bg-white/5 px-2 py-2 text-center transition hover:border-orange-500/30"
                >
                  <span className="text-xl">{p.emoji}</span>
                  <p className="mt-1 text-[0.65rem] font-bold leading-tight">{p.label}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
