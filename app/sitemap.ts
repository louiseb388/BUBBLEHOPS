import type { MetadataRoute } from 'next';
import { ROUTES, SITE } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const priorities: Record<string, number> = {
    home: 1.0,
    design: 0.9,
    shop: 0.8,
    gallery: 0.7,
    about: 0.5,
    faq: 0.6,
    contact: 0.5,
    terms: 0.3
  };

  return Object.entries(ROUTES)
    .filter(([key]) => !['basket', 'checkout', 'account', 'signIn'].includes(key))
    .map(([key, route]) => ({
      url: `${SITE.url}${route.path}`,
      changeFrequency: 'weekly',
      priority: priorities[key] ?? 0.5
    }));
}
