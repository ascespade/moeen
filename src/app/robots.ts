export default function robots(): import { MetadataRoute } from "next";.Robots {
  import type { import { MetadataRoute } from "next"; } from 'next';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/features', '/pricing', '/faq'],
      disallow: ['/api', '/admin']
    },
    sitemap: 'https://example.com/sitemap.xml'
  };
}
