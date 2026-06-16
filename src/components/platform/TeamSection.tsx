'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { LEAD_DEVELOPER, TEAM, TEAM_COMBINED } from '@/lib/data/zz';
import { GlassCard, FadeUpItem, StaggerGrid } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export function TeamSection({ compact = false }: { compact?: boolean }) {
  return (
    <GlassCard premium className={compact ? 'mt-0' : undefined}>
      <FadeUpItem>
        <p className="eyebrow mb-3">Our Team</p>
        <h2 className="font-cyber text-xl font-extrabold tracking-tight md:text-2xl lg:text-3xl">
          <span className="text-holo">UCP Assignment 4 Team</span>
        </h2>
        <p className="text-secondary mt-4 max-w-2xl text-sm leading-relaxed md:text-base">
          This platform was built as a collaborative team project.{' '}
          <span className="text-gradient-gold font-semibold">{LEAD_DEVELOPER}</span> is the main developer
          who designed and developed the AI marketing intelligence platform. All five team members
          contributed to research, strategy, and deliverables.
        </p>
      </FadeUpItem>

      <FadeUpItem className="mt-8">
        <div className="overflow-hidden rounded-2xl border border-[var(--border-medium)] bg-gradient-to-b from-[var(--brand-orange-soft)] to-[var(--bg-elevated)] p-4 md:p-6">
          <Image
            src={TEAM_COMBINED}
            alt="Zing & Zest Assignment 4 team - Ahmad Yasin, Abdul Rehman, Eman Sarfraz, Nouman Zakar, and Ali Hassan"
            width={1472}
            height={360}
            className="mx-auto h-auto w-full max-w-4xl object-contain drop-shadow-lg"
          />
        </div>
      </FadeUpItem>

      <StaggerGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TEAM.map((member) => (
          <motion.div
            key={member.reg}
            className={cn(
              'rounded-2xl border p-4 text-center transition-all duration-300 card-hover',
              member.lead
                ? 'team-lead-card'
                : 'border-[var(--border-medium)] bg-[var(--bg-elevated)]',
            )}
          >
            <div className="relative mx-auto mb-3 h-20 w-20">
              <div className={cn('team-photo-ring relative h-full w-full overflow-hidden rounded-full', member.lead && 'p-[3px]')}>
                <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--bg-card)]">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
              {member.lead && (
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-gradient-btn)] text-white shadow-lg">
                  <Crown className="h-3 w-3" />
                </span>
              )}
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
        <FadeUpItem className="mt-6 rounded-2xl border border-[var(--border-medium)] bg-gradient-to-r from-[var(--brand-orange-soft)] via-transparent to-[var(--brand-teal-soft)] px-5 py-4 text-center">
          <p className="text-secondary text-xs leading-relaxed md:text-sm">
            <span className="font-semibold text-[var(--text-primary)]">Dr. Shahjahan Masud</span>
            {' · '}
            University of Central Punjab · AIUE3013 · Spring 2026
          </p>
        </FadeUpItem>
      )}
    </GlassCard>
  );
}
