'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplashScreen } from '@/components/ui/SplashScreen';

export function AppClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <SplashScreen onDone={() => setReady(true)} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
