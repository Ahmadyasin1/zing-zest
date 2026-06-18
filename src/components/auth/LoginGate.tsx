'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ZingZestLogo } from '@/components/ui/ZingZestLogo';

export function LoginGate() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // tactile delay

    const result =
      mode === 'login'
        ? login(form.email, form.password)
        : signup(form.name, form.email, form.password);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-base)]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="ambient-grid absolute inset-0" />
      </div>

      {/* Center card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block">
              <div className="logo-ring inline-block rounded-2xl p-1.5">
                <ZingZestLogo variant="compact" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-gradient-warm">
              Zing &amp; Zest
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              {mode === 'login' ? 'Welcome back, sign in to continue' : 'Create your account and start earning rewards'}
            </p>
          </div>

          {/* Card */}
          <div className="glass-ultra glass-premium rounded-2xl p-8">
            {/* Tab toggle */}
            <div className="mb-6 flex rounded-xl bg-white/5 p-1">
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
                    mode === m ? 'text-white' : 'text-muted hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-lg btn-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative capitalize">{m === 'login' ? 'Sign in' : 'Create account'}</span>
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <AuthField
                      icon={<User className="h-4 w-4" />}
                      placeholder="Full name"
                      value={form.name}
                      onChange={set('name')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AuthField
                icon={<Mail className="h-4 w-4" />}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={set('email')}
              />

              <AuthField
                icon={<Lock className="h-4 w-4" />}
                placeholder="Password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                onEnter={submit}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="text-muted transition hover:text-[var(--text-secondary)]"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-xs text-[var(--brand-coral)]"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={loading}
              className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Switch mode */}
            <p className="mt-5 text-center text-xs text-muted">
              {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
              <button onClick={switchMode} className="font-semibold text-orange-400 hover:text-orange-300 transition">
                {mode === 'login' ? 'Create one' : 'Sign in instead'}
              </button>
            </p>

            {/* Loyalty hint on signup */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-500/10 px-3 py-2.5"
                >
                  <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" />
                  <p className="text-[0.7rem] text-amber-200/80">
                    You&apos;ll earn <strong className="text-amber-400">50 welcome points</strong>. Every 100 points = 1 free combo!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-4 text-center text-[0.62rem] text-muted opacity-60">
              🔒 Demo credentials stored locally in your browser, never sent anywhere.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-[0.65rem] text-muted">
            {['AI-Powered Platform', 'Lahore · Spring 2026', 'UCP · AIUE3013'].map(t => (
              <span key={t} className="flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-orange-400" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AuthField({
  icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  onEnter,
  suffix,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  onEnter?: () => void;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-medium)] bg-white/5 px-3 py-3 transition-all duration-200 focus-within:border-[var(--brand-orange)] focus-within:bg-[var(--brand-orange-soft)]">
      <span className="shrink-0 text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
      />
      {suffix}
    </label>
  );
}
