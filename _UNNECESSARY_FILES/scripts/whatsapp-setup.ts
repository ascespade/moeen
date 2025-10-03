#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupWhatsApp() {
  console.log('📱 Setting up WhatsApp Business API...')

  try {
    // Create WhatsApp configuration
    const { error: whatsappError } = await supabase
      .from('whatsapp_config')
      .upsert([
        {
          id: 'main-config',
          access_token: process.env.WHATSAPP_ACCESS_TOKEN,
          phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID,
          webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
          webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ])

    if (whatsappError) throw whatsappError
    console.log('✅ WhatsApp configuration saved')

    // Create webhook endpoints
    const webhookEndpoints = [
      {
        id: 'webhook-main',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`,
        events: ['messages', 'message_status'],
        is_active: true
      }
    ]

    const { error: webhookError } = await supabase
      .from('webhook_endpoints')
      .upsert(webhookEndpoints)

    if (webhookError) throw webhookError
    console.log('✅ Webhook endpoints configured')

    // Create message templates
    const templates = [
      {
        id: 'welcome-template',
        name: 'welcome_message',
        language: 'ar',
        category: 'UTILITY',
        components: JSON.stringify([
          {
            type: 'BODY',
            text: 'أهلاً وسهلاً بك في مركز الهمم! أنا مُعين، مساعدك الرقمي. كيف يمكنني مساعدتك اليوم؟'
          }
        ]),
        status: 'APPROVED',
        is_active: true
      },
      {
        id: 'appointment-reminder',
        name: 'appointment_reminder',
        language: 'ar',
        category: 'UTILITY',
        components: JSON.stringify([
          {
            type: 'BODY',
            text: 'تذكير: لديك موعد غداً في مركز الهمم في الساعة {{1}}. يرجى التأكيد أو إعادة الجدولة.'
          }
        ]),
        status: 'APPROVED',
        is_active: true
      }
    ]

    const { error: templatesError } = await supabase
      .from('message_templates')
      .upsert(templates)

    if (templatesError) throw templatesError
    console.log('✅ Message templates created')

    console.log('🎉 WhatsApp setup completed successfully!')
    console.log('📋 Next steps:')
    console.log('1. Verify your WhatsApp Business API credentials')
    console.log('2. Set up webhook verification')
    console.log('3. Test message sending')

  } catch (error) {
    console.error('❌ Error setting up WhatsApp:', error)
    process.exit(1)
  }
}

// Run the setup
setupWhatsApp()
