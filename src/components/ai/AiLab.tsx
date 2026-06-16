'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Palette, Search, Megaphone, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageGenerator } from './ImageGenerator';
import { VisionAnalyzer } from './VisionAnalyzer';
import { SemanticSearch } from './SemanticSearch';
import { InsightCards } from './InsightCards';
import { CampaignCopyGenerator } from './CampaignCopyGenerator';
import { PitchGenerator } from './PitchGenerator';
import { SentimentAnalyzer } from './SentimentAnalyzer';
import { PersonaMatcher } from './PersonaMatcher';
import { AiStatusBar } from './AiStatusBar';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'create', label: 'Create', icon: Palette },
  { id: 'analyze', label: 'Analyze', icon: Brain },
  { id: 'engage', label: 'Engage', icon: Megaphone },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function AiLab() {
  const [tab, setTab] = useState<TabId>('overview');

  return (
    <div className="space-y-6">
      <AiStatusBar />

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-[var(--border-medium)] bg-[var(--bg-card)] p-1 holo-panel">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'font-tech flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap',
              tab === t.id ? 'ai-lab-tab-active text-white' : 'text-muted hover:text-[var(--text-primary)]',
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Sparkles, title: 'ZestAI Copilot', desc: 'Floating chat - ask anything', color: 'orange' },
                { icon: Search, title: 'Semantic RAG', desc: 'Search all report content', color: 'teal' },
                { icon: Brain, title: 'Insight Engine', desc: 'Auto-summaries & KPI explainers', color: 'violet' },
                { icon: Target, title: 'Persona Matcher', desc: 'Interactive customer quiz', color: 'amber' },
              ].map((f) => (
                <div key={f.title} className="glass holo-panel card-hover rounded-xl p-4">
                  <f.icon className="mb-2 h-6 w-6 text-neon-cyan" style={{ color: f.color === 'orange' ? '#ff7033' : f.color === 'teal' ? '#00f0ff' : f.color === 'violet' ? '#a855f7' : '#ffe566' }} />
                  <h4 className="font-cyber font-bold">{f.title}</h4>
                  <p className="text-xs text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
            <InsightCards />
            <SemanticSearch />
          </div>
        )}

        {tab === 'create' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <ImageGenerator />
            <CampaignCopyGenerator />
            <PitchGenerator />
          </div>
        )}

        {tab === 'analyze' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <VisionAnalyzer />
            <SentimentAnalyzer />
            <div className="lg:col-span-2"><InsightCards /></div>
          </div>
        )}

        {tab === 'engage' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <PersonaMatcher />
            <CampaignCopyGenerator />
            <PitchGenerator />
            <SentimentAnalyzer />
          </div>
        )}
      </motion.div>
    </div>
  );
}
