/**
 * String Utilities - أدوات النصوص
 *
 * String manipulation utilities
 */

/**
 * Truncate string
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = '...'
): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert to slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Remove HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Extract text from HTML
 */
export function extractText(html: string): string {
  return stripHtml(html).trim();
}

/**
 * Mask sensitive data (e.g., email, phone)
 */
export function mask(str: string, visibleChars: number = 3): string {
  if (str.length <= visibleChars * 2) {
    return '*'.repeat(str.length);
  }

  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const middle = '*'.repeat(str.length - visibleChars * 2);

  return `${start}${middle}${end}`;
}

/**
 * Mask email
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  const maskedLocal = mask(local, 2);
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 6) return phone;

  return mask(cleaned, 3);
}

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Pluralize Arabic word
 */
export function pluralizeAr(
  count: number,
  singular: string,
  plural: string
): string {
  if (count === 1) return singular;
  if (count === 2) return plural;
  if (count >= 3 && count <= 10) return plural;
  return plural;
}
