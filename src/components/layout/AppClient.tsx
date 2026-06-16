'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SplashScreen } from '@/components/ui/SplashScreen';

const CopilotWidget = dynamic(
  () => import('@/components/ai/CopilotWidget').then((m) => m.CopilotWidget),
  { ssr: false },
);

export function AppClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <SplashScreen onDone={() => setReady(true)} />}
      <div className={ready ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'}>
        {children}
        {ready && <CopilotWidget />}
      </div>
    </>
  );
}
