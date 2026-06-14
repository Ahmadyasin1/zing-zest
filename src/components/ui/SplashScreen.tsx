'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZingZestLogo } from '@/components/ui/ZingZestLogo';
import { LEAD_DEVELOPER } from '@/lib/data/zz';

const MSGS = [
  'Loading market research data…',
  'Initializing AI copilot…',
  'Syncing forecast models…',
  'Building semantic search index…',
  'Preparing marketing intelligence…',
];

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ticker = setInterval(() => setMsgIdx((i) => (i + 1) % MSGS.length), 400);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 2600);
    return () => { clearInterval(ticker); clearTimeout(timer); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg-base)]"
        >
          <div className="absolute inset-0 gradient-mesh" />
          <div className="ambient-orb ambient-orb-1 opacity-40" />
          <div className="ambient-orb ambient-orb-2 opacity-30" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <div className="logo-ring mx-auto mb-8 rounded-2xl p-3">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ZingZestLogo variant="splash" priority />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-muted mb-2 text-xs font-semibold uppercase tracking-widest"
            >
              Developed by {LEAD_DEVELOPER}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              <span className="text-shimmer">AI Marketing Intelligence</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-accent mt-2 text-sm font-medium"
            >
              AI Marketing Intelligence Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mx-auto mt-8 h-1 w-56 origin-center overflow-hidden rounded-full bg-[var(--border-medium)]"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                className="progress-bar h-full"
              />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-muted mt-5 font-mono text-xs tracking-wide"
              >
                {MSGS[msgIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
