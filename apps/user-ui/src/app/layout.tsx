import { Sora, Space_Grotesk, Urbanist } from 'next/font/google';
import { ConditionalHeader } from '../components/layout/ConditionalHeader';
import { cn } from '../lib/utils';
import './global.css';
import Providers from './providers';

export const metadata = {
  title: 'Hamsoya - Premium Ayurvedic Products, Spice Blends & Pure Honey',
  description:
    'Discover authentic Ayurvedic medicines, traditional spice blends, and pure honey products. 100% natural, certified organic, and crafted with ancient wisdom for your wellness journey.',
  keywords:
    'Ayurvedic products, organic spices, pure honey, natural wellness, herbal medicines, traditional spice blends, organic health supplements',
  openGraph: {
    title: 'Hamsoya - Premium Ayurvedic Products & Natural Wellness',
    description:
      'Experience the ancient wisdom of Ayurveda with our premium collection of herbal medicines, organic spice blends, and pure honey products.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamsoya - Premium Ayurvedic Products & Natural Wellness',
    description:
      'Experience the ancient wisdom of Ayurveda with our premium collection of herbal medicines, organic spice blends, and pure honey products.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sora = Sora({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

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
          'bg-primary-bg'
        )}
      >
        <Providers>
          <ConditionalHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
