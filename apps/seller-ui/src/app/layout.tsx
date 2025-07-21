import { Sora, Space_Grotesk, Urbanist } from 'next/font/google';
import { cn } from '../lib/utils';
import './global.css';
import Providers from './providers';

// Font configurations matching user-ui
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Hamsoya Seller Dashboard - Manage Your Products & Orders',
    template: '%s | Hamsoya Seller Dashboard',
  },
  description:
    'Comprehensive seller dashboard for managing Ayurvedic products, spice blends, and honey inventory. Track orders, manage listings, and grow your business with Hamsoya.',
  keywords:
    'seller dashboard, product management, order tracking, inventory management, Ayurvedic products, spice blends, honey products, business analytics',
  openGraph: {
    title: 'Hamsoya Seller Dashboard - Manage Your Business',
    description:
      'Powerful seller dashboard for managing your Ayurvedic products, tracking orders, and growing your business on the Hamsoya platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hamsoya Seller Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamsoya Seller Dashboard - Manage Your Business',
    description:
      'Powerful seller dashboard for managing your Ayurvedic products, tracking orders, and growing your business on the Hamsoya platform.',
  },
  robots: {
    index: false, // Seller dashboard should not be indexed
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-arp>
      <body
        cz-shortcut-listen="true"
        className={cn(
          urbanist.variable,
          sora.variable,
          spaceGrotesk.variable,
          'bg-white text-gray-900'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
