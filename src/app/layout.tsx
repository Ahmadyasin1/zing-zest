import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NavProvider } from '@/components/providers/NavProvider';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { AppClient } from '@/components/layout/AppClient';
import { CopilotWidget } from '@/components/ai/CopilotWidget';
import { AmbientLayer } from '@/components/ui/AmbientLayer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'Zing & Zest Street Bites | AI Marketing Intelligence Platform',
  description:
    'Ultra-modern AI-powered marketing intelligence platform for Zing & Zest Street Bites — developed by Ahmad Yasin with the UCP team.',
  icons: { icon: '/zing_zest_logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} min-h-screen`}>
        <AmbientLayer />
        <ThemeProvider>
          <NavProvider>
            <AppClient>
              <PlatformShell>{children}</PlatformShell>
              <CopilotWidget />
            </AppClient>
          </NavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
