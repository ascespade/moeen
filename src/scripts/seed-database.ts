/**
 * Database Seeding Script
 * ملء قاعدة البيانات ببيانات تجريبية
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Sample data
const sampleUsers = [
  {
    id: 'user_1',
    email: 'admin@alhemam.sa',
    name: 'أحمد محمد العتيبي',
    role: 'admin',
    phone: '+966501234567',
    is_active: true,
    preferences: {
      position: 'مدير المركز',
      department: 'الإدارة',
      hire_date: '2020-01-15'
    }
  },
  {
    id: 'user_2',
    email: 'dr.nora@alhemam.sa',
    name: 'د. نورة أحمد الزيدي',
    role: 'agent',
    phone: '+966501234568',
    is_active: true,
    preferences: {
      position: 'طبيبة علاج طبيعي',
      department: 'العلاج الطبيعي',
      specialization: 'تقويم سلوكي',
      license_number: 'LIC-001',
      hire_date: '2021-03-10'
    }
  },
  {
    id: 'user_3',
    email: 'dr.hind@alhemam.sa',
    name: 'د. هند محمد المطيري',
    role: 'agent',
    phone: '+966501234569',
    is_active: true,
    preferences: {
      position: 'طبيبة نفسية',
      department: 'الطب النفسي',
      specialization: 'طب نفس الأطفال',
      license_number: 'LIC-002',
      hire_date: '2021-06-20'
    }
  },
  {
    id: 'user_4',
    email: 'dr.youssef@alhemam.sa',
    name: 'د. يوسف أحمد القحطاني',
    role: 'agent',
    phone: '+966501234570',
    is_active: true,
    preferences: {
      position: 'أخصائي نطق',
      department: 'علاج النطق',
      specialization: 'تأهيل النطق',
      license_number: 'LIC-003',
      hire_date: '2021-09-15'
    }
  },
  {
    id: 'user_5',
    email: 'reception@alhemam.sa',
    name: 'فاطمة علي السعيد',
    role: 'agent',
    phone: '+966501234571',
    is_active: true,
    preferences: {
      position: 'موظفة استقبال',
      department: 'الاستقبال',
      hire_date: '2022-01-10'
    }
  }
];

const samplePatients = [
  {
    id: 'patient_1',
    first_name: 'سارة',
    last_name: 'أحمد العتيبي',
    email: 'sara.ahmed@example.com',
    phone: '+966501234572',
    date_of_birth: '2015-03-15',
    gender: 'female',
    public_id: 'MR001',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS001',
    emergency_contact_name: 'أحمد العتيبي',
    emergency_contact_phone: '+966501234573',
    address: 'جدة، حي الصفا',
    medical_history: 'التوحد، تأخر النطق',
    allergies: 'لا توجد حساسية معروفة'
  },
  {
    id: 'patient_2',
    first_name: 'محمد',
    last_name: 'عبدالله القحطاني',
    email: 'mohammed.abdullah@example.com',
    phone: '+966501234574',
    date_of_birth: '2018-07-22',
    gender: 'male',
    public_id: 'MR002',
    insurance_provider: 'تأمين تكافل',
    insurance_number: 'INS002',
    emergency_contact_name: 'عبدالله القحطاني',
    emergency_contact_phone: '+966501234575',
    address: 'جدة، حي الروضة',
    medical_history: 'متلازمة داون، تأخر في المهارات الحركية',
    allergies: 'حساسية من المكسرات'
  },
  {
    id: 'patient_3',
    first_name: 'نورا',
    last_name: 'سعد المطيري',
    email: 'nora.saad@example.com',
    phone: '+966501234576',
    date_of_birth: '2016-11-08',
    gender: 'female',
    public_id: 'MR003',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS003',
    emergency_contact_name: 'سعد المطيري',
    emergency_contact_phone: '+966501234577',
    address: 'جدة، حي النهضة',
    medical_history: 'صعوبات التعلم، اضطراب فرط الحركة',
    allergies: 'لا توجد حساسية معروفة'
  }
];

const sampleDoctors = [
  {
    id: 'doctor_1',
    user_id: 'user_2',
    first_name: 'نورة',
    last_name: 'أحمد الزيدي',
    specialization: 'علاج طبيعي',
    license_number: 'LIC-001',
    phone: '+966501234568',
    email: 'dr.nora@alhemam.sa',
    consultation_fee: 500,
    is_active: true,
    experience_years: 8,
    languages: ['العربية', 'الإنجليزية'],
    qualifications: ['دكتوراه في العلاج الطبيعي', 'ماجستير في تقويم السلوك'],
    bio: 'أخصائية علاج طبيعي متخصصة في تقويم السلوك للأطفال ذوي الاحتياجات الخاصة',
    rating: 4.8,
    total_reviews: 45
  },
  {
    id: 'doctor_2',
    user_id: 'user_3',
    first_name: 'هند',
    last_name: 'محمد المطيري',
    specialization: 'طب نفس الأطفال',
    license_number: 'LIC-002',
    phone: '+966501234569',
    email: 'dr.hind@alhemam.sa',
    consultation_fee: 600,
    is_active: true,
    experience_years: 10,
    languages: ['العربية', 'الإنجليزية'],
    qualifications: ['دكتوراه في الطب النفسي', 'ماجستير في طب نفس الأطفال'],
    bio: 'طبيبة نفسية متخصصة في علاج الأطفال ذوي الاحتياجات الخاصة',
    rating: 4.9,
    total_reviews: 52
  },
  {
    id: 'doctor_3',
    user_id: 'user_4',
    first_name: 'يوسف',
    last_name: 'أحمد القحطاني',
    specialization: 'علاج النطق',
    license_number: 'LIC-003',
    phone: '+966501234570',
    email: 'dr.youssef@alhemam.sa',
    consultation_fee: 450,
    is_active: true,
    experience_years: 6,
    languages: ['العربية', 'الإنجليزية'],
    qualifications: ['ماجستير في علاج النطق', 'دبلوم في تأهيل النطق'],
    bio: 'أخصائي نطق متخصص في تأهيل النطق للأطفال',
    rating: 4.7,
    total_reviews: 38
  }
];

const sampleAppointments = [
  {
    id: 'appointment_1',
    patient_id: 'patient_1',
    doctor_id: 'doctor_1',
    appointment_date: '2024-01-20',
    appointment_time: '10:00',
    duration_minutes: 60,
    type: 'consultation',
    status: 'scheduled',
    notes: 'جلسة تقييم أولية',
    confirmation_code: 'APT001'
  },
  {
    id: 'appointment_2',
    patient_id: 'patient_2',
    doctor_id: 'doctor_2',
    appointment_date: '2024-01-21',
    appointment_time: '14:00',
    duration_minutes: 45,
    type: 'therapy',
    status: 'scheduled',
    notes: 'جلسة علاج نفسي',
    confirmation_code: 'APT002'
  },
  {
    id: 'appointment_3',
    patient_id: 'patient_3',
    doctor_id: 'doctor_3',
    appointment_date: '2024-01-22',
    appointment_time: '09:30',
    duration_minutes: 30,
    type: 'speech_therapy',
    status: 'completed',
    notes: 'جلسة علاج نطق',
    confirmation_code: 'APT003'
  }
];

const sampleSessions = [
  {
    id: 'session_1',
    patient_id: 'patient_1',
    doctor_id: 'doctor_1',
    session_date: '2024-01-15',
    session_time: '10:00',
    duration_minutes: 60,
    type: 'physical_therapy',
    status: 'completed',
    notes: 'جلسة علاج طبيعي ناجحة',
    goals_achieved: ['تحسين التوازن', 'تقوية العضلات'],
    next_session_goals: ['زيادة مدة التمرين', 'تحسين التنسيق']
  },
  {
    id: 'session_2',
    patient_id: 'patient_2',
    doctor_id: 'doctor_2',
    session_date: '2024-01-16',
    session_time: '14:00',
    duration_minutes: 45,
    type: 'psychological_therapy',
    status: 'completed',
    notes: 'جلسة علاج نفسي إيجابية',
    goals_achieved: ['تحسين التواصل', 'تقليل القلق'],
    next_session_goals: ['تعزيز الثقة بالنفس', 'تحسين التفاعل الاجتماعي']
  }
];

const sampleClaims = [
  {
    id: 'claim_1',
    patient_id: 'patient_1',
    appointment_id: 'appointment_1',
    claim_number: 'CLM001',
    amount: 500,
    status: 'approved',
    submitted_date: '2024-01-15',
    processed_date: '2024-01-18',
    notes: 'مطالبة تأمين معتمدة'
  },
  {
    id: 'claim_2',
    patient_id: 'patient_2',
    appointment_id: 'appointment_2',
    claim_number: 'CLM002',
    amount: 750,
    status: 'pending',
    submitted_date: '2024-01-16',
    notes: 'مطالبة تأمين قيد المراجعة'
  }
];

const samplePayments = [
  {
    id: 'payment_1',
    appointment_id: 'appointment_1',
    amount: 500,
    currency: 'SAR',
    payment_method: 'cash',
    status: 'completed',
    payment_date: '2024-01-15',
    transaction_id: 'TXN001',
    notes: 'دفع نقدي'
  },
  {
    id: 'payment_2',
    appointment_id: 'appointment_2',
    amount: 750,
    currency: 'SAR',
    payment_method: 'bank_transfer',
    status: 'completed',
    payment_date: '2024-01-16',
    transaction_id: 'TXN002',
    notes: 'تحويل بنكي'
  }
];

const sampleAuditLogs = [
  {
    id: 'audit_1',
    user_id: 'user_1',
    action: 'create',
    resource_type: 'appointment',
    resource_id: 'appointment_1',
    description: 'تم إنشاء موعد جديد للمريض سارة أحمد العتيبي',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0...'
  },
  {
    id: 'audit_2',
    user_id: 'user_2',
    action: 'update',
    resource_type: 'patient',
    resource_id: 'patient_1',
    description: 'تم تحديث بيانات المريض سارة أحمد العتيبي',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0...'
  },
  {
    id: 'audit_3',
    user_id: 'user_3',
    action: 'create',
    resource_type: 'session',
    resource_id: 'session_1',
    description: 'تم إنشاء جلسة علاج جديدة',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0...'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 بدء ملء قاعدة البيانات بالبيانات التجريبية...');

    // Insert users
    console.log('👥 إدراج المستخدمين...');
    const { error: usersError } = await supabase
      .from('users')
      .upsert(sampleUsers, { onConflict: 'id' });
    
    if (usersError) throw usersError;

    // Insert patients
    console.log('🏥 إدراج المرضى...');
    const { error: patientsError } = await supabase
      .from('patients')
      .upsert(samplePatients, { onConflict: 'id' });
    
    if (patientsError) throw patientsError;

    // Insert doctors
    console.log('👨‍⚕️ إدراج الأطباء...');
    const { error: doctorsError } = await supabase
      .from('doctors')
      .upsert(sampleDoctors, { onConflict: 'id' });
    
    if (doctorsError) throw doctorsError;

    // Insert appointments
    console.log('📅 إدراج المواعيد...');
    const { error: appointmentsError } = await supabase
      .from('appointments')
      .upsert(sampleAppointments, { onConflict: 'id' });
    
    if (appointmentsError) throw appointmentsError;

    // Insert sessions
    console.log('🎯 إدراج الجلسات...');
    const { error: sessionsError } = await supabase
      .from('sessions')
      .upsert(sampleSessions, { onConflict: 'id' });
    
    if (sessionsError) throw sessionsError;

    // Insert claims
    console.log('💰 إدراج مطالبات التأمين...');
    const { error: claimsError } = await supabase
      .from('insurance_claims')
      .upsert(sampleClaims, { onConflict: 'id' });
    
    if (claimsError) throw claimsError;

    // Insert payments
    console.log('💳 إدراج المدفوعات...');
    const { error: paymentsError } = await supabase
      .from('payments')
      .upsert(samplePayments, { onConflict: 'id' });
    
    if (paymentsError) throw paymentsError;

    // Insert audit logs
    console.log('📝 إدراج سجلات التدقيق...');
    const { error: auditError } = await supabase
      .from('audit_logs')
      .upsert(sampleAuditLogs, { onConflict: 'id' });
    
    if (auditError) throw auditError;

    console.log('✅ تم ملء قاعدة البيانات بنجاح!');
    console.log(`👥 ${sampleUsers.length} مستخدم`);
    console.log(`🏥 ${samplePatients.length} مريض`);
    console.log(`👨‍⚕️ ${sampleDoctors.length} طبيب`);
    console.log(`📅 ${sampleAppointments.length} موعد`);
    console.log(`🎯 ${sampleSessions.length} جلسة`);
    console.log(`💰 ${sampleClaims.length} مطالبة تأمين`);
    console.log(`💳 ${samplePayments.length} دفعة`);
    console.log(`📝 ${sampleAuditLogs.length} سجل تدقيق`);

  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 تم الانتهاء من ملء قاعدة البيانات!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 فشل في ملء قاعدة البيانات:', error);
      process.exit(1);
    });
}

export { seedDatabase };