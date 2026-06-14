'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Presentation } from 'lucide-react';
import { Btn } from '@/components/ui/primitives';

const SLIDES = [
  { title: 'Zing & Zest Street Bites', body: 'Fresh. Fast. Full of Flavor.\nAI-powered marketing intelligence for Lahore food truck launch.' },
  { title: 'Research Foundation', body: '20 semi-structured interviews · 18 hygiene mentions · PKR 300–500 price band validated.' },
  { title: 'Customer Personas', body: '3 AI-validated personas: UCP Student (60%), Professional (28%), Explorer (12%).' },
  { title: 'Forecast Confidence', body: 'Year-1 Rs. 5.9M base · Break-even Month 2 · 24% net margin · 3 scenarios modeled.' },
  { title: 'Competitive Edge', body: 'White space at Rs. 380 with 4.6★ target — hygiene (95), price-value (90), digital (88).' },
  { title: 'IMC Launch Plan', body: 'Rs. 45,150 budget · 5,000 impressions · 200 DMs · 100 Day-1 customers.' },
  { title: 'AI Lab Capabilities', body: 'Copilot · Image Gen · Vision · RAG Search · Campaign Copy · Sentiment · Persona Matcher.' },
  { title: 'Investment Thesis', body: 'Scalable street-food platform · Rs. 19M Year-3 trajectory · Crisis-ready recovery plan.' },
];

export function PresentationMode() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const nav = (d: number) => setIdx((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <>
      <Btn variant="secondary" onClick={() => { setOpen(true); setIdx(0); }} className="hidden sm:flex items-center gap-1">
        <Presentation className="h-4 w-4" /> Present
      </Btn>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col bg-[var(--bg-base)] gradient-mesh"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-medium)] px-6 py-4">
              <p className="text-sm text-secondary">{idx + 1} / {SLIDES.length} · {SLIDES[idx].title}</p>
              <button onClick={() => setOpen(false)} aria-label="Exit"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <h2 className="text-4xl font-black text-gradient md:text-5xl">{SLIDES[idx].title}</h2>
                <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-secondary">{SLIDES[idx].body}</p>
              </motion.div>
            </div>
            <div className="flex justify-center gap-4 border-t border-[var(--border-medium)] px-6 py-4">
              <Btn variant="secondary" onClick={() => nav(-1)}><ChevronLeft className="h-4 w-4" /></Btn>
              <Btn variant="primary" onClick={() => nav(1)}><ChevronRight className="h-4 w-4" /></Btn>
              <Btn variant="ghost" onClick={() => setOpen(false)}>Exit</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
