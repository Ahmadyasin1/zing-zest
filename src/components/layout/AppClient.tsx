'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoginGate } from '@/components/auth/LoginGate';

const CopilotWidget = dynamic(
  () => import('@/components/ai/CopilotWidget').then((m) => m.CopilotWidget),
  { ssr: false },
);

export function AppClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { user, isLoading } = useAuth();

  // During SSR hydration or auth check, don't flash anything
  if (isLoading) return null;

  // Not authenticated → show fullscreen login gate (no dashboard visible behind it)
  if (!user) return <LoginGate />;

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
