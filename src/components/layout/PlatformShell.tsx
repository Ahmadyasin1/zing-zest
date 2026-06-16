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
  cover: 'Home & Menu',
  live: 'Live Truck Tracking',
  recommend: 'AI Recommendations',
  account: 'Account · Login / Sign Up',
  inventory: 'Inventory Management',
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
          'sidebar-shell relative fixed left-0 top-0 z-50 flex h-full w-[288px] flex-col transition-transform duration-300 lg:translate-x-0',
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

        <div className="sidebar-brand-block border-b border-[var(--border-medium)] px-5 py-4">
          <span className="food-tag mb-3 inline-block">Fresh Street Food</span>
          <h2 className="font-display text-lg font-extrabold tracking-tight text-gradient-warm">Zing &amp; Zest</h2>
          <p className="text-muted text-xs">Burgers · Shawarma · Fries</p>
          <p className="text-accent mt-1.5 text-[0.65rem] font-semibold">Fresh. Fast. Full of Flavor.</p>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV_ITEMS.map((item, idx) => (
            <span key={item.id}>
              {item.section && <p className={cn('nav-section-label', idx > 0 && 'mt-3')}>{item.section}</p>}
              <button
              onClick={() => navigate(item.id)}
              className={cn(
                'relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm',
                page === item.id ? 'nav-active' : 'nav-link',
              )}
            >
              {page === item.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl border border-[var(--border-accent)] bg-gradient-to-r from-[var(--brand-orange-soft)] to-[var(--brand-teal-soft)] shadow-[0_0_20px_var(--glow-orange)]"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="text-base">{item.icon}</span>
              <span className="relative">{item.label}</span>
            </button>
            </span>
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

      <div className="lg:ml-[288px]">
        <header className="topbar-shell relative sticky top-0 z-30 flex h-[68px] items-center justify-between px-4 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted hover:text-[var(--text-primary)]" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-muted hidden text-[0.6rem] font-bold uppercase tracking-[0.18em] sm:block">
                {page === 'cover' ? 'Home' : 'Section'}
              </p>
              <p className="font-display text-sm font-bold tracking-tight text-secondary md:text-base">
                {page === 'cover' ? 'Menu & Street Bites' : CRUMBS[page]}
              </p>
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

        <main className="relative min-h-[calc(100vh-68px)] px-4 py-8 lg:px-8 lg:py-12">
          <div className="page-container">{children}</div>
        </main>

        <footer className="footer-elite px-4 py-12 lg:px-8">
          <div className="page-container grid max-w-none gap-10 text-left sm:grid-cols-3">
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
                Collaborative UCP team project - all five members contributed to Assignment 4.
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
            Assignment 4 - Fundamentals of Marketing · Developed by {LEAD_DEVELOPER} · Built with Next.js &amp; Hugging Face AI
          </p>
        </footer>
      </div>
    </div>
  );
}
