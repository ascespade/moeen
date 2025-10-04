import { db } from './database';
import { authService } from './auth-service';

// Seed Data - محمي من التعديل
export async function seedDatabase() {
  try {
    console.log('🌱 بدء إنشاء البيانات التجريبية...');

    // Create demo users
    const users = [
      {
        email: 'admin@alhemamcenter.com',
        name: 'مدير النظام',
        role: 'admin' as const,
        password: 'admin123'
      },
      {
        email: 'doctor@alhemamcenter.com',
        name: 'د. أحمد محمد',
        role: 'doctor' as const,
        password: 'doctor123'
      },
      {
        email: 'staff@alhemamcenter.com',
        name: 'موظف الاستقبال',
        role: 'staff' as const,
        password: 'staff123'
      },
      {
        email: 'demo@alhemamcenter.com',
        name: 'مستخدم تجريبي',
        role: 'viewer' as const,
        password: 'demo123'
      }
    ];

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(userData.email);
        
        if (!existingUser) {
          // Hash password
          const hashedPassword = await authService.hashPassword(userData.password);
          
          // Create user
          const user = await db.createUser({
            email: userData.email,
            name: userData.name,
            role: userData.role,
            password_hash: hashedPassword,
            is_active: true
          });
          
          console.log(`✅ تم إنشاء المستخدم: ${userData.email}`);
        } else {
          console.log(`ℹ️ المستخدم موجود بالفعل: ${userData.email}`);
        }
      } catch (error) {
        console.error(`❌ خطأ في إنشاء المستخدم ${userData.email}:`, error);
      }
    }

    console.log('🎉 تم إنشاء البيانات التجريبية بنجاح!');
    return true;
  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات التجريبية:', error);
    return false;
  }
}

// Auto-seed on import
if (typeof window === 'undefined') {
  seedDatabase().catch(console.error);
}
