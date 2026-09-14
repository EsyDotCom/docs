import type { MetadataRoute } from 'next';

import { orderedInternalPages } from '@/lib/docs-navigation';

/**
 * Every page in the sidebar, and only those — the navigation is the source of
 * truth for what exists, so the sitemap cannot list an orphan or miss a page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return orderedInternalPages.map((page) => ({
    url: `https://docs.esy.com${page.href === '/' ? '' : page.href}`,
    changeFrequency: 'weekly',
    priority: page.href === '/' ? 1 : 0.7,
  }));
}
