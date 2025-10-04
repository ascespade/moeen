// Simple Authentication System - محمي من التعديل
export interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'staff' | 'viewer';
  password: string;
  is_active: boolean;
  created_at: string;
}

// Demo Users - محمي من التعديل
const DEMO_USERS: SimpleUser[] = [
  {
    id: 'admin-001',
    email: 'admin@alhemamcenter.com',
    name: 'مدير النظام',
    role: 'admin',
    password: 'admin123',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'doctor-001',
    email: 'doctor@alhemamcenter.com',
    name: 'د. أحمد محمد',
    role: 'doctor',
    password: 'doctor123',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'staff-001',
    email: 'staff@alhemamcenter.com',
    name: 'موظف الاستقبال',
    role: 'staff',
    password: 'staff123',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-001',
    email: 'demo@alhemamcenter.com',
    name: 'مستخدم تجريبي',
    role: 'viewer',
    password: 'demo123',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Simple Auth Service - محمي من التعديل
export class SimpleAuthService {
  // Login - محمي من التعديل
  async login(email: string, password: string): Promise<{ user: SimpleUser; token: string } | null> {
    try {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password && u.is_active);
      
      if (!user) {
        return null;
      }

      // Generate simple token
      const token = `simple-token-${user.id}-${Date.now()}`;
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at
        },
        token
      };
    } catch (error) {
      console.error('Simple auth login error:', error);
      return null;
    }
  }

  // Get User by Email - محمي من التعديل
  async getUserByEmail(email: string): Promise<SimpleUser | null> {
    try {
      const user = DEMO_USERS.find(u => u.email === email);
      return user || null;
    } catch (error) {
      console.error('Simple auth get user error:', error);
      return null;
    }
  }

  // Verify Token - محمي من التعديل
  async verifyToken(token: string): Promise<SimpleUser | null> {
    try {
      if (!token.startsWith('simple-token-')) {
        return null;
      }

      const userId = token.split('-')[2];
      const user = DEMO_USERS.find(u => u.id === userId);
      return user || null;
    } catch (error) {
      console.error('Simple auth verify token error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const simpleAuthService = new SimpleAuthService();


