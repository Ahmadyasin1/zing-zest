'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useNav } from '@/components/providers/NavProvider';
import { ZZ } from '@/lib/data/zz';
import {
  REPORT,
  PERSONAS,
  AI_PROMPTS,
  JOURNEY_STAGES,
  RECOVERY_PHASES,
  RCA_ITEMS,
  CHAT_RESPONSES,
} from '@/lib/data/content';
import { GlassCard, SectionHead, Tag, Btn } from '@/components/ui/primitives';
import { ChartSection } from '@/components/charts';
import { CoverPage } from '@/components/platform/CoverPage';
import { TeamSection } from '@/components/platform/TeamSection';
import { LiveTrackingMap } from '@/components/platform/LiveTrackingMap';
import { ZestSpinSection } from '@/components/platform/ZestSpinSection';
import { AccountSection } from '@/components/platform/AccountSection';
import { InventorySection } from '@/components/platform/InventorySection';
import { Recommendations } from '@/components/platform/Recommendations';
import { CheckoutSection } from '@/components/platform/CheckoutSection';
import { VibeRecommendations } from '@/components/platform/VibeRecommendations';
import { formatRs } from '@/lib/utils';

const AiLab = dynamic(
  () => import('@/components/ai/AiLab').then((m) => m.AiLab),
  { ssr: false, loading: () => <div className="font-tech text-muted py-12 text-center text-sm">Loading AI Lab…</div> },
);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function Platform() {
  const { page, goTo } = useNav();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
        {page === 'cover' && <CoverPage goTo={goTo} />}
        {page === 'live' && <LiveTrackingMap />}
        {page === 'recommend' && <Recommendations />}
        {page === 'vibe' && <VibeRecommendations />}
        {page === 'spin' && <ZestSpinSection />}
        {page === 'checkout' && <CheckoutSection />}
        {page === 'account' && <AccountSection />}
        {page === 'inventory' && <InventorySection />}
        {page === 'report' && <ReportSection />}
        {page === 'part1' && <ResearchSection />}
        {page === 'part2' && <ForecastSection />}
        {page === 'part3' && <CompetitiveSection />}
        {page === 'part4' && <PersonasSection />}
        {page === 'part5' && <JourneySection />}
        {page === 'transparency' && <MethodologySection />}
        {page === 'conclusion' && <ConclusionSection />}
        {page === 'ai' && <AiLabSection />}
      </motion.div>
    </AnimatePresence>
  );
}

function ReportSection() {
  return (
    <div className="page-section space-y-6">
      <SectionHead eyebrow="Report" title="Executive Report" subtitle="Assignment 4 complete written report - AI-driven food truck growth intelligence." />
      <div className="mb-4 flex items-center gap-3">
        <span className="tag-teal rounded-full px-3 py-1 text-xs font-bold">{REPORT.wordCount.toLocaleString()} words</span>
        <Btn variant="secondary" onClick={() => window.print()}>Print Report</Btn>
      </div>
      <div className="space-y-4">
        {REPORT.sections.map((s, i) => (
          <GlassCard key={s.title}>
            <div className="mb-3 flex items-center gap-2">
              <span className="tag-brand rounded px-2 py-0.5 text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-bold">{s.title}</h3>
            </div>
            {s.body.split('\n\n').map((p, j) => (
              <p key={j} className="mb-3 text-sm leading-relaxed text-secondary last:mb-0">{p}</p>
            ))}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ResearchSection() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHead title="Market Research Intelligence" subtitle="Primary evidence from 20 semi-structured interviews across Lahore target clusters." />
        <ChartSection name="research" />
      </div>
      <div>
        <SectionHead title="Brand Architecture & Positioning" subtitle="Affordable-premium white space validated by Assignment 2 competitive mapping." />
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <h3 className="mb-3 font-semibold">Menu & Combos</h3>
            <ul className="space-y-1 text-sm text-muted">
              {ZZ.menu.combos.map((c) => (
                <li key={c.name} className="flex justify-between border-b border-white/5 py-1">
                  <span>{c.name}</span><strong className="text-orange-400">Rs. {c.price}</strong>
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-3 font-semibold">Strategic Brand Thesis</h3>
            <p className="text-sm leading-relaxed text-muted">{ZZ.brand.promise} Zing & Zest captures the under-served middle: high-trust, high-flavor, fast delivery in a mobility-first format.</p>
          </GlassCard>
        </div>
        <ChartSection name="brand" />
      </div>
    </div>
  );
}

function ForecastSection() {
  return (
    <div>
      <SectionHead title="Forecasting Models - Deliverable" subtitle="Daily, weekly, and monthly predictive models with documented assumptions and scenario analysis." />
      <GlassCard className="mb-4">
        <h3 className="mb-2 font-semibold">Model Assumptions</h3>
        <div className="flex flex-wrap gap-2">
          {['AOV Rs. 380', 'Day-1: 100 customers', '6 days/week', 'Fixed Rs. 85K/mo', 'Variable Rs. 145/unit', 'Break-even: 359 units'].map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
        </div>
      </GlassCard>
      <ChartSection name="forecast" />
    </div>
  );
}

function CompetitiveSection() {
  return (
    <div>
      <SectionHead title="Competitor Analysis Dashboard - Deliverable" subtitle="5 direct + 3 indirect competitors benchmarked across price, quality, hygiene, and digital presence." />
      <ChartSection name="competitive" />
      <GlassCard className="mt-4">
        <h3 className="mb-3 font-semibold">SWOT Snapshot</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { h: 'Strengths', p: 'Hygiene trust, differentiated flavor, mobility advantage.' },
            { h: 'Weaknesses', p: 'Single truck capacity, early brand awareness constraints.' },
            { h: 'Opportunities', p: 'Campus scale-up, office penetration, delivery partnerships.' },
            { h: 'Threats', p: 'Price wars, weather disruptions, aggregator competition.' },
          ].map((s) => (
            <div key={s.h} className="rounded-xl bg-white/5 p-3">
              <h4 className="text-sm font-bold text-orange-400">{s.h}</h4>
              <p className="mt-1 text-xs text-muted">{s.p}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function PersonasSection() {
  const themeBorder = { orange: 'border-t-orange-500', teal: 'border-t-teal-500', amber: 'border-t-amber-500' };
  return (
    <div className="space-y-8">
      <div>
        <SectionHead title="Integrated Marketing Communications" subtitle="Four-week activation strategy - Rs. 45,150 budget." />
        <ChartSection name="imc" />
      </div>
      <div>
        <SectionHead title="Customer Personas - Deliverable" subtitle="Three AI-generated, field-validated personas from 20 interviews." />
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <GlassCard key={p.id} className={`border-t-2 ${themeBorder[p.theme]}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{p.avatar}</span>
                <div className="flex-1">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-muted">{p.role}</p>
                  <Tag>{p.segment} Segment</Tag>
                </div>
                <span className="text-lg font-black text-orange-400">{p.share}</span>
              </div>
              <blockquote className="my-3 border-l-2 border-white/10 pl-3 text-xs italic text-muted">{p.quote}</blockquote>
              <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/5 p-2"><span className="text-muted">AOV</span><br /><strong>Rs. {p.aov}</strong></div>
                <div className="rounded-lg bg-white/5 p-2"><span className="text-muted">Frequency</span><br /><strong>{p.frequency}</strong></div>
              </div>
              <div className="flex flex-wrap gap-1">{p.channels.map((c) => <Tag key={c}>{c}</Tag>)}</div>
            </GlassCard>
          ))}
        </div>
        <ChartSection name="persona" />
      </div>
    </div>
  );
}

function JourneySection() {
  const [activeStage, setActiveStage] = useState(0);
  return (
    <div className="space-y-8">
      <div>
        <SectionHead title="Automation & Lifecycle Orchestration" subtitle="Retention-first growth engine with chat conversion and loyalty." />
        <GlassCard className="mb-4">
          <h3 className="mb-4 font-semibold">Customer Journey Map - 6 Stages</h3>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {JOURNEY_STAGES.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setActiveStage(i)}
                className={`min-w-[120px] flex-1 rounded-xl border p-3 text-center transition ${activeStage === i ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <p className="text-[0.6rem] font-bold text-orange-400">{s.num}</p>
                <span className="text-xl">{s.icon}</span>
                <h4 className="text-xs font-bold">{s.title}</h4>
                <p className="mt-1 text-[0.6rem] text-teal-400">{s.metric}</p>
              </button>
            ))}
          </div>
        </GlassCard>
        <ChatDemo />
        <div className="mt-4"><ChartSection name="automation" /></div>
        <RoiCalculator />
      </div>
      <div>
        <SectionHead title="Recovery Strategy - Deliverable" subtitle="25% sales drop scenario with AI-diagnosed root causes." />
        <GlassCard className="mb-4 border-rose-500/20 bg-rose-500/5">
          <h3 className="font-bold text-rose-400">Scenario: Month 3 Revenue Drop</h3>
          <p className="text-sm text-muted">Forecast Rs. 810K → Actual Rs. 540K (−25%)</p>
        </GlassCard>
        <div className="mb-4 grid gap-4 lg:grid-cols-3">
          {RECOVERY_PHASES.map((p) => (
            <GlassCard key={p.label}>
              <p className="text-[0.65rem] font-bold uppercase text-muted">{p.label}</p>
              <h4 className="font-bold">{p.title}</h4>
              <ul className="mt-2 space-y-1 text-xs text-muted">{p.items.map((x) => <li key={x}>• {x}</li>)}</ul>
              <p className="mt-3 border-t border-dashed border-white/10 pt-2 text-xs font-bold text-teal-400">{p.outcome}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="mb-4">
          <h3 className="mb-3 font-semibold">Root Cause Analysis</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {RCA_ITEMS.map((r) => (
              <div key={r.title}>
                <div className="mb-1 flex justify-between text-sm"><span>{r.title}</span><span className="text-rose-400">{r.pct}%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500" style={{ width: `${r.pct}%` }} /></div>
                <p className="mt-1 text-xs text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <ChartSection name="crisis" />
      </div>
    </div>
  );
}

function MethodologySection() {
  return (
    <div>
      <SectionHead title="AI Methodology - Prompts & Screenshots" subtitle="Documented AI workflow, prompt library, and validation evidence." />
      <div className="grid gap-4 lg:grid-cols-2">
        {AI_PROMPTS.map((p) => (
          <GlassCard key={p.id}>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="h-2 w-2 rounded-full bg-green-500" /></div>
              <span className="text-xs text-muted">{p.tool} - {p.title}</span>
              {p.validated && <span className="text-[0.6rem] text-green-400">✓ Validated</span>}
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-orange-500/10 p-2 text-xs"><strong>Prompt:</strong> {p.prompt}</div>
              <div className="rounded-lg bg-white/5 p-2 text-xs"><strong>Response:</strong> {p.response}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ConclusionSection() {
  return (
    <div>
      <SectionHead title="Executive Summary & Investment Thesis" subtitle="Closing narrative for Zing & Zest Street Bites launch readiness." />
      <GlassCard>
        <h3 className="mb-3 text-xl font-bold text-gradient">Investment Thesis</h3>
        <p className="mb-3 text-sm leading-relaxed text-secondary">
          Zing & Zest enters Lahore QSR with validated demand, affordable-premium positioning, and Rs. 45,150 launch plan targeting 100 Day-1 customers.
          Year-1 base revenue of Rs. 5.9M, break-even Month 2, and 24% net margin provide credible unit economics.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {ZZ.forecast.threeYear.map((y) => (
            <div key={y.year} className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-2xl font-black text-orange-400">{formatRs(y.rev)}</p>
              <p className="text-xs text-muted">{y.year} · {y.margin}% margin</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <div className="mt-8">
        <TeamSection compact />
      </div>
    </div>
  );
}

function AiLabSection() {
  return (
    <div>
      <SectionHead
        title="AI Lab"
        subtitle="Ultra-advanced AI toolkit - 9+ features powered by Hugging Face with smart offline fallbacks."
      />
      <AiLab />
    </div>
  );
}

function ChatDemo() {
  const [msgs, setMsgs] = useState<{ role: string; html: string }[]>([
    { role: 'bot', html: 'Welcome to Zing & Zest support. Choose an option to simulate quick customer assistance.' },
  ]);

  const demo = (key: keyof typeof CHAT_RESPONSES) => {
    const r = CHAT_RESPONSES[key];
    setMsgs((m) => [
      ...m.filter((x) => !x.html.includes('chat-options')),
      { role: 'user', html: r.user },
      { role: 'bot', html: r.bot },
    ]);
  };

  return (
    <GlassCard>
      <h3 className="mb-3 font-semibold">WhatsApp Chatbot Demo</h3>
      <div className="mb-3 max-h-48 space-y-2 overflow-y-auto rounded-xl bg-[#0a3d2e]/40 p-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`} dangerouslySetInnerHTML={{ __html: m.html }} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(['location', 'menu', 'order', 'loyalty'] as const).map((k) => (
          <Btn key={k} variant="secondary" onClick={() => demo(k)}>{k.charAt(0).toUpperCase() + k.slice(1)}</Btn>
        ))}
      </div>
    </GlassCard>
  );
}

function RoiCalculator() {
  const channels = {
    sm: { label: 'Social Media', cpm: 12, conv: 0.028, default: 12000 },
    inf: { label: 'Influencer', cpm: 8, conv: 0.042, default: 5000 },
    ev: { label: 'Event Sampling', cpm: 25, conv: 0.065, default: 7500 },
    wa: { label: 'WhatsApp Auto', cpm: 3, conv: 0.081, default: 3000 },
  };
  const [budgets, setBudgets] = useState({ sm: 12000, inf: 5000, ev: 7500, wa: 3000 });

  let totalBudget = 0, reach = 0, conv = 0;
  Object.entries(channels).forEach(([k, c]) => {
    const b = budgets[k as keyof typeof budgets];
    totalBudget += b;
    const r = b > 0 ? (b / c.cpm) * 1000 : 0;
    reach += r;
    conv += r * c.conv;
  });
  const revenue = conv * ZZ.menu.avgOrder;
  const roi = totalBudget > 0 ? Math.round(((revenue - totalBudget) / totalBudget) * 100) : 0;

  return (
    <GlassCard className="mt-4">
      <h3 className="mb-4 font-semibold">Interactive ROI Calculator</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {Object.entries(channels).map(([k, c]) => (
            <div key={k}>
              <label className="text-xs text-muted">{c.label}: Rs. {budgets[k as keyof typeof budgets].toLocaleString()}</label>
              <input type="range" min={0} max={30000} step={500} value={budgets[k as keyof typeof budgets]} onChange={(e) => setBudgets({ ...budgets, [k]: +e.target.value })} className="w-full accent-orange-500" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-orange-500/10 p-3"><p className="text-2xl font-black text-orange-400">{roi}%</p><p className="text-[0.65rem] text-muted">ROI</p></div>
          <div className="rounded-xl bg-white/5 p-3"><p className="text-lg font-bold">{Math.round(reach).toLocaleString()}</p><p className="text-[0.65rem] text-muted">Reach</p></div>
          <div className="rounded-xl bg-white/5 p-3"><p className="text-lg font-bold">{Math.round(conv)}</p><p className="text-[0.65rem] text-muted">Conversions</p></div>
          <div className="rounded-xl bg-teal-500/10 p-3"><p className="text-lg font-bold text-teal-400">{formatRs(revenue)}</p><p className="text-[0.65rem] text-muted">Revenue</p></div>
        </div>
      </div>
    </GlassCard>
  );
}
