'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, LogOut, Star, Gift, ShoppingBag } from 'lucide-react';
import { SectionHead, GlassCard, Btn, Tag } from '@/components/ui/primitives';

interface Account {
  name: string;
  email: string;
  password: string; // demo-only, stored locally
  points: number;
  joined: string;
}

const KEY = 'zz_accounts';
const SESSION = 'zz_session';

function loadAccounts(): Account[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function AccountSection() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    const email = localStorage.getItem(SESSION);
    if (email) {
      const acc = loadAccounts().find((a) => a.email === email);
      if (acc) setUser(acc);
    }
  }, []);

  const persist = (accs: Account[]) => localStorage.setItem(KEY, JSON.stringify(accs));

  const submit = () => {
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!email.includes('@') || form.password.length < 4) {
      setError('Enter a valid email and a password of at least 4 characters.');
      return;
    }
    const accs = loadAccounts();

    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.');
      if (accs.some((a) => a.email === email)) return setError('An account with this email already exists.');
      const acc: Account = { name: form.name.trim(), email, password: form.password, points: 50, joined: new Date().toISOString() };
      persist([...accs, acc]);
      localStorage.setItem(SESSION, email);
      setUser(acc);
    } else {
      const acc = accs.find((a) => a.email === email);
      if (!acc || acc.password !== form.password) return setError('Incorrect email or password.');
      localStorage.setItem(SESSION, email);
      setUser(acc);
    }
    setForm({ name: '', email: '', password: '' });
  };

  const logout = () => {
    localStorage.removeItem(SESSION);
    setUser(null);
  };

  return (
    <div className="space-y-6">
      <SectionHead
        eyebrow="Account"
        title="Login / Sign Up"
        subtitle="Create a Zing & Zest account to track orders, collect loyalty stamps, and get personalised AI recommendations. Demo auth stored locally in your browser."
      />

      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard premium>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 text-2xl font-black text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold">Hi, {user.name} 👋</h3>
                    <p className="text-muted text-xs">{user.email}</p>
                  </div>
                  <Tag variant="teal">Member</Tag>
                </div>

                <div className="my-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-orange-500/10 p-3">
                    <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-400" />
                    <p className="mt-1 text-lg font-black text-orange-400">{user.points}</p>
                    <p className="text-muted text-[0.6rem]">Points</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <Gift className="mx-auto h-4 w-4 text-teal-400" />
                    <p className="mt-1 text-lg font-black">{Math.floor(user.points / 100)}</p>
                    <p className="text-muted text-[0.6rem]">Free meals</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <ShoppingBag className="mx-auto h-4 w-4 text-orange-400" />
                    <p className="mt-1 text-lg font-black">{Math.floor(user.points / 50)}</p>
                    <p className="text-muted text-[0.6rem]">Orders</p>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-xs text-emerald-300">
                  🎉 Loyalty: every 100 points = 1 free combo. You’re {100 - (user.points % 100)} points away from your next reward!
                </div>

                <Btn variant="secondary" className="mt-4 w-full" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Log out
                </Btn>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard premium>
                <div className="mb-5 flex rounded-xl bg-white/5 p-1">
                  {(['login', 'signup'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(''); }}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
                        mode === m ? 'bg-gradient-to-r from-orange-500 to-teal-500 text-white' : 'text-muted'
                      }`}
                    >
                      {m === 'login' ? 'Log in' : 'Sign up'}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {mode === 'signup' && (
                    <Field icon={<User className="h-4 w-4" />} placeholder="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  )}
                  <Field icon={<Mail className="h-4 w-4" />} placeholder="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field icon={<Lock className="h-4 w-4" />} placeholder="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} onEnter={submit} />
                </div>

                {error && <p className="mt-3 text-xs text-[var(--brand-coral)]">{error}</p>}

                <Btn className="mt-5 w-full" onClick={submit}>
                  {mode === 'login' ? 'Log in' : 'Create account'}
                </Btn>

                <p className="text-muted mt-4 text-center text-[0.7rem]">
                  {mode === 'login' ? "New here? " : 'Already a member? '}
                  <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-semibold text-orange-400">
                    {mode === 'login' ? 'Create an account' : 'Log in instead'}
                  </button>
                </p>
                <p className="text-muted mt-3 text-center text-[0.6rem] opacity-70">
                  🔒 Demo only - credentials are stored locally in your browser, never sent anywhere.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  icon, placeholder, value, onChange, type = 'text', onEnter,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onEnter?: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-medium)] bg-white/5 px-3 py-2.5 focus-within:border-orange-500">
      <span className="text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
      />
    </label>
  );
}
