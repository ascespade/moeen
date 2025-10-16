import { _createClient } from "./supabase/client";
import { _I18N_KEYS } from "@/constants/i18n-keys";

export interface DynamicContent {
  id: string;
  key: string;
  value: unknown;
  category: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  heroSlides: HeroSlide[];
  services: Service[];
  testimonials: Testimonial[];
  galleryImages: GalleryImage[];
  faqs: FAQ[];
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

/**
 * Dynamic Content Manager
 * Centralized system for managing all dynamic content from database
 * Eliminates hardcoded values and ensures all content is database-driven
 */
class DynamicContentManager {
  private supabase = createClient();
  private cache = new Map<string, any>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Get homepage content from database
   */
  async getHomepageContent(): Promise<HomepageContent> {
    const __cacheKey = "homepage_content";

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const __cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      // Load all homepage content from settings table
      const { data: settings, error } = await this.supabase
        .from("settings")
        .select("key, value")
        .in("key", [
          "homepage_hero_slides",
          "homepage_services",
          "homepage_testimonials",
          "homepage_gallery",
          "homepage_faqs",
        ]);

      if (error) {
        throw new Error(`Failed to load homepage content: ${error.message}`);
      }

      // Parse settings into structured content
      const content: HomepageContent = {
        heroSlides: this.parseSetting(settings, "homepage_hero_slides", []),
        services: this.parseSetting(settings, "homepage_services", []),
        testimonials: this.parseSetting(settings, "homepage_testimonials", []),
        galleryImages: this.parseSetting(settings, "homepage_gallery", []),
        faqs: this.parseSetting(settings, "homepage_faqs", []),
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: content,
        timestamp: Date.now(),
      });

      return content;
    } catch (error) {
      // Return empty content structure instead of hardcoded fallbacks
      return {
        heroSlides: [],
        services: [],
        testimonials: [],
        galleryImages: [],
        faqs: [],
      };
    }
  }

  /**
   * Get translations for a specific locale and namespace
   */
  async getTranslations(
    locale: "ar" | "en",
    namespace: string = "common",
  ): Promise<Record<string, string>> {
    const __cacheKey = `translations_${locale}_${namespace}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const __cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await this.supabase
        .from("translations")
        .select("key, value")
        .eq("locale", locale)
        .eq("namespace", namespace);

      if (error) {
        throw new Error(`Failed to load translations: ${error.message}`);
      }

      const translations: Record<string, string> = {};
      data?.forEach((item) => {
        translations[item.key] = item.value;
      });

      // Cache the result
      this.cache.set(cacheKey, {
        data: translations,
        timestamp: Date.now(),
      });

      return translations;
    } catch (error) {
      return {};
    }
  }

  /**
   * Get system settings
   */
  async getSettings(_keys: string[]): Promise<Record<string, any>> {
    const __cacheKey = `settings_${keys.join("_")}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const __cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const { data, error } = await this.supabase
        .from("settings")
        .select("key, value")
        .in("key", keys);

      if (error) {
        throw new Error(`Failed to load settings: ${error.message}`);
      }

      const settings: Record<string, any> = {};
      data?.forEach((item) => {
        settings[item.key] = item.value;
      });

      // Cache the result
      this.cache.set(cacheKey, {
        data: settings,
        timestamp: Date.now(),
      });

      return settings;
    } catch (error) {
      return {};
    }
  }

  /**
   * Update homepage content in database
   */
  async updateHomepageContent(
    content: Partial<HomepageContent>,
  ): Promise<void> {
    try {
      const updates: Array<{
        key: string;
        value: unknown;
        category: string;
        is_public: boolean;
      }> = [];

      if (content.heroSlides) {
        updates.push({
          key: "homepage_hero_slides",
          value: content.heroSlides,
          category: "homepage",
          is_public: true,
        });
      }

      if (content.services) {
        updates.push({
          key: "homepage_services",
          value: content.services,
          category: "homepage",
          is_public: true,
        });
      }

      if (content.testimonials) {
        updates.push({
          key: "homepage_testimonials",
          value: content.testimonials,
          category: "homepage",
          is_public: true,
        });
      }

      if (content.galleryImages) {
        updates.push({
          key: "homepage_gallery",
          value: content.galleryImages,
          category: "homepage",
          is_public: true,
        });
      }

      if (content.faqs) {
        updates.push({
          key: "homepage_faqs",
          value: content.faqs,
          category: "homepage",
          is_public: true,
        });
      }

      // Upsert settings
      for (const update of updates) {
        await this.supabase
          .from("settings")
          .upsert(update, { onConflict: "key" });
      }

      // Clear cache
      this.cache.clear();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update translations in database
   */
  async updateTranslations(
    translations: Array<{
      locale: "ar" | "en";
      namespace: string;
      key: string;
      value: string;
    }>,
  ): Promise<void> {
    try {
      await this.supabase
        .from("translations")
        .upsert(translations, { onConflict: "locale,namespace,key" });

      // Clear translation cache
      this.cache.forEach((value, key) => {
        if (key.startsWith("translations_")) {
          this.cache.delete(key);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Parse setting value from database result
   */
  private parseSetting(
    _settings: unknown[],
    key: string,
    defaultValue: unknown,
  ): unknown {
    const __setting = settings.find((s) => s.key === key);
    return setting ? setting.value : defaultValue;
  }
}

// Export singleton instance
export const __dynamicContentManager = new DynamicContentManager();
export default dynamicContentManager;
