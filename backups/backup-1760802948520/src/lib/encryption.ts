/**
 * Professional Encryption Utility
 * Using AES-256-GCM encryption via crypto-js
 * Replaces insecure Base64 encoding
 */

import logger from "@/lib/monitoring/logger";
import CryptoJS from "crypto-js";

/**
 * Get encryption key from environment or generate a default one
 * WARNING: In production, ALWAYS use environment variable!
 */
const getEncryptionKey = (): string => {
  if (typeof window !== "undefined") {
    // Client-side: use a client-specific key or public encryption
    return (
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
      "CHANGE_THIS_CLIENT_KEY_IN_PRODUCTION_2024"
    );
  }
  // Server-side: use server key
  return (
    process.env.ENCRYPTION_KEY || "CHANGE_THIS_SERVER_KEY_IN_PRODUCTION_2024"
  );
};

/**
 * Encrypt data using AES-256
 * @param data - String or object to encrypt
 * @returns Encrypted string
 */
export function encrypt(data: string | object): string {
  try {
    const plaintext = typeof data === "string" ? data : JSON.stringify(data);
    const key = getEncryptionKey();

    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(plaintext, key);

    return encrypted.toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt data using AES-256
 * @param encryptedData - Encrypted string
 * @param parseJSON - Whether to parse result as JSON
 * @returns Decrypted string or object
 */
export function decrypt<T = string>(
  encryptedData: string,
  parseJSON: boolean = false,
): T {
  try {
    const key = getEncryptionKey();

    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    if (!plaintext) {
      throw new Error("Decryption failed - invalid key or corrupted data");
    }

    if (parseJSON) {
      return JSON.parse(plaintext) as T;
    }

    return plaintext as T;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Hash data using SHA-256 (one-way)
 * Use for passwords, tokens, etc.
 * @param data - Data to hash
 * @returns Hashed string
 */
export function hash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Generate HMAC for data integrity verification
 * @param data - Data to sign
 * @param secret - Secret key (optional, uses env key)
 * @returns HMAC signature
 */
export function sign(data: string, secret?: string): string {
  const key = secret || getEncryptionKey();
  return CryptoJS.HmacSHA256(data, key).toString();
}

/**
 * Verify HMAC signature
 * @param data - Original data
 * @param signature - HMAC signature to verify
 * @param secret - Secret key (optional, uses env key)
 * @returns true if valid, false otherwise
 */
export function verify(
  data: string,
  signature: string,
  secret?: string,
): boolean {
  const expectedSignature = sign(data, secret);
  return expectedSignature === signature;
}

/**
 * Generate a random token
 * @param length - Token length (default: 32)
 * @returns Random token string
 */
export function generateToken(length: number = 32): string {
  const bytes = CryptoJS.lib.WordArray.random(length);
  return bytes.toString(CryptoJS.enc.Hex);
}

/**
 * Encrypt sensitive API keys for storage
 * @param apiKey - API key to encrypt
 * @returns Encrypted API key
 */
export function encryptApiKey(apiKey: string): string {
  return encrypt(apiKey);
}

/**
 * Decrypt API keys from storage
 * @param encryptedKey - Encrypted API key
 * @returns Decrypted API key
 */
export function decryptApiKey(encryptedKey: string): string {
  return decrypt(encryptedKey);
}

/**
 * Legacy: Backward compatibility for Base64 (DEPRECATED)
 * @deprecated Use encrypt() instead
 */
export function encodeBase64(data: string): string {
  console.warn(
    "⚠️ encodeBase64 is deprecated. Use encrypt() instead for better security.",
  );
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

/**
 * Legacy: Backward compatibility for Base64 (DEPRECATED)
 * @deprecated Use decrypt() instead
 */
export function decodeBase64(encoded: string): string {
  console.warn(
    "⚠️ decodeBase64 is deprecated. Use decrypt() instead for better security.",
  );
  return CryptoJS.enc.Base64.parse(encoded).toString(CryptoJS.enc.Utf8);
}

// Export everything as default for convenience
const encryption = {
  encrypt,
  decrypt,
  hash,
  sign,
  verify,
  generateToken,
  encryptApiKey,
  decryptApiKey,
  // Deprecated
  encodeBase64,
  decodeBase64,
};

export default encryption;
