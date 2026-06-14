'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { LEAD_DEVELOPER, TEAM, TEAM_COMBINED } from '@/lib/data/zz';
import { GlassCard, FadeUpItem, StaggerGrid } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export function TeamSection({ compact = false }: { compact?: boolean }) {
  return (
    <GlassCard premium className={compact ? 'mt-0' : undefined}>
      <FadeUpItem>
        <p className="eyebrow mb-2">Our Team</p>
        <h2 className="font-display text-xl font-extrabold md:text-2xl">
          UCP Assignment 4 Team
        </h2>
        <p className="text-secondary mt-3 max-w-2xl text-sm leading-relaxed">
          This platform was built as a collaborative team project.{' '}
          <span className="text-accent font-semibold">{LEAD_DEVELOPER}</span> is the main developer
          who designed and developed the AI marketing intelligence platform. All five team members
          contributed to research, strategy, and deliverables.
        </p>
      </FadeUpItem>

      <FadeUpItem className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-[var(--border-medium)] bg-[var(--bg-elevated)] p-3 md:p-5">
          <Image
            src={TEAM_COMBINED}
            alt="Zing & Zest Assignment 4 team — Ahmad Yasin, Abdul Rehman, Eman Sarfraz, Nouman Zakar, and Ali Hassan"
            width={1472}
            height={360}
            className="mx-auto h-auto w-full max-w-4xl object-contain"
          />
        </div>
      </FadeUpItem>

      <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TEAM.map((member) => (
          <motion.div
            key={member.reg}
            className={cn(
              'rounded-2xl border p-4 text-center transition-colors',
              member.lead
                ? 'border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/8'
                : 'border-[var(--border-medium)] bg-[var(--bg-elevated)]',
            )}
          >
            <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--border-medium)]">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <p className="font-display text-sm font-bold">{member.name}</p>
            <p className="text-muted mt-0.5 text-[0.65rem]">{member.reg}</p>
            <p
              className={cn(
                'mt-2 text-[0.65rem] font-bold uppercase tracking-wide',
                member.lead ? 'text-accent' : 'text-muted',
              )}
            >
              {member.role}
            </p>
          </motion.div>
        ))}
      </StaggerGrid>

      {!compact && (
        <FadeUpItem className="mt-6 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-elevated)] px-4 py-3 text-center">
          <p className="text-secondary text-xs leading-relaxed">
            <span className="font-semibold text-[var(--text-primary)]">Dr. Shahjahan Masud</span>
            {' · '}
            University of Central Punjab · AIUE3013 · Spring 2026
          </p>
        </FadeUpItem>
      )}
    </GlassCard>
  );
}
