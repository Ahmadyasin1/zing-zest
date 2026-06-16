'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Flame } from 'lucide-react';
import { ZZ } from '@/lib/data/zz';
import { FadeUpItem } from '@/components/ui/primitives';
import { formatRs } from '@/lib/utils';
import { cn } from '@/lib/utils';

type MenuCategory = (typeof ZZ.menu.categories)[number]['id'];

export function MenuSection() {
  const [active, setActive] = useState<MenuCategory | 'combos'>('burgers');

  const filtered =
    active === 'combos'
      ? null
      : ZZ.menu.items.filter((item) => item.category === active);

  return (
    <section id="menu" className="menu-section">
      <FadeUpItem>
        <p className="food-eyebrow">Our Menu</p>
        <h2 className="food-section-title">Fresh Street Bites - Made to Order</h2>
        <p className="food-section-sub">
          Burgers, shawarma, crispy fries &amp; cold drinks. Hygienic prep, bold flavor, student-friendly prices.
        </p>
      </FadeUpItem>

      <div className="menu-tabs mt-8 flex flex-wrap gap-2">
        {ZZ.menu.categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={cn('menu-tab', active === cat.id && 'menu-tab-active')}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActive('combos')}
          className={cn('menu-tab', active === 'combos' && 'menu-tab-active')}
        >
          <span>🎁</span> Combos
        </button>
      </div>

      {active === 'combos' ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {ZZ.menu.combos.map((combo, i) => (
            <motion.article
              key={combo.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="combo-card"
            >
              <div className="combo-card-img">
                <Image src={combo.image} alt={combo.name} width={280} height={200} className="object-contain" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {'tag' in combo && combo.tag && (
                      <span className="food-tag mb-2 inline-block">{combo.tag}</span>
                    )}
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{combo.name}</h3>
                    <p className="text-muted mt-1 text-sm">{combo.desc}</p>
                  </div>
                  <p className="food-price shrink-0">{formatRs(combo.price)}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="menu-item-card"
            >
              <div className="menu-item-img">
                <Image src={item.image} alt={item.name} width={220} height={180} className="object-contain" />
              </div>
              <div className="p-4">
                {'tag' in item && item.tag && <span className="food-tag mb-2 inline-block">{item.tag}</span>}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold leading-snug">{item.name}</h3>
                  <p className="food-price shrink-0 text-sm">{formatRs(item.price)}</p>
                </div>
                <p className="text-muted mt-1.5 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <FadeUpItem className="mt-10">
        <div className="location-strip">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand-orange)]" />
            <span className="font-semibold text-sm">Find us in Lahore</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ZZ.imc.locations.map((loc) => (
              <div key={loc.name} className="location-pill">
                <p className="font-semibold text-sm">{loc.name}</p>
                <p className="text-muted mt-1 flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" /> {loc.hours}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted mt-4 flex items-center gap-1.5 text-xs">
            <Flame className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
            Avg. order {formatRs(ZZ.menu.avgOrder)} · Hygiene-first · {ZZ.brand.tagline}
          </p>
        </div>
      </FadeUpItem>
    </section>
  );
}
