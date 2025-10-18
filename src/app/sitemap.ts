export default function sitemap(): import { MetadataRoute } from "next";.Sitemap {
  import type { import { MetadataRoute } from "next"; } from 'next';

  return [
    { url: 'https://example.com/', lastModified: new Date() },
    { url: 'https://example.com/features', lastModified: new Date() },
    { url: 'https://example.com/pricing', lastModified: new Date() },
    { url: 'https://example.com/faq', lastModified: new Date() },
    { url: 'https://example.com/privacy', lastModified: new Date() },
    { url: 'https://example.com/terms', lastModified: new Date() }
  ];
}
