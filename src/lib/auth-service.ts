import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, User } from './database';

// Auth Service - محمي من التعديل
export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'muayin-secret-key-2024';
  private readonly JWT_EXPIRES_IN = '7d';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Hash Password - محمي من التعديل
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify Password - محمي من التعديل
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT Token - محمي من التعديل
  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.JWT_EXPIRES_IN 
    });
  }

  // Verify JWT Token - محمي من التعديل
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Login - محمي من التعديل
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      // Get user from database
      const user = await db.getUserByEmail(email);
      
      if (!user) {
        return null;
      }

      // Check if user is active
      if (!user.is_active) {
        throw new Error('User account is deactivated');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      await db.updateUser(user.id, {
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Register - محمي من التعديل
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'doctor' | 'staff' | 'viewer';
  }): Promise<{ user: User; token: string } | null> {
    try {
      // Check if user already exists
      const existingUser = await db.getUserByEmail(userData.email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const password_hash = await this.hashPassword(userData.password);

      // Create user
      const user = await db.createUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password_hash,
        is_active: true,
      });

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  // Get User from Token - محمي من التعديل
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = this.verifyToken(token);
      
      if (!decoded) {
        return null;
      }

      const user = await db.getUserById(decoded.id);
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Change Password - محمي من التعديل
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await db.getUserById(userId);
      
      if (!user) {
        return false;
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password_hash);
      
      if (!isCurrentPasswordValid) {
        return false;
      }

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password
      await db.updateUser(userId, {
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  // Deactivate User - محمي من التعديل
  async deactivateUser(userId: string): Promise<boolean> {
    try {
      await db.updateUser(userId, {
        is_active: false,
        updated_at: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Deactivate user error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
