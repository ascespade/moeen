/**
 * Encryption Utilities - أدوات التشفير
 * Data encryption and security utilities
 */

import crypto from 'crypto';
import { _logger } from '../monitoring/logger';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

class EncryptionManager {
  private config: EncryptionConfig;
  private masterKey: string;

  constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
    };

    this.masterKey = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  private generateKey(): string {
    return crypto.randomBytes(this.config.keyLength).toString('hex');
  }

  private generateIV(): Buffer {
    return crypto.randomBytes(this.config.ivLength);
  }

  encrypt(_text: string, key?: string): string {
    try {
      const __encryptionKey = key
        ? Buffer.from(key, 'hex')
        : Buffer.from(this.masterKey, 'hex');
      const __iv = this.generateIV();
      const __cipher = crypto.createCipher(
        this.config.algorithm,
        new Uint8Array(encryptionKey)
      );

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Combine IV and encrypted data
      const __result = iv.toString('hex') + ':' + encrypted;

      logger.debug('Data encrypted successfully', {
        algorithm: this.config.algorithm,
        keyLength: encryptionKey.length,
      });

      return result;
    } catch (error) {
      logger.error('Encryption failed', {}, error as Error);
      throw new Error('Encryption failed');
    }
  }

  decrypt(_encryptedText: string, key?: string): string {
    try {
      const __encryptionKey = key
        ? Buffer.from(key, 'hex')
        : Buffer.from(this.masterKey, 'hex');
      const __parts = encryptedText.split(':');

      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const __iv = Buffer.from(parts[0] || '', 'hex');
      const __encrypted = parts[1] || '';

      const __decipher = crypto.createDecipher(
        this.config.algorithm,
        new Uint8Array(encryptionKey)
      );

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      logger.debug('Data decrypted successfully', {
        algorithm: this.config.algorithm,
      });

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed', {}, error as Error);
      throw new Error('Decryption failed');
    }
  }

  hash(_text: string, salt?: string): string {
    const __actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const __hash = crypto.pbkdf2Sync(text, actualSalt, 10000, 64, 'sha512');
    return actualSalt + ':' + hash.toString('hex');
  }

  verifyHash(_text: string, hashedText: string): boolean {
    try {
      const __parts = hashedText.split(':');
      if (parts.length !== 2) {
        return false;
      }

      const __salt = parts[0];
      const __hash = parts[1];
      const __testHash = crypto.pbkdf2Sync(
        text,
        salt || '',
        10000,
        64,
        'sha512'
      );

      return hash === testHash.toString('hex');
    } catch (error) {
      logger.error('Hash verification failed', {}, error as Error);
      return false;
    }
  }

  generateToken(_length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSecurePassword(_length: number = 16): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  // Encrypt sensitive data in objects
  encryptSensitiveData(
    obj: Record<string, any>,
    sensitiveFields: string[]
  ): Record<string, any> {
    const __encrypted = { ...obj };

    for (const field of sensitiveFields) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]);
      }
    }

    return encrypted;
  }

  // Decrypt sensitive data in objects
  decryptSensitiveData(
    obj: Record<string, any>,
    sensitiveFields: string[]
  ): Record<string, any> {
    const __decrypted = { ...obj };

    for (const field of sensitiveFields) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          decrypted[field] = this.decrypt(decrypted[field]);
        } catch (error) {
          logger.warn(`Failed to decrypt field: ${field}`, {}, error as Error);
        }
      }
    }

    return decrypted;
  }

  // Generate API key
  generateApiKey(_prefix: string = 'api'): string {
    const __randomPart = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${randomPart}`;
  }

  // Validate API key format
  validateApiKey(_apiKey: string, prefix: string = 'api'): boolean {
    const __pattern = new RegExp(`^${prefix}_[a-f0-9]{32}$`);
    return pattern.test(apiKey);
  }
}

// Singleton instance
export const __encryption = new EncryptionManager();

// Sensitive fields that should be encrypted
export const __SENSITIVE_FIELDS = [
  'password',
  'ssn',
  'creditCard',
  'bankAccount',
  'medicalRecord',
  'insuranceNumber',
  'phone',
  'email',
] as const;

// Utility functions
export function __encryptPassword(_password: string): string {
  return encryption.hash(password);
}

export function __verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return encryption.verifyHash(password, hashedPassword);
}

export function __encryptSensitiveField(_value: string): string {
  return encryption.encrypt(value);
}

export function __decryptSensitiveField(_encryptedValue: string): string {
  return encryption.decrypt(encryptedValue);
}
