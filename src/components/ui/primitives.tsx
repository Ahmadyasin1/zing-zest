'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function FadeUpItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlassCard({
  children,
  className,
  onClick,
  premium,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  premium?: boolean;
}) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      className={cn(
        'rounded-2xl p-5',
        premium ? 'glass-premium card-hover' : 'glass card-hover',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl">{title}</h2>
      <div className="section-rule mt-4 max-w-xs" />
      {subtitle && <p className="text-muted mt-4 max-w-3xl text-sm leading-relaxed md:text-base">{subtitle}</p>}
    </div>
  );
}

export function KpiCard({ value, label, index }: { value: string; label: string; index?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      className="kpi-glow card-hover rounded-2xl p-5 text-center"
    >
      {index !== undefined && (
        <span className="text-muted mb-2 block font-mono text-[0.6rem] tracking-widest">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <p className="stat-value text-gradient">{value}</p>
      <p className="text-muted mt-2 text-[0.7rem] leading-snug">{label}</p>
    </motion.div>
  );
}

export function DeliverableCard({
  icon,
  title,
  desc,
  meta,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      className="deliverable-card glass card-hover w-full rounded-xl p-4"
    >
      <ArrowUpRight className="deliverable-arrow h-4 w-4" />
      <span className="text-2xl">{icon}</span>
      <h3 className="font-display mt-3 text-sm font-bold">{title}</h3>
      <p className="mt-1 text-[0.68rem] leading-relaxed text-muted">{desc}</p>
      <p className="accent-teal mt-3 text-[0.65rem] font-bold">{meta}</p>
    </motion.button>
  );
}

export function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'outline' | 'teal' }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold',
        variant === 'default' && 'tag-brand',
        variant === 'teal' && 'tag-teal',
        variant === 'outline' && 'border border-[var(--border-medium)] text-muted',
      )}
    >
      {children}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'ghost-elite';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50',
        variant === 'primary' && 'btn-primary text-white',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'text-muted hover:bg-[var(--brand-orange-soft)] hover:text-[var(--text-primary)]',
        variant === 'ghost-elite' && 'btn-ghost-elite rounded-xl px-4 py-2.5',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--brand-orange)]"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-[var(--brand-coral)]/30 bg-[var(--brand-coral)]/10 p-4 text-sm text-[var(--brand-coral)]">
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-2 underline opacity-80 hover:opacity-100">
          Retry
        </button>
      )}
    </div>
  );
}
