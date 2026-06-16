'use client';

import dynamic from 'next/dynamic';

const Platform = dynamic(
  () => import('@/components/platform/Platform').then((m) => m.Platform),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="font-tech text-muted text-sm tracking-widest">LOADING PLATFORM…</div>
      </div>
    ),
  },
);

export function HomePageClient() {
  return <Platform />;
}
