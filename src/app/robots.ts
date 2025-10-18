export default function robots(): MetadataRoute.Robots {
import type { MetadataRoute } from "next";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/features", "/pricing", "/faq"],
      disallow: ["/api", "/admin"],
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}
