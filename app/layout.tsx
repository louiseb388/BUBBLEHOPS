import type { Metadata } from 'next';
import { Poppins, Archivo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import JsonLd from '@/components/JsonLd';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { ROUTES, SITE } from '@/lib/data';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
});
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: ROUTES.home.title, template: `%s | ${SITE.name}` },
  description: ROUTES.home.desc,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_GB',
    title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers",
    description: "Design hand-painted custom kids' trainers online. Pick a base, add their name, we paint it by hand in the UK.",
    url: SITE.url,
    images: [{ url: '/photos/bubblehops-custom-kids-trainers-hero.jpg', alt: "Hand-painted custom kids' trainers by BUBBLEHOPS" }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers",
    description: 'Design hand-painted custom kids’ trainers online. Painted by hand in the UK.',
    images: ['/photos/bubblehops-custom-kids-trainers-hero.jpg']
  },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } },
  themeColor: '#201e1d'
};

const orgWebsiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      description: "Hand-painted custom kids' trainers, painted to order in the United Kingdom.",
      areaServed: 'GB',
      sameAs: [SITE.instagramUrl],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        areaServed: 'GB',
        availableLanguage: 'English'
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#site`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: 'en-GB',
      publisher: { '@id': `${SITE.url}/#org` }
    },
    {
      '@type': 'Product',
      '@id': `${SITE.url}/create-your-own#product`,
      name: "Custom Hand-Painted Kids' Trainers",
      description: "Choose a base trainer, add a name or word in graffiti lettering and bubble stickers, and we hand-paint the pair to order in the UK.",
      brand: { '@id': `${SITE.url}/#org` },
      category: "Children's Footwear",
      image: `${SITE.url}/photos/bubblehops-custom-kids-trainers-hero.jpg`,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'GBP',
        lowPrice: '78',
        highPrice: '157',
        availability: 'https://schema.org/InStock'
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${poppins.variable} ${archivo.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <JsonLd data={orgWebsiteJsonLd} />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
