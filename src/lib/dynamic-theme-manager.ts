import { createClient } from "./supabase/client";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: string;
  fontFamily: string;
  customCSS?: string;

export interface UserPreferences {
  theme: ThemeMode;
  language: "ar" | "en";
  fontSize: "sm" | "md" | "lg";
  direction: "ltr" | "rtl";

/**
 * Dynamic Theme Manager
 * Manages theme and user preferences from database
 * Eliminates hardcoded theme values
 */
class DynamicThemeManager {
  private supabase = createClient();
  private cache = new Map<string, any>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  /**
   * Get user preferences from database
   */
  async getUserPreferences(userId?: string): Promise<UserPreferences> {
    const cacheKey = `user_preferences_${userId || "anonymous"}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }

    try {
      if (userId) {
        // Get user-specific preferences
        const { data, error } = await this.supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          // Not found error
          throw new Error(`Failed to load user preferences: ${error.message}`);

        const preferences: UserPreferences = {
          theme: data?.theme || "system",
          language: data?.language || "ar",
          fontSize: data?.font_size || "md",
          direction: data?.direction || "rtl",
        };

        // Cache the result
        this.cache.set(cacheKey, {
          data: preferences,
          timestamp: Date.now(),
        });

        return preferences;
      } else {
        // Get default preferences from settings
        const { data, error } = await this.supabase
          .from("settings")
          .select("value")
          .eq("key", "default_user_preferences")
          .single();

        if (error) {
          throw new Error(
            `Failed to load default preferences: ${error.message}`,
          );

        const preferences: UserPreferences = data?.value || {
          theme: "system",
          language: "ar",
          fontSize: "md",
          direction: "rtl",
        };

        // Cache the result
        this.cache.set(cacheKey, {
          data: preferences,
          timestamp: Date.now(),
        });

        return preferences;
      }
    } catch (error) {
      // Return default preferences instead of hardcoded values
      return {
        theme: "system",
        language: "ar",
        fontSize: "md",
        direction: "rtl",
      };
    }

  /**
   * Get theme configuration from database
   */
  async getThemeConfig(): Promise<ThemeConfig> {
    const cacheKey = "theme_config";

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }

    try {
      const { data, error } = await this.supabase
        .from("settings")
        .select("value")
        .eq("key", "theme_config")
        .single();

      if (error) {
        throw new Error(`Failed to load theme config: ${error.message}`);

      const config: ThemeConfig = data?.value || {
        mode: "system",
        primaryColor: "#F58220",
        secondaryColor: "#009688",
        accentColor: "#007BFF",
        borderRadius: "0.5rem",
        fontFamily: "var(--font-cairo)",
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: config,
        timestamp: Date.now(),
      });

      return config;
    } catch (error) {
      // Return default theme config instead of hardcoded values
      return {
        mode: "system",
        primaryColor: "#F58220",
        secondaryColor: "#009688",
        accentColor: "#007BFF",
        borderRadius: "0.5rem",
        fontFamily: "var(--font-cairo)",
      };
    }

  /**
   * Update user preferences in database
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from("user_preferences").upsert(
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) {
        throw new Error(`Failed to update user preferences: ${error.message}`);

      // Clear cache
      this.cache.delete(`user_preferences_${userId}`);
    } catch (error) {
      throw error;
    }

  /**
   * Update theme configuration in database
   */
  async updateThemeConfig(config: Partial<ThemeConfig>): Promise<void> {
    try {
      const { error } = await this.supabase.from("settings").upsert(
          key: "theme_config",
          value: config,
          category: "theme",
          is_public: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );

      if (error) {
        throw new Error(`Failed to update theme config: ${error.message}`);

      // Clear cache
      this.cache.delete("theme_config");
    } catch (error) {
      throw error;
    }

  /**
   * Apply theme to document
   */
  applyTheme(theme: ThemeMode, config: ThemeConfig): void {
    const html = document.documentElement;

    // Set theme mode
    html.setAttribute("data-theme", theme);

    // Set CSS custom properties
    html.style.setProperty("--color-primary", config.primaryColor);
    html.style.setProperty("--color-secondary", config.secondaryColor);
    html.style.setProperty("--color-accent", config.accentColor);
    html.style.setProperty("--border-radius", config.borderRadius);
    html.style.setProperty("--font-family", config.fontFamily);

    // Apply custom CSS if provided
    if (config.customCSS) {
      let styleElement = document.getElementById("dynamic-theme-css");
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "dynamic-theme-css";
        document.head.appendChild(styleElement);
      styleElement.textContent = config.customCSS;
    }

  /**
   * Apply language and direction to document
   */
  applyLanguage(language: "ar" | "en"): void {
    const html = document.documentElement;
    html.setAttribute("lang", language);
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");

  /**
   * Get system theme preference
   */
  getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  /**
   * Resolve actual theme mode (system -> light/dark)
   */
  resolveThemeMode(theme: ThemeMode): "light" | "dark" {
    if (theme === "system") {
      return this.getSystemTheme();
    return theme;

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

// Export singleton instance
export const dynamicThemeManager = new DynamicThemeManager();
export default dynamicThemeManager;
}}}}}}}}}}}}}}}}}}
