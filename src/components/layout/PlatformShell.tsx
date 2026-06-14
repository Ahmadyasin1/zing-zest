'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Sparkles, MapPin } from 'lucide-react';
import { NAV_ITEMS, LEAD_DEVELOPER, TEAM, type PageId } from '@/lib/data/zz';
import { useNav } from '@/components/providers/NavProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { PresentationMode } from '@/components/ui/PresentationMode';
import { ZingZestLogo } from '@/components/ui/ZingZestLogo';
import { cn } from '@/lib/utils';

const CRUMBS: Record<PageId, string> = {
  cover: 'Executive Overview',
  report: 'Executive Report',
  part1: 'Research & Brand',
  part2: 'Forecasting Models',
  part3: 'Competitor Dashboard',
  part4: 'Customer Personas & IMC',
  part5: 'Journey & Recovery',
  transparency: 'AI Methodology',
  conclusion: 'Executive Summary',
  ai: 'AI Lab',
};

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const { page, goTo } = useNav();
  const { theme, toggle } = useTheme();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) +
          ' · ' +
          d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      );
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrollPct(h.scrollHeight > h.clientHeight ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (id: PageId) => {
    goTo(id);
    setSidebarOpen(false);
  };

  return (
    <div className="relative z-10">
      <div
        className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left progress-bar"
        style={{ transform: `scaleX(${scrollPct})` }}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'sidebar-shell fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-medium)] p-5">
          <div className="logo-ring rounded-xl p-1">
            <ZingZestLogo variant="sidebar" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted hover:text-[var(--text-primary)]" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[var(--border-medium)] px-5 py-4">
          <h2 className="font-display text-lg font-extrabold tracking-tight">Zing &amp; Zest</h2>
          <p className="text-muted text-xs">AI Marketing Intelligence</p>
          <p className="text-accent mt-1.5 text-[0.65rem] font-semibold tracking-wide">Fresh. Fast. Full of Flavor.</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={cn(
                'relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm',
                page === item.id ? 'nav-active' : 'nav-link',
              )}
            >
              {page === item.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl border border-[var(--border-accent)] bg-[var(--brand-orange-soft)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="text-base">{item.icon}</span>
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-[var(--border-medium)] p-4">
          <div className="surface-muted flex items-center gap-2 rounded-xl px-3 py-2">
            <MapPin className="accent-orange h-3.5 w-3.5 shrink-0" />
            <p className="text-muted text-[0.62rem] leading-relaxed">
              Lahore · Spring 2026<br />
              <span className="text-secondary font-medium">AIUE3013 · UCP</span>
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:ml-[280px]">
        <header className="topbar-shell sticky top-0 z-30 flex h-[64px] items-center justify-between px-4 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-[var(--text-primary)]" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-muted hidden text-[0.6rem] font-medium uppercase tracking-widest sm:block">Section</p>
              <p className="font-display text-sm font-bold text-secondary">{CRUMBS[page]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="surface-muted hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand-teal)]" />
              {clock}
            </span>
            <button onClick={toggle} className="rounded-xl p-2.5 text-muted transition hover:bg-[var(--brand-orange-soft)] hover:text-[var(--text-primary)]" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <PresentationMode />
            <button
              onClick={() => navigate('ai')}
              className="btn-primary hidden items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Lab
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-64px)] px-4 py-10 lg:px-10 lg:py-12">{children}</main>

        <footer className="footer-elite px-4 py-10 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-8 text-left sm:grid-cols-3">
            <div>
              <ZingZestLogo variant="compact" className="mb-3" />
              <p className="text-muted mt-2 text-xs leading-relaxed">
                AI-powered marketing intelligence platform for Lahore street-food growth strategy.
              </p>
              <p className="text-secondary mt-3 text-[0.7rem] leading-relaxed">
                Main Developer: <span className="font-semibold text-[var(--text-primary)]">{LEAD_DEVELOPER}</span>
              </p>
            </div>
            <div>
              <p className="text-muted mb-2 text-[0.65rem] font-bold uppercase tracking-widest">Team</p>
              <p className="text-secondary text-[0.7rem] leading-relaxed">
                {TEAM.map((m) => m.name).join(' · ')}
              </p>
              <p className="text-muted mt-2 text-[0.65rem] leading-relaxed">
                Collaborative UCP team project — all five members contributed to Assignment 4.
              </p>
            </div>
            <div>
              <p className="text-muted mb-2 text-[0.65rem] font-bold uppercase tracking-widest">Course</p>
              <p className="text-secondary text-[0.7rem] leading-relaxed">
                Dr. Shahjahan Masud<br />
                UCP · AIUE3013 · Spring 2026
              </p>
            </div>
          </div>
          <div className="section-rule mx-auto mt-8 max-w-xs opacity-30" />
          <p className="text-muted mt-4 text-center text-[0.65rem]">
            Assignment 4 — Fundamentals of Marketing · Developed by {LEAD_DEVELOPER} · Built with Next.js &amp; Hugging Face AI
          </p>
        </footer>
      </div>
    </div>
  );
}
