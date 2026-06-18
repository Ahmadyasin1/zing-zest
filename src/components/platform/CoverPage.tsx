'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Star, Flame, Gift } from 'lucide-react';
import { ZZ, LEAD_DEVELOPER, FOOD_IMAGES, type PageId } from '@/lib/data/zz';
import { Btn, FadeUpItem } from '@/components/ui/primitives';
import { MenuSection } from '@/components/platform/MenuSection';
import { TeamSection } from '@/components/platform/TeamSection';
import { formatRs } from '@/lib/utils';

const SLIDES = [
  { src: FOOD_IMAGES.combo,    label: 'Student Combo',       price: 'Rs. 380',     badge: 'Best Value',   glow: 'rgba(249,115,22,0.22)' },
  { src: FOOD_IMAGES.burger,   label: 'Smoky Grill Burger',  price: 'Rs. 380',     badge: 'Bestseller',   glow: 'rgba(234,88,12,0.20)'  },
  { src: FOOD_IMAGES.shawarma, label: 'Zesty Shawarma',      price: 'Rs. 250',     badge: 'Fan Favorite', glow: 'rgba(249,115,22,0.18)' },
  { src: FOOD_IMAGES.fries,    label: 'Masala Crunch Fries', price: 'Rs. 150',     badge: 'Spicy Pick',   glow: 'rgba(249,115,22,0.16)' },
  { src: FOOD_IMAGES.drink,    label: 'Ice Cold Drinks',     price: 'From Rs. 80', badge: 'Refreshing',   glow: 'rgba(13,148,136,0.18)' },
];

function useCountUp(target: number, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0;
      const step = () => { v = Math.min(target, v + Math.ceil(target / 40)); setValue(v); if (v < target) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return value;
}

export function CoverPage({ goTo }: { goTo: (id: PageId) => void }) {
  const [slide, setSlide] = useState(0);
  const orders = useCountUp(47, 600);
  const customers = useCountUp(1200, 900);

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 2800);
    return () => clearInterval(id);
  }, []);

  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="cover-page space-y-16 pb-8">

      {/* ── Hero ── */}
      <section className="food-hero relative min-h-[440px] overflow-hidden rounded-2xl p-7 md:p-10 lg:p-14">

        {/* Slide background glow — changes with active slide */}
        <AnimatePresence>
          <motion.div
            key={`hero-bg-${slide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 70% 80% at 88% 15%, ${SLIDES[slide].glow} 0%, transparent 60%)` }}
          />
        </AnimatePresence>

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* ── Left ── */}
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Serving now in Lahore</span>
            </motion.div>

            <p className="food-eyebrow">Street Bites · Lahore</p>

            <h1 className="food-section-title mt-2">
              Craveworthy Burgers
              <br />
              <span className="text-gradient-warm">&amp; Zesty Shawarma</span>
            </h1>

            <p className="text-accent mt-3 text-lg font-semibold">{ZZ.brand.tagline}</p>
            <p className="food-section-sub mt-2">{ZZ.brand.promise}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Btn onClick={scrollToMenu}>View Full Menu <ArrowRight className="h-4 w-4" /></Btn>
              <Btn variant="secondary" onClick={() => goTo('live')}><MapPin className="h-4 w-4" /> Track Truck Live</Btn>
              <Btn variant="secondary" onClick={() => goTo('vibe')}><Sparkles className="h-4 w-4" /> AI Picks for You</Btn>
            </div>

            <motion.button
              type="button"
              onClick={() => goTo('spin')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="zest-spin-banner mt-5 flex w-full max-w-md items-center gap-4 rounded-2xl border border-orange-500/35 bg-gradient-to-r from-orange-500/15 via-amber-400/10 to-teal-500/10 p-4 text-left shadow-lg shadow-orange-500/10 transition hover:border-orange-500/50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-2xl shadow-md animate-pulse">🎁</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500">
                  <Gift className="h-3.5 w-3.5" /> New — Spin & Win
                </span>
                <span className="font-display mt-0.5 block text-base font-black text-[var(--text-primary)]">
                  Free fries, discounts & mystery prizes daily
                </span>
                <span className="text-muted text-xs">Tap to spin — everyone wins something</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-orange-500" />
            </motion.button>

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="hero-stat-chip"><Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> <strong>4.6</strong> <span className="text-muted text-xs">target rating</span></div>
              <div className="hero-stat-chip"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /><Flame className="h-3.5 w-3.5 text-orange-500" /> <strong>{orders}</strong> <span className="text-muted text-xs">orders today</span></div>
              <div className="hero-stat-chip"><strong>{customers}+</strong> <span className="text-muted text-xs">customers</span></div>
              <div className="hero-stat-chip"><MapPin className="h-3.5 w-3.5 text-teal-600" /> <span className="text-muted text-xs">UCP Main Gate · 12 to 3 PM</span></div>
            </div>
          </div>

          {/* ── Right: Slideshow ── */}
          <div className="relative hidden lg:block">
            {/* Plate glow — also transitions with slide */}
            <AnimatePresence>
              <motion.div
                key={`plate-${slide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 m-auto h-72 w-72 rounded-full"
                style={{ background: `radial-gradient(circle, ${SLIDES[slide].glow.replace('0.', '0.3')} 0%, transparent 70%)`, filter: 'blur(40px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </AnimatePresence>

            {/* Image */}
            <div className="relative flex h-[300px] items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${slide}`}
                  initial={{ opacity: 0, scale: 0.90, y: 12 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{   opacity: 0, scale: 1.06,  y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={SLIDES[slide].src}
                    alt={SLIDES[slide].label}
                    width={360}
                    height={280}
                    className="food-img-hero max-h-[260px] w-auto"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${slide}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="hero-price-badge mx-auto mt-3 w-fit text-center"
              >
                <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">{SLIDES[slide].badge}</p>
                <p className="font-display text-xl font-black text-[var(--brand-orange)]">{SLIDES[slide].price}</p>
                <p className="text-xs font-semibold text-muted">{SLIDES[slide].label}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-orange-300/40 hover:bg-orange-400/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Menu ── */}
      <MenuSection />

      {/* ── Featured bites ── */}
      <FadeUpItem>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { img: FOOD_IMAGES.burger,   title: 'Smoky Grill Burger', price: formatRs(380), tag: 'Bestseller'   },
            { img: FOOD_IMAGES.shawarma, title: 'Zesty Shawarma',     price: formatRs(250), tag: 'Fan Favorite' },
            { img: FOOD_IMAGES.fries,    title: 'Loaded Zing Fries',  price: formatRs(200), tag: 'Crunchy'      },
            { img: FOOD_IMAGES.drink,    title: 'Ice Cold Drink',     price: 'From Rs. 80', tag: 'Refreshing'   },
          ].map((item, i) => (
            <motion.button
              key={item.title}
              type="button"
              onClick={scrollToMenu}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="menu-item-card text-left"
            >
              <div className="menu-item-img">
                <Image src={item.img} alt={item.title} width={160} height={140} className="object-contain" />
              </div>
              <div className="p-4">
                <span className="food-tag">{item.tag}</span>
                <p className="font-display mt-2 font-bold">{item.title}</p>
                <p className="food-price mt-1 text-sm">{item.price}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </FadeUpItem>

      {/* ── Platform fold ── */}
      <section className="platform-fold">
        <FadeUpItem>
          <p className="food-eyebrow">Marketing Intelligence</p>
          <h2 className="food-section-title text-2xl">Assignment 4 Platform</h2>
          <p className="food-section-sub">
            Built by {LEAD_DEVELOPER}. AI powered research, forecasts and strategy behind the Zing and Zest brand.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Btn variant="ghost-elite" onClick={() => goTo('report')}>Executive Report</Btn>
            <Btn variant="ghost-elite" onClick={() => goTo('part2')}>Forecasts</Btn>
            <Btn onClick={() => goTo('ai')}><Sparkles className="h-4 w-4" /> AI Lab</Btn>
          </div>
        </FadeUpItem>
      </section>

      <TeamSection compact />
    </div>
  );
}
