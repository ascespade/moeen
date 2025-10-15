/**
 * Encryption Utilities - أدوات التشفير
 * Data encryption and security utilities
 */

import crypto from 'crypto';
import { logger } from '../monitoring/logger';

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

  encrypt(text: string, key?: string): string {
    try {
      const encryptionKey = key ? Buffer.from(key, 'hex') : Buffer.from(this.masterKey, 'hex');
      const iv = this.generateIV();
      const cipher = crypto.createCipher(this.config.algorithm, encryptionKey);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, authTag, and encrypted data
      const result = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
      
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

  decrypt(encryptedText: string, key?: string): string {
    try {
      const encryptionKey = key ? Buffer.from(key, 'hex') : Buffer.from(this.masterKey, 'hex');
      const parts = encryptedText.split(':');
      
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];
      
      const decipher = crypto.createDecipher(this.config.algorithm, encryptionKey);
      decipher.setAuthTag(authTag);
      
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

  hash(text: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(text, actualSalt, 10000, 64, 'sha512');
    return actualSalt + ':' + hash.toString('hex');
  }

  verifyHash(text: string, hashedText: string): boolean {
    try {
      const parts = hashedText.split(':');
      if (parts.length !== 2) {
        return false;
      }
      
      const salt = parts[0];
      const hash = parts[1];
      const testHash = crypto.pbkdf2Sync(text, salt, 10000, 64, 'sha512');
      
      return hash === testHash.toString('hex');
    } catch (error) {
      logger.error('Hash verification failed', {}, error as Error);
      return false;
    }
  }

  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Encrypt sensitive data in objects
  encryptSensitiveData(obj: Record<string, any>, sensitiveFields: string[]): Record<string, any> {
    const encrypted = { ...obj };
    
    for (const field of sensitiveFields) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]);
      }
    }
    
    return encrypted;
  }

  // Decrypt sensitive data in objects
  decryptSensitiveData(obj: Record<string, any>, sensitiveFields: string[]): Record<string, any> {
    const decrypted = { ...obj };
    
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
  generateApiKey(prefix: string = 'api'): string {
    const randomPart = crypto.randomBytes(16).toString('hex');
    return `${prefix}_${randomPart}`;
  }

  // Validate API key format
  validateApiKey(apiKey: string, prefix: string = 'api'): boolean {
    const pattern = new RegExp(`^${prefix}_[a-f0-9]{32}$`);
    return pattern.test(apiKey);
  }
}

// Singleton instance
export const encryption = new EncryptionManager();

// Sensitive fields that should be encrypted
export const SENSITIVE_FIELDS = [
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
export function encryptPassword(password: string): string {
  return encryption.hash(password);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return encryption.verifyHash(password, hashedPassword);
}

export function encryptSensitiveField(value: string): string {
  return encryption.encrypt(value);
}

export function decryptSensitiveField(encryptedValue: string): string {
  return encryption.decrypt(encryptedValue);
}