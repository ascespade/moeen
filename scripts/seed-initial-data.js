// Script to seed initial data for Al Hemam Center
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('\n🌱 بدء إدخال البيانات الأولية...\n');

  try {
    // 1. Seed Session Types (9 types for Al Hemam Center)
    console.log('📋 إدخال أنواع الجلسات (9 types)...');
    
    const sessionTypes = [
      {
        name_ar: 'تعديل السلوك',
        name_en: 'Behavior Modification (ABA)',
        description: 'خطط سلوكية فردية مبنية على منهج تحليل السلوك التطبيقي لتعزيز المهارات الاجتماعية والسلوكيات الإيجابية',
        duration: 90,
        price: 300.00,
        color: '#3B82F6',
        icon: '🧩',
      },
      {
        name_ar: 'علاج وظيفي',
        name_en: 'Occupational Therapy',
        description: 'تحسين المهارات الحركية الدقيقة والكبرى والاعتماد على الذات في الأنشطة اليومية',
        duration: 45,
        price: 200.00,
        color: '#10B981',
        icon: '🎯',
      },
      {
        name_ar: 'تكامل حسي',
        name_en: 'Sensory Integration',
        description: 'معالجة الحساسيات الحسية وتحسين التعامل مع المدخلات الحسية في غرف متخصصة',
        duration: 60,
        price: 250.00,
        color: '#8B5CF6',
        icon: '✨',
      },
      {
        name_ar: 'تنمية مهارات في الجلسة',
        name_en: 'Skills Development',
        description: 'جلسات فردية مكثفة لتطوير المهارات الأكاديمية والاجتماعية واللغوية',
        duration: 60,
        price: 220.00,
        color: '#F59E0B',
        icon: '📚',
      },
      {
        name_ar: 'برنامج التدخل المبكر',
        name_en: 'Early Intervention',
        description: 'برنامج متخصص للكشف والتدخل المبكر للأطفال من عمر 0-3 سنوات لضمان أفضل النتائج',
        duration: 45,
        price: 180.00,
        color: '#EC4899',
        icon: '👶',
      },
      {
        name_ar: 'البرنامج الشامل',
        name_en: 'Comprehensive Program',
        description: 'برنامج تأهيلي متكامل يجمع جميع الخدمات العلاجية في خطة واحدة شاملة ومنسقة',
        duration: 120,
        price: 500.00,
        color: '#6366F1',
        icon: '🌟',
      },
      {
        name_ar: 'علاج التأتأة',
        name_en: 'Stuttering Treatment',
        description: 'جلسات متخصصة لعلاج التلعثم والتأتأة باستخدام أحدث التقنيات العلاجية المثبتة علمياً',
        duration: 60,
        price: 230.00,
        color: '#F97316',
        icon: '🗣️',
      },
      {
        name_ar: 'علاج مشاكل الصوت',
        name_en: 'Voice Disorders Treatment',
        description: 'تشخيص وعلاج اضطرابات الصوت والنطق بطرق علمية متقدمة',
        duration: 45,
        price: 200.00,
        color: '#EF4444',
        icon: '🎤',
      },
      {
        name_ar: 'التأهيل السمعي',
        name_en: 'Auditory Rehabilitation',
        description: 'برامج تأهيل متخصصة لتحسين مهارات السمع والتواصل السمعي',
        duration: 60,
        price: 240.00,
        color: '#14B8A6',
        icon: '👂',
      },
    ];

    const { data: insertedTypes, error: typesError } = await supabase
      .from('session_types')
      .insert(sessionTypes)
      .select();

    if (typesError) {
      console.error('❌ خطأ في إدخال session_types:', typesError.message);
    } else {
      console.log(`✅ تم إدخال ${insertedTypes.length} نوع جلسة`);
    }

    // 2. Seed Notification Rules
    console.log('\n🔔 إدخال قواعد الإشعارات...');
    
    const notificationRules = [
      {
        event_type: 'call_requested',
        priority: 'emergency',
        notify_roles: ['supervisor', 'admin'],
        channels: ['whatsapp', 'sms', 'push'],
      },
      {
        event_type: 'session_cancelled_last_minute',
        priority: 'important',
        notify_roles: ['supervisor'],
        channels: ['whatsapp', 'push'],
      },
      {
        event_type: 'therapist_absent',
        priority: 'emergency',
        notify_roles: ['supervisor', 'admin'],
        channels: ['whatsapp', 'sms'],
      },
      {
        event_type: 'insurance_claim_approved',
        priority: 'info',
        notify_roles: ['supervisor'],
        channels: ['push', 'email'],
      },
      {
        event_type: 'payment_received',
        priority: 'info',
        notify_roles: ['admin'],
        channels: ['push'],
      },
      {
        event_type: 'negative_review',
        priority: 'important',
        notify_roles: ['supervisor', 'admin'],
        channels: ['whatsapp', 'email'],
      },
    ];

    const { data: insertedRules, error: rulesError } = await supabase
      .from('notification_rules')
      .insert(notificationRules)
      .select();

    if (rulesError) {
      console.error('❌ خطأ في إدخال notification_rules:', rulesError.message);
    } else {
      console.log(`✅ تم إدخال ${insertedRules.length} قاعدة إشعارات`);
    }

    // 3. Get therapists and create sample specializations
    console.log('\n👨‍⚕️ فحص الأخصائيين...');
    
    const { data: therapists, error: therapistsError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('role', 'doctor')
      .limit(5);

    if (therapistsError) {
      console.error('❌ خطأ:', therapistsError.message);
    } else if (therapists && therapists.length > 0 && insertedTypes) {
      console.log(`✅ وُجد ${therapists.length} أخصائي`);
      
      // Assign all session types to first therapist (example)
      console.log(`\n🎯 إضافة تخصصات لـ ${therapists[0].full_name}...`);
      
      const specializations = insertedTypes.map(type => ({
        therapist_id: therapists[0].id,
        session_type_id: type.id,
        proficiency_level: 'expert',
      }));
      
      const { error: specError } = await supabase
        .from('therapist_specializations')
        .insert(specializations);
      
      if (specError) {
        console.error('❌ خطأ في specializations:', specError.message);
      } else {
        console.log(`✅ تم إضافة ${specializations.length} تخصص`);
      }
    } else {
      console.log('⚠️  لا يوجد أخصائيون في النظام');
    }

    console.log('\n✅ تم إدخال البيانات الأولية بنجاح!\n');
    
  } catch (error) {
    console.error('\n❌ خطأ عام:', error.message);
  }
}

seedData();
