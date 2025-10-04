#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create roles
    const { error: rolesError } = await supabase
      .from('roles')
      .upsert([
        { id: 1, name: 'admin', description: 'مدير النظام' },
        { id: 2, name: 'staff', description: 'موظف' },
        { id: 3, name: 'viewer', description: 'مشاهد' }
      ])

    if (rolesError) throw rolesError
    console.log('✅ Roles created')

    // Create admin user
    const { error: adminError } = await supabase
      .from('users')
      .upsert([
        {
          id: 'admin-001',
          email: 'admin@alhemamcenter.com',
          full_name: 'مدير النظام',
          role_id: 1,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ])

    if (adminError) throw adminError
    console.log('✅ Admin user created')

    // Create conversation flows
    const { error: flowsError } = await supabase
      .from('conversation_flows')
      .upsert([
        {
          id: 'welcome-flow',
          name: 'ترحيب المستفيد الجديد',
          description: 'مسار ترحيب المستفيدين الجدد',
          steps: JSON.stringify([
            { type: 'message', content: 'أهلاً وسهلاً بك في مركز الهمم! أنا مُعين، مساعدك الرقمي.' },
            { type: 'question', content: 'كيف يمكنني مساعدتك اليوم؟', options: ['استفسار جديد', 'حجز موعد', 'معلومات عن الخدمات'] }
          ]),
          is_active: true
        },
        {
          id: 'appointment-flow',
          name: 'حجز المواعيد',
          description: 'مسار حجز المواعيد',
          steps: JSON.stringify([
            { type: 'message', content: 'سأساعدك في حجز موعد. هل هذا موعد جديد أم متابعة؟' },
            { type: 'question', content: 'أي نوع من الخدمات تحتاج؟', options: ['تقييم أولي', 'جلسة علاج', 'استشارة'] }
          ]),
          is_active: true
        }
      ])

    if (flowsError) throw flowsError
    console.log('✅ Conversation flows created')

    // Create AI settings
    const { error: aiSettingsError } = await supabase
      .from('ai_settings')
      .upsert([
        {
          id: 'default-settings',
          provider: 'gemini',
          model: 'gemini-pro',
          temperature: 0.7,
          max_tokens: 1000,
          system_prompt: 'أنت مُعين، المساعد الذكي لمركز الهمم. يجب أن تكون متعاطفاً، صبوراً، ومفيداً. تجنب التشخيص الطبي ووجه المستفيدين للطاقم الطبي عند الحاجة.',
          is_active: true
        }
      ])

    if (aiSettingsError) throw aiSettingsError
    console.log('✅ AI settings created')

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
