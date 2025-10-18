/**
 * Design System Types - أنواع نظام التصميم
 * Basic types for design system compatibility
 * أنواع أساسية لتوافق نظام التصميم
 */

export type Theme = "light" | "dark" | "system";
export type Language = "ar" | "en";
export type Direction = "ltr" | "rtl";

export interface DesignSystemConfig {
  theme: Theme;
  language: Language;
  direction: Direction;
  breakpoint: "sm" | "md" | "lg" | "xl" | "2xl";
  fontSize: "sm" | "base" | "lg" | "xl";
  spacing: "compact" | "normal" | "relaxed";
