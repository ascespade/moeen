import { createId } from "@paralleldrive/cuid2";

/**
 * CUID (Collision-resistant Unique Identifier) Generator
 * A centralized system for generating unique IDs across the application
 */

// Production CUID using @paralleldrive/cuid2

// CUID alphabet (base 36 with custom characters for URL safety)
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

// Counter for uniqueness
let counter = 0;

/**
 * Generate a random string of specified length
 */
function randomString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

/**
 * Get current timestamp in base 36
 */
function timestamp(): string {
  return Date.now().toString(36);
}

// Note: pid() omitted intentionally to avoid unused symbol; timestamp/counter ensure uniqueness

/**
 * Get hostname hash (simulated for browser environment)
 */
function hostname(): string {
  if (typeof window !== "undefined") {
    return window.location.hostname
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
      .toString(36)
      .slice(-2);
  }
  return "00";
}

/**
 * Generate a CUID (Legacy implementation for backward compatibility)
 * Format: c + timestamp + counter + random + hostname
 */
export function generateCuid(): string {
  counter++;

  const timestampPart = timestamp();
  const counterPart = counter.toString(36);
  const randomPart = randomString(4);
  const hostnamePart = hostname();

  return `c${timestampPart}${counterPart}${randomPart}${hostnamePart}`;
}

/**
 * Generate a CUID for database records
 * Includes prefix for easy identification
 */
export function generateDbCuid(prefix: string = "db"): string {
  return `${prefix}_${generateCuid()}`;
}

/**
 * Generate CUID for specific entity types
 */
export const cuid = {
  // User related
  user: () => generateDbCuid("usr"),
  userRole: () => generateDbCuid("rol"),
  userSession: () => generateDbCuid("ses"),

  // Content related
  translation: () => generateDbCuid("trn"),
  conversation: () => generateDbCuid("cnv"),
  message: () => generateDbCuid("msg"),
  channel: () => generateDbCuid("chn"),

  // System related
  setting: () => generateDbCuid("set"),
  log: () => generateDbCuid("log"),
  notification: () => generateDbCuid("ntf"),

  // Generic
  generic: () => generateDbCuid("gen"),

  // Custom prefix
  custom: (prefix: string) => generateDbCuid(prefix),
};

/**
 * Validate CUID format
 */
export function isValidCuid(id: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/;
  const dbCuidRegex = /^[a-z]+_[a-z0-9]{25}$/;

  return cuidRegex.test(id) || dbCuidRegex.test(id);
}

/**
 * Extract prefix from CUID
 */
export function extractPrefix(id: string): string | null {
  const match = id.match(/^([a-z]+)_/);
  return match && typeof match[1] === "string" ? match[1] : null;
}

/**
 * Generate multiple CUIDs at once
 */
export function generateMultipleCuid(count: number, prefix?: string): string[] {
  return Array.from({ length: count }, () =>
    prefix ? generateDbCuid(prefix) : generateCuid(),
  );
}

// ===== PRODUCTION CUID IMPLEMENTATION =====

/**
 * Generate a production-grade CUID using @paralleldrive/cuid2
 * This is the recommended method for new implementations
 */
export function generateProductionCuid(): string {
  return createId();
}

/**
 * Generate a public ID with prefix for API use
 * @param prefix - Prefix for the ID (default: 'pub')
 * @returns Formatted public ID
 */
export function generatePublicId(prefix: string = "pub"): string {
  return `${prefix}_${createId()}`;
}

/**
 * Generate a short ID (last 8 characters)
 * @returns Short ID string
 */
export function generateShortId(): string {
  return createId().slice(-8);
}

/**
 * Entity-specific CUID generators for all database tables
 */
export const cuidEntity = {
  // Healthcare entities
  patient: () => generatePublicId("pat"),
  appointment: () => generatePublicId("apt"),
  session: () => generatePublicId("ses"),
  claim: () => generatePublicId("clm"),
  doctor: () => generatePublicId("doc"),

  // Chatbot entities
  flow: () => generatePublicId("flw"),
  node: () => generatePublicId("nod"),
  edge: () => generatePublicId("edg"),
  conversation: () => generatePublicId("cnv"),
  message: () => generatePublicId("msg"),
  template: () => generatePublicId("tpl"),
  integration: () => generatePublicId("int"),

  // CRM entities
  lead: () => generatePublicId("led"),
  deal: () => generatePublicId("del"),
  activity: () => generatePublicId("act"),
  contact: () => generatePublicId("cnt"),

  // System entities
  notification: () => generatePublicId("ntf"),
  audit: () => generatePublicId("aud"),
  role: () => generatePublicId("rol"),
  setting: () => generatePublicId("set"),
  user: () => generatePublicId("usr"),

  // Generic
  generic: () => generatePublicId("gen"),

  // Custom prefix
  custom: (prefix: string) => generatePublicId(prefix),
};

export default generateCuid;
