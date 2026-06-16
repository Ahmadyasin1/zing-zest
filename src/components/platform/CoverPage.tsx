'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Sparkles, MapPin, Star } from 'lucide-react';
import { ZZ, LEAD_DEVELOPER, FOOD_IMAGES, type PageId } from '@/lib/data/zz';
import { Btn, FadeUpItem } from '@/components/ui/primitives';
import { ZingZestLogo } from '@/components/ui/ZingZestLogo';
import { FloatingFood } from '@/components/platform/FloatingFood';
import { MenuSection } from '@/components/platform/MenuSection';
import { TeamSection } from '@/components/platform/TeamSection';

export function CoverPage({ goTo }: { goTo: (id: PageId) => void }) {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="cover-page space-y-16 pb-8">
      {/* ── Food Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="food-hero relative min-h-[420px] p-6 md:p-10 lg:p-12"
      >
        <FloatingFood />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-xl">
            <ZingZestLogo variant="hero" priority className="mb-5 max-w-[220px]" />
            <p className="food-eyebrow">Street Bites · Lahore</p>
            <h1 className="food-section-title mt-2">
              Crave-Worthy Burgers
              <br />
              <span className="text-gradient-warm">&amp; Zesty Shawarma</span>
            </h1>
            <p className="text-accent mt-3 text-lg font-semibold">{ZZ.brand.tagline}</p>
            <p className="food-section-sub mt-2">{ZZ.brand.promise}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Btn onClick={scrollToMenu}>
                View Full Menu <ArrowRight className="h-4 w-4" />
              </Btn>
              <Btn variant="secondary" onClick={() => goTo('live')}>
                <MapPin className="h-4 w-4" /> Track Truck Live
              </Btn>
              <Btn variant="secondary" onClick={() => goTo('recommend')}>
                <Sparkles className="h-4 w-4" /> AI Picks for You
              </Btn>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[var(--brand-gold)] text-[var(--brand-gold)]" /> 4.6★ target rating
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[var(--brand-teal)]" /> UCP Main Gate · 12-3 PM
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="mx-auto flex max-w-sm items-center justify-center">
              <Image
                src={FOOD_IMAGES.combo}
                alt="Zing & Zest combo meal"
                width={420}
                height={320}
                className="food-img-drop max-h-[280px] w-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-center shadow-lg ring-1 ring-orange-100">
              <p className="text-muted text-[0.65rem] uppercase tracking-wider">Student Combo</p>
              <p className="font-display text-lg font-bold text-[var(--brand-orange)]">Rs. 380</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Full Menu ── */}
      <MenuSection />

      {/* ── Featured bites row ── */}
      <FadeUpItem>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { img: FOOD_IMAGES.burger, title: 'Smoky Grill Burger', price: 'Rs. 380', tag: 'Bestseller' },
            { img: FOOD_IMAGES.shawarma, title: 'Zesty Shawarma', price: 'Rs. 250', tag: 'Fan Favorite' },
            { img: FOOD_IMAGES.fries, title: 'Loaded Zing Fries', price: 'Rs. 200', tag: 'Crunchy' },
            { img: FOOD_IMAGES.drink, title: 'Ice-Cold Drink', price: 'From Rs. 80', tag: 'Refreshing' },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={scrollToMenu}
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
            </button>
          ))}
        </div>
      </FadeUpItem>

      {/* ── Marketing platform (fold) ── */}
      <section className="platform-fold">
        <FadeUpItem>
          <p className="food-eyebrow">Marketing Intelligence</p>
          <h2 className="food-section-title text-2xl">Assignment 4 Platform</h2>
          <p className="food-section-sub">
            Built by {LEAD_DEVELOPER} - AI-powered research, forecasts &amp; strategy behind the Zing &amp; Zest brand.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Btn variant="ghost-elite" onClick={() => goTo('report')}>
              Executive Report
            </Btn>
            <Btn variant="ghost-elite" onClick={() => goTo('part2')}>
              Forecasts
            </Btn>
            <Btn onClick={() => goTo('ai')}>
              <Sparkles className="h-4 w-4" /> AI Lab
            </Btn>
          </div>
        </FadeUpItem>
      </section>

      <TeamSection compact />
    </div>
  );
}
