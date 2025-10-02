import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com/', lastModified: new Date() },
    { url: 'https://example.com/features', lastModified: new Date() },
    { url: 'https://example.com/pricing', lastModified: new Date() },
    { url: 'https://example.com/faq', lastModified: new Date() },
    { url: 'https://example.com/privacy', lastModified: new Date() },
    { url: 'https://example.com/terms', lastModified: new Date() },
  ]
}

