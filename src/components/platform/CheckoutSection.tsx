'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Plus, Minus, Trash2, MapPin, Phone, User,
  Star, CheckCircle2, ChevronRight, Tag as TagIcon, ShoppingCart,
} from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useNav } from '@/components/providers/NavProvider';
import { SectionHead, GlassCard, Btn, Tag } from '@/components/ui/primitives';
import { formatRs } from '@/lib/utils';
import { ZZ } from '@/lib/data/zz';

const PICKUP_STOPS = [
  { label: 'UCP Main Gate', time: '12:00 – 3:00 PM' },
  { label: 'Gulberg III', time: '3:40 – 5:00 PM' },
  { label: 'Liberty Market', time: '5:40 – 7:30 PM' },
  { label: 'MM Alam Road', time: '8:00 – 9:15 PM' },
  { label: 'DHA Phase 5', time: '9:45 – 11:00 PM' },
];

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash on pickup', icon: '💵', desc: 'Pay when you collect your order' },
  { id: 'card', label: 'Card / Mobile', icon: '💳', desc: 'Easypaisa, JazzCash, bank card' },
];

export function CheckoutSection() {
  const { items, adjust, remove, clear, totalItems, totalPrice } = useCart();
  const { user, updatePoints } = useAuth();
  const { goTo } = useNav();

  const [form, setForm] = useState({ name: user?.name ?? '', phone: '' });
  const [pickup, setPickup] = useState(PICKUP_STOPS[0].label);
  const [payment, setPayment] = useState('cash');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId] = useState(() => `ZZ-${Date.now().toString(36).toUpperCase()}`);

  const freeComboDiscount = redeemPoints && (user?.points ?? 0) >= 100 ? 380 : 0;
  const serviceFee = 0;
  const grandTotal = Math.max(0, totalPrice - freeComboDiscount + serviceFee);
  const pointsEarned = Math.floor(grandTotal / 10);

  const canPlace = form.name.trim() && form.phone.trim().length >= 10 && items.length > 0;

  const placeOrder = async () => {
    if (!canPlace) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    if (redeemPoints && user) updatePoints(-100);
    if (user) updatePoints(pointsEarned);
    setConfirmed(true);
    setPlacing(false);
  };

  // ── Empty cart ──
  if (!confirmed && items.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHead eyebrow="Checkout" title="Your Order" subtitle="Add items from the menu to get started." />
        <GlassCard className="py-16 text-center">
          <ShoppingCart className="mx-auto h-14 w-14 text-muted opacity-30" />
          <p className="mt-4 text-lg font-bold text-muted">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted opacity-70">Browse the menu and add something delicious</p>
          <Btn className="mt-6" onClick={() => goTo('cover')}>
            View Menu <ChevronRight className="h-4 w-4" />
          </Btn>
        </GlassCard>
      </div>
    );
  }

  // ── Order confirmed ──
  if (confirmed) {
    return (
      <div className="space-y-6">
        <SectionHead eyebrow="Order Placed" title="See you soon!" subtitle="Your order has been received. Collect at your chosen location." />
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <GlassCard premium className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-4xl shadow-[0_0_40px_rgba(16,185,129,0.4)]"
            >
              ✅
            </motion.div>

            <h2 className="font-display text-2xl font-extrabold text-gradient-warm">Order Confirmed!</h2>
            <p className="mt-2 text-muted">Order #{orderId}</p>

            <div className="my-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[0.65rem] text-muted uppercase tracking-wide">Pickup at</p>
                <p className="mt-1 text-sm font-bold">{pickup}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[0.65rem] text-muted uppercase tracking-wide">Total paid</p>
                <p className="mt-1 text-sm font-bold text-orange-400">{formatRs(grandTotal)}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-[0.65rem] text-muted uppercase tracking-wide">Points earned</p>
                <p className="mt-1 text-sm font-bold text-amber-400">+{pointsEarned} pts</p>
              </div>
            </div>

            <div className="mx-auto mb-5 max-w-sm space-y-1.5 text-left">
              {items.map(i => (
                <div key={i.name} className="flex justify-between text-sm">
                  <span className="text-muted">{i.name} × {i.qty}</span>
                  <span className="font-semibold">{formatRs(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Btn onClick={() => { clear(); goTo('cover'); }}>Back to Menu</Btn>
              <Btn variant="secondary" onClick={() => goTo('live')}>Track Truck Live</Btn>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // ── Main checkout ──
  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Checkout"
        title="Review & Place Order"
        subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart. Confirm details and collect at your chosen stop.`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left: Cart items ── */}
        <div className="space-y-4">
          <GlassCard className="p-0">
            <div className="flex items-center justify-between border-b border-[var(--border-medium)] px-5 py-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <ShoppingBag className="h-4 w-4 text-orange-400" /> Your Order
              </h3>
              <button onClick={() => goTo('cover')} className="text-xs text-orange-400 hover:text-orange-300 transition">
                + Add more
              </button>
            </div>

            <div className="divide-y divide-[var(--border-medium)]">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.name}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-teal-500/10">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-orange-400 font-bold">{formatRs(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => adjust(item.name, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-sm transition hover:bg-white/15 active:scale-90">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => adjust(item.name, +1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-sm transition hover:bg-white/15 active:scale-90">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="w-16 text-right text-sm font-bold">{formatRs(item.price * item.qty)}</p>
                    <button onClick={() => remove(item.name)} className="rounded-lg p-1.5 text-rose-400/60 transition hover:bg-rose-500/10 hover:text-rose-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart totals */}
            <div className="space-y-2 border-t border-[var(--border-medium)] px-5 py-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span><span>{formatRs(totalPrice)}</span>
              </div>
              {freeComboDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>🎉 Points redemption</span><span>−{formatRs(freeComboDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Service fee</span><span className="text-emerald-400">Free pickup</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-medium)] pt-2 text-base font-black">
                <span>Total</span>
                <span className="text-orange-400">{formatRs(grandTotal)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Loyalty redemption */}
          {user && user.points >= 100 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={() => setRedeemPoints(v => !v)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                  redeemPoints ? 'border-amber-500 bg-amber-500/10' : 'border-[var(--border-medium)] hover:border-[var(--border-accent)]'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition ${redeemPoints ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                  ⭐
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Redeem Loyalty Points</p>
                  <p className="text-xs text-muted">Use 100 pts for Rs. 380 off (Student Combo free)</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${redeemPoints ? 'text-amber-400' : 'text-muted'}`}>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {user.points} pts
                </div>
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Right: Details ── */}
        <div className="space-y-4">
          {/* Contact */}
          <GlassCard>
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <User className="h-4 w-4 text-orange-400" /> Your Details
            </h3>
            <div className="space-y-3">
              <CheckoutField
                icon={<User className="h-4 w-4" />}
                placeholder="Your name"
                value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))}
              />
              <CheckoutField
                icon={<Phone className="h-4 w-4" />}
                placeholder="Phone number (03XX-XXXXXXX)"
                value={form.phone}
                onChange={v => setForm(f => ({ ...f, phone: v }))}
                type="tel"
              />
            </div>
          </GlassCard>

          {/* Pickup location */}
          <GlassCard>
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4 text-orange-400" /> Pickup Location
            </h3>
            <div className="space-y-2">
              {PICKUP_STOPS.map(stop => (
                <button
                  key={stop.label}
                  onClick={() => setPickup(stop.label)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                    pickup === stop.label
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-[var(--border-medium)] hover:border-[var(--border-accent)] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full transition ${pickup === stop.label ? 'bg-orange-500' : 'bg-white/20'}`} />
                    <span className="text-sm font-semibold">{stop.label}</span>
                  </div>
                  <span className="text-xs text-muted">{stop.time}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Payment */}
          <GlassCard>
            <h3 className="mb-4 font-semibold">Payment Method</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                    payment === m.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-[var(--border-medium)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-[0.65rem] text-muted">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Special notes */}
          <GlassCard>
            <h3 className="mb-3 font-semibold">Special Instructions</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="No onions, extra sauce, allergies… anything for the chef 🙏"
              rows={2}
              className="w-full resize-none rounded-xl border border-[var(--border-medium)] bg-white/5 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 placeholder:text-muted"
            />
          </GlassCard>

          {/* Points earned preview */}
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/8 px-4 py-2.5 text-xs text-amber-300">
            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            You&apos;ll earn <strong className="mx-1 text-amber-400">+{pointsEarned} loyalty points</strong> on this order!
          </div>

          {/* Place order */}
          <button
            onClick={placeOrder}
            disabled={!canPlace || placing}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white disabled:opacity-40 transition-all"
          >
            {placing ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </span>
                Placing your order…
              </span>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Place Order · {formatRs(grandTotal)}
              </>
            )}
          </button>

          {!canPlace && items.length > 0 && (
            <p className="text-center text-xs text-muted">Fill in your name and phone number to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckoutField({ icon, placeholder, value, onChange, type = 'text' }: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-medium)] bg-white/5 px-3 py-3 transition-all focus-within:border-orange-500">
      <span className="shrink-0 text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </label>
  );
}
