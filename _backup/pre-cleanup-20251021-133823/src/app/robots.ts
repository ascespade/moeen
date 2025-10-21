import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/features', '/pricing', '/faq'],
      disallow: ['/api', '/admin'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
