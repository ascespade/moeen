#!/usr/bin/env node
// seed_supabase_full.js
// Node.js seeder for "مركز الهمم" - comprehensive idempotent seeding for Supabase
// Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
// Run once (idempotent upserts)

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

// Helper: upsert single row by unique key
async function upsert(table, row, uniqueKeys = ['id']) {
  // Use RPC or upsert via insert with onConflict
  const { data, error } = await supabase
    .from(table)
    .upsert(row, { onConflict: uniqueKeys })
    .select()
    .limit(1);

  if (error) {
    console.error(`Upsert error [${table}]`, error);
    throw error;
  }
  return data;
}

// Helper: simple insert with return
async function insert(table, row) {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .limit(1);

  if (error) {
    console.error(`Insert error [${table}]`, error);
    throw error;
  }
  return data;
}

// Audit log helper
async function audit(userId, action, resourceType, resourceId, oldValues = null, newValues = null) {
  const row = {
    id: uuidv4(),
    user_id: userId || null,
    action,
    resource_type: resourceType,
    resource_id: resourceId || null,
    old_values: oldValues,
    new_values: newValues,
    ip_address: null,
    user_agent: 'cursor-seeder'
  };
  await upsert('audit_logs', row, ['id']);
}

// Sample realistic-ish patients from Jeddah
const samplePatients = [
  { first_name: 'محمد', last_name: 'الزهراني', phone: '+966512345001', email: 'm.zahrani@example.sa', date_of_birth: '2012-03-14', gender: 'male' },
  { first_name: 'سارة', last_name: 'الشهري', phone: '+966512345002', email: 's.alshahri@example.sa', date_of_birth: '2015-06-22', gender: 'female' },
  { first_name: 'عبدالله', last_name: 'الحربي', phone: '+966512345003', email: 'a.alharbi@example.sa', date_of_birth: '2010-11-02', gender: 'male' },
  { first_name: 'نور', last_name: 'العُمري', phone: '+966512345004', email: 'n.alomari@example.sa', date_of_birth: '2014-01-30', gender: 'female' },
  { first_name: 'علي', last_name: 'الشيخ', phone: '+966512345005', email: 'ali.sheikh@example.sa', date_of_birth: '2009-09-09', gender: 'male' }
];

// Sample doctors
const sampleDoctors = [
  { first_name: 'د. هند', last_name: 'المطيري', specialization: 'طب نفس الأطفال', phone: '+966512300101', email: 'hend.m@example.sa', consultation_fee: 300 },
  { first_name: 'د. يوسف', last_name: 'القحطاني', specialization: 'تأهيل النطق', phone: '+966512300102', email: 'youssef.q@example.sa', consultation_fee: 250 },
  { first_name: 'د. نورة', last_name: 'الزيدي', specialization: 'تقويم سلوكي', phone: '+966512300103', email: 'noura.z@example.sa', consultation_fee: 280 }
];

// Predefined roles
const roles = [
  { id: uuidv4(), name: 'admin', display_name: 'Admin', permissions: { all: true }, is_system_role: true },
  { id: uuidv4(), name: 'manager', display_name: 'Manager', permissions: { manage_users: true, manage_settings: true }, is_system_role: true },
  { id: uuidv4(), name: 'supervisor', display_name: 'Supervisor', permissions: { manage_appointments: true }, is_system_role: false },
  { id: uuidv4(), name: 'agent', display_name: 'Agent', permissions: { handle_conversations: true }, is_system_role: false },
  { id: uuidv4(), name: 'demo', display_name: 'Demo', permissions: {}, is_system_role: false }
];

// Chatbot flows templates (simplified but functional)
const flows = [
  {
    id: uuidv4(),
    name: 'حجز_موعد_جديد',
    description: 'Flow handles new appointment booking via bot',
    trigger_type: 'intent',
    trigger_keywords: ['حجز', 'موعد', 'ابغى احجز'],
    response_template: 'مرحبًا {{patient_name}}، متى تود/تودين الحضور؟',
    ai_model: 'gemini_pro',
    status: 'published'
  },
  {
    id: uuidv4(),
    name: 'استعلام_عن_موعد',
    description: 'Flow returns appointment details for patient',
    trigger_type: 'intent',
    trigger_keywords: ['موعدي', 'متى موعدي', 'الجدول'],
    response_template: 'هذا موعدك القادم: {{appointment_date}} الساعة {{appointment_time}} مع {{doctor_name}}',
    ai_model: 'gemini_pro',
    status: 'published'
  },
  {
    id: uuidv4(),
    name: 'الغاء_موعد',
    description: 'Flow handles appointment cancellation',
    trigger_type: 'intent',
    trigger_keywords: ['الغاء', 'اعيد', 'الغاء موعد'],
    response_template: 'هل تريد تأكيد إلغاء الموعد في {{appointment_date}} الساعة {{appointment_time}}؟',
    ai_model: 'gemini_pro',
    status: 'published'
  }
];

// chatbot nodes for flows (simplified)
const nodes = [
  // For حجز_موعد_جديد
  { id: uuidv4(), flowName: 'حجز_موعد_جديد', node_type: 'start', name: 'start' },
  { id: uuidv4(), flowName: 'حجز_موعد_جديد', node_type: 'message', name: 'ask_date' },
  { id: uuidv4(), flowName: 'حجز_موعد_جديد', node_type: 'action', name: 'create_appointment' },

  // For استعلام_عن_موعد
  { id: uuidv4(), flowName: 'استعلام_عن_موعد', node_type: 'start', name: 'start' },
  { id: uuidv4(), flowName: 'استعلام_عن_موعد', node_type: 'action', name: 'fetch_upcoming' },

  // For الغاء_موعد
  { id: uuidv4(), flowName: 'الغاء_موعد', node_type: 'start', name: 'start' },
  { id: uuidv4(), flowName: 'الغاء_موعد', node_type: 'confirm', name: 'confirm_cancel' }
];

// Basic chatbot templates
const templates = [
  { id: uuidv4(), name: 'greeting', category: 'greeting', language: 'ar', content: 'مرحبًا! أنا معين، مساعد مركز الهمم. كيف أقدر أساعدك اليوم؟' },
  { id: uuidv4(), name: 'ask_preferred_date', category: 'appointment', language: 'ar', content: 'ما التاريخ والوقت المفضل لديك؟' },
  { id: uuidv4(), name: 'confirm_booking', category: 'appointment', language: 'ar', content: 'تم حجز الموعد بنجاح مع {{doctor_name}} بتاريخ {{date}} الساعة {{time}}. هل ترغب إشعار عبر الإيميل؟' }
];

// WhatsApp config
const whatsappConfig = {
  id: uuidv4(),
  business_account_id: 'hemmm_business_001',
  phone_number: '+966501234567',
  access_token: 'REPLACE_WITH_REAL_TOKEN',
  webhook_url: null,
  is_active: true
};

// System default settings
const defaultSettings = [
  { public_id: 'site:branding', key: 'site:branding', value: { site_name: 'مركز الهمم', logo: 'logo.png', primary_color: '#004aad' }, description: 'Branding' },
  { public_id: 'chatbot:default', key: 'chatbot:default', value: { name: 'معين', language: 'ar', default_model: 'gemini_pro' }, description: 'Chatbot core settings' },
  { public_id: 'notifications:defaults', key: 'notifications:defaults', value: { email_from: 'info@alhemmcenter.sa', telegram_group_id: null }, description: 'Notification defaults' }
];

// Translations (common)
const translations = [
  { locale: 'ar', namespace: 'common', key: 'book_appointment', value: 'حجز موعد' },
  { locale: 'ar', namespace: 'common', key: 'cancel_appointment', value: 'إلغاء موعد' },
  { locale: 'ar', namespace: 'common', key: 'contact_us', value: 'تواصل معنا' },
  { locale: 'en', namespace: 'common', key: 'book_appointment', value: 'Book Appointment' },
  { locale: 'en', namespace: 'common', key: 'contact_us', value: 'Contact Us' }
];

// Training data minimal
const trainingData = [
  { id: uuidv4(), input_text: 'أريد حجز موعد', expected_output: 'trigger:حجز_موعد_جديد', category: 'intent', tags: ['booking'], confidence_score: 0.9, is_verified: true },
  { id: uuidv4(), input_text: 'متى موعدي القادم', expected_output: 'trigger:استعلام_عن_موعد', category: 'intent', tags: ['inquiry'], confidence_score: 0.85, is_verified: true },
  { id: uuidv4(), input_text: 'أريد إلغاء الموعد', expected_output: 'trigger:الغاء_موعد', category: 'intent', tags: ['cancel'], confidence_score: 0.9, is_verified: true }
];

async function seed() {
  console.log('Starting seeding process for مركز الهمم...');
  try {
    // 1) Roles
    console.log('Checking and creating roles...');
    for (const r of roles) {
      // Check if role exists first
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', r.name)
        .maybeSingle();
      
      if (!existingRole) {
        await insert('roles', r);
        console.log(`Created role: ${r.name}`);
      } else {
        console.log(`Role already exists: ${r.name}`);
      }
    }

    // 2) Create owner/admin users (passwords hashed)
    console.log('Creating core users...');
    const coreUsers = [
      { email: 'admin@alhemm.sa', password: 'AdminStrongPass!2025', name: 'مسؤول النظام', role: 'admin' },
      { email: 'manager@alhemm.sa', password: 'ManagerStrongPass!2025', name: 'مدير المركز', role: 'manager' }
    ];

    for (const cu of coreUsers) {
      // Check if user exists first
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', cu.email)
        .maybeSingle();
      
      if (!existingUser) {
        // Hash password for storing in users table (if you use Supabase Auth separately, you may want to call admin.createUser)
        const passwordHash = await bcrypt.hash(cu.password, 10);
        const row = {
          id: uuidv4(),
          email: cu.email,
          password_hash: passwordHash,
          name: cu.name,
          role: cu.role,
          status: 'active',
          is_active: true
        };
        // Insert new user
        await insert('users', row);
        console.log(`Created user: ${cu.email}`);
        // audit
        await audit(row.id, 'seed:create_user', 'user', row.id, null, { email: cu.email, role: cu.role });
      } else {
        console.log(`User already exists: ${cu.email}`);
      }
    }

    // 3) Roles assignment (user_roles)
    console.log('Assigning roles to users...');
    // fetch created users
    const { data: usersList } = await supabase.from('users').select().in('email', coreUsers.map(u => u.email));
    for (const u of usersList) {
      // find matching role id
      const role = await supabase.from('roles').select().eq('name', u.role).single();
      if (role.error) continue;
      const ur = {
        id: uuidv4(),
        user_id: u.id,
        role_id: role.data.id,
        assigned_by: u.id,
        assigned_at: new Date().toISOString(),
        is_active: true
      };
      await upsert('user_roles', ur, ['user_id', 'role_id']);
    }

    // 4) Doctors
    console.log('Seeding doctors...');
    for (const d of sampleDoctors) {
      // Check if doctor exists first
      const { data: existingDoctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('email', d.email)
        .maybeSingle();
      
      if (!existingDoctor) {
        const doc = {
          id: uuidv4(),
          user_id: null,
          first_name: d.first_name,
          last_name: d.last_name,
          specialization: d.specialization,
          license_number: `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
          phone: d.phone,
          email: d.email,
          consultation_fee: d.consultation_fee,
          is_active: true,
          public_id: `doc_${Math.random().toString(36).slice(2, 9)}`
        };
        await insert('doctors', doc);
        console.log(`Created doctor: ${d.email}`);
      } else {
        console.log(`Doctor already exists: ${d.email}`);
      }
    }

    // 5) Patients
    console.log('Seeding patients...');
    const insertedPatients = [];
    for (const p of samplePatients) {
      // Check if patient exists first
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('email', p.email)
        .maybeSingle();
      
      if (!existingPatient) {
        const patient = {
          id: uuidv4(),
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          phone: p.phone,
          date_of_birth: p.date_of_birth,
          gender: p.gender,
          public_id: `pat_${Math.random().toString(36).slice(2, 9)}`
        };
        await insert('patients', patient);
        console.log(`Created patient: ${p.email}`);
        insertedPatients.push(patient);
      } else {
        console.log(`Patient already exists: ${p.email}`);
        // Get existing patient for appointments
        const { data: existingPatientData } = await supabase
          .from('patients')
          .select('*')
          .eq('email', p.email)
          .single();
        if (existingPatientData) {
          insertedPatients.push(existingPatientData);
        }
      }
    }

    // 6) WhatsApp config
    console.log('Upserting WhatsApp config...');
    await upsert('whatsapp_configs', whatsappConfig, ['business_account_id']);

    // 7) Chatbot flows, nodes, templates
    console.log('Seeding chatbot flows & templates...');
    for (const f of flows) {
      await upsert('chatbot_flows', {
        id: f.id,
        public_id: `flow_${f.name}_${Math.random().toString(36).slice(2,7)}`,
        name: f.name,
        description: f.description,
        status: f.status,
        version: 1,
        created_by: null
      }, ['public_id']);
    }

    // nodes
    for (const n of nodes) {
      // find flow id by name
      const { data: flowData } = await supabase.from('chatbot_flows').select().eq('name', n.flowName).maybeSingle();
      const nodeRow = {
        id: n.id,
        public_id: `node_${n.name}_${Math.random().toString(36).slice(2,7)}`,
        flow_id: flowData?.id || null,
        node_type: n.node_type,
        name: n.name,
        config: {},
        position_x: 0,
        position_y: 0
      };
      await upsert('chatbot_nodes', nodeRow, ['public_id']);
    }

    // templates
    for (const t of templates) {
      await upsert('chatbot_templates', {
        id: t.id,
        public_id: `tpl_${t.name}_${Math.random().toString(36).slice(2,7)}`,
        name: t.name,
        category: t.category,
        language: t.language,
        content: t.content,
        variables: {},
        is_approved: true,
        created_by: null
      }, ['public_id']);
    }

    // 8) Settings
    console.log('Seeding settings...');
    for (const s of defaultSettings) {
      await upsert('settings', {
        id: uuidv4(),
        public_id: s.public_id,
        key: s.key,
        value: s.value,
        description: s.description,
        category: 'general',
        is_public: true,
        updated_by: null
      }, ['key']);
    }

    // 9) Translations
    console.log('Seeding translations...');
    for (const t of translations) {
      await upsert('translations', t, ['locale', 'namespace', 'key']);
    }

    // 10) Training data
    console.log('Seeding training data...');
    for (const td of trainingData) {
      await upsert('ai_training_data', {
        id: td.id,
        input_text: td.input_text,
        expected_output: td.expected_output,
        category: td.category,
        tags: td.tags,
        confidence_score: td.confidence_score,
        is_verified: td.is_verified,
        verified_by: null
      }, ['id']);
    }

    // 11) Create sample appointments (link patients and doctors)
    console.log('Seeding appointments...');
    // fetch doctor ids
    const { data: doctors } = await supabase.from('doctors').select('*');
    const { data: patients } = await supabase.from('patients').select('*');

    if (doctors && patients) {
      // create appointments for next 7 days
      const now = new Date();
      for (let i = 0; i < Math.min(patients.length, 5); i++) {
        const patient = patients[i];
        const doctor = doctors[i % doctors.length];
        const apptDate = new Date(now.getTime() + ((i+1) * 24 * 60 * 60 * 1000));
        const dateStr = apptDate.toISOString().slice(0,10); // YYYY-MM-DD
        const timeStr = `09:0${i}:00`; // 09:00, 09:01 etc

        const appointment = {
          id: uuidv4(),
          patient_id: patient.id,
          doctor_id: doctor.id,
          appointment_date: dateStr,
          appointment_time: timeStr,
          duration: 30,
          status: 'scheduled',
          notes: 'تم الحجز عبر الشات بوت معين',
          public_id: `appt_${Math.random().toString(36).slice(2,9)}`
        };
        await upsert('appointments', appointment, ['public_id']);
      }
    }

    // 12) Sessions (empty / created from appointments as needed)
    console.log('Seeding sessions (sparse)...');
    // We'll leave sessions creation to workflows when appointment completed.

    // 13) Notifications sample
    console.log('Seeding notification templates...');
    await upsert('notifications', {
      id: uuidv4(),
      user_id: null,
      title: 'مرحبًا من مركز الهمم',
      message: 'تم تهيئة النظام وتجهيز الحسابات الأساسية.',
      type: 'info',
      is_read: false,
      metadata: {}
    }, ['title']);

    // 14) WhatsApp templates
    console.log('Seeding whatsapp templates...');
    const waTpl = {
      id: uuidv4(),
      template_id: 'alhemm_booking_confirm',
      name: 'حجز_تأكيد',
      category: 'TRANSACTIONAL',
      language: 'ar',
      status: 'active',
      components: [{ type: 'BODY', text: 'تم تأكيد حجزك مع {doctor} بتاريخ {date} الساعة {time}' }],
      usage_count: 0,
      is_active: true
    };
    await upsert('whatsapp_templates', waTpl, ['template_id']);

    // 15) Create basic ai_models entry
    console.log('Seeding ai_models...');
    await upsert('ai_models', {
      id: uuidv4(),
      name: 'gemini_pro',
      model_type: 'llm',
      api_key: null,
      api_url: 'https://api.fake-llm-provider.example',
      configuration: {},
      is_active: true
    }, ['name']);

    // Final audit
    console.log('Finalizing seeding and writing audit log...');
    // find admin
    const { data: adminData } = await supabase.from('users').select().eq('role', 'admin').limit(1).single();
    const adminId = adminData?.id || null;
    await audit(adminId, 'seed:complete', 'system', null, null, { seeded_at: new Date().toISOString() });

    console.log('Seeding completed successfully.');
    console.log('Please review WhatsApp access_token in whatsapp_configs and replace it with the real token.');
    console.log('Check Supabase Auth if you want real email-confirmation flows (consider creating Auth users via admin API).');

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
