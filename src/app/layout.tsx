import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NavProvider } from '@/components/providers/NavProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { AppClient } from '@/components/layout/AppClient';
import { AmbientLayer } from '@/components/ui/AmbientLayer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zing & Zest Street Bites | Burgers, Shawarma & More',
  description:
    'Fresh, fast, full of flavor - Zing & Zest serves burgers, shawarma, fries & drinks in Lahore. AI-powered marketing platform by Ahmad Yasin & UCP team.',
  icons: { icon: '/zing_zest_logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('zz_theme');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen`} suppressHydrationWarning>
        <AmbientLayer />
        <AuthProvider>
          <CartProvider>
            <ThemeProvider>
              <NavProvider>
                <AppClient>
                  <PlatformShell>{children}</PlatformShell>
                </AppClient>
              </NavProvider>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
