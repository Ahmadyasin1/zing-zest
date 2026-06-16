'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FLOATING_FOODS } from '@/lib/data/zz';

export function FloatingFood() {
  return (
    <div className="floating-food-field pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLOATING_FOODS.map(({ src, alt, className }, i) => (
        <motion.div
          key={alt}
          className={`floating-food ${className}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
        >
          <Image src={src} alt={alt} width={200} height={200} className="food-img-drop" priority={i < 2} />
        </motion.div>
      ))}
    </div>
  );
}
