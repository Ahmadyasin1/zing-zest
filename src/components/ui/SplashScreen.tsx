'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ZingZestLogo } from '@/components/ui/ZingZestLogo';
import { FOOD_IMAGES } from '@/lib/data/zz';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 350);
    }, 1600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fffcf8]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center px-6"
          >
            <ZingZestLogo variant="splash" priority className="mx-auto mb-6" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-4 w-fit"
            >
              <Image src={FOOD_IMAGES.burger} alt="" width={120} height={120} className="food-img-drop" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Zing &amp; Zest</h1>
            <p className="text-accent mt-1 font-semibold">Fresh. Fast. Full of Flavor.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
