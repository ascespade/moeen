import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// بيانات المرضى الأساسية
const samplePatients = [
  {
    first_name: 'سارة',
    last_name: 'أحمد العتيبي',
    email: 'sara.ahmed@example.com',
    phone: '+966501234572',
    date_of_birth: '2015-03-15',
    gender: 'female',
    public_id: 'PAT_001',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS001',
    emergency_contact_name: 'أحمد العتيبي',
    emergency_contact_phone: '+966501234573',
    address: 'جدة، حي الصفا',
    medical_history: 'التوحد، تأخر النطق',
    allergies: 'لا توجد حساسية معروفة',
    medications: ['فيتامين د', 'أوميغا 3']
  },
  {
    first_name: 'محمد',
    last_name: 'عبدالله القحطاني',
    email: 'mohammed.abdullah@example.com',
    phone: '+966501234574',
    date_of_birth: '2018-07-22',
    gender: 'male',
    public_id: 'PAT_002',
    insurance_provider: 'تأمين تكافل',
    insurance_number: 'INS002',
    emergency_contact_name: 'عبدالله القحطاني',
    emergency_contact_phone: '+966501234575',
    address: 'جدة، حي الروضة',
    medical_history: 'متلازمة داون، تأخر في المهارات الحركية',
    allergies: 'حساسية من المكسرات',
    medications: ['فيتامين ب12', 'كالسيوم']
  },
  {
    first_name: 'نورا',
    last_name: 'سعد المطيري',
    email: 'nora.saad@example.com',
    phone: '+966501234576',
    date_of_birth: '2016-11-08',
    gender: 'female',
    public_id: 'PAT_003',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS003',
    emergency_contact_name: 'سعد المطيري',
    emergency_contact_phone: '+966501234577',
    address: 'جدة، حي النهضة',
    medical_history: 'صعوبات التعلم، اضطراب فرط الحركة',
    allergies: 'لا توجد حساسية معروفة',
    medications: ['ريتالين', 'فيتامين د']
  }
];

// بيانات الأطباء الأساسية
const sampleDoctors = [
  {
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
    total_reviews: 45,
    public_id: 'DOC_001'
  },
  {
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
    total_reviews: 52,
    public_id: 'DOC_002'
  },
  {
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
    total_reviews: 38,
    public_id: 'DOC_003'
  }
];

// بيانات المواعيد الأساسية
const sampleAppointments = [
  {
    patient_id: null, // سيتم ربطه لاحقاً
    doctor_id: null, // سيتم ربطه لاحقاً
    appointment_date: '2024-01-25',
    appointment_time: '10:00',
    duration_minutes: 60,
    type: 'consultation',
    status: 'scheduled',
    notes: 'جلسة تقييم أولية',
    confirmation_code: 'APT001',
    public_id: 'APT_001'
  },
  {
    patient_id: null,
    doctor_id: null,
    appointment_date: '2024-01-26',
    appointment_time: '14:00',
    duration_minutes: 45,
    type: 'therapy',
    status: 'scheduled',
    notes: 'جلسة علاج نفسي',
    confirmation_code: 'APT002',
    public_id: 'APT_002'
  },
  {
    patient_id: null,
    doctor_id: null,
    appointment_date: '2024-01-27',
    appointment_time: '09:30',
    duration_minutes: 30,
    type: 'speech_therapy',
    status: 'completed',
    notes: 'جلسة علاج نطق',
    confirmation_code: 'APT003',
    public_id: 'APT_003'
  }
];

// بيانات الجلسات الأساسية
const sampleSessions = [
  {
    patient_id: null,
    doctor_id: null,
    appointment_id: null,
    session_date: '2024-01-20',
    session_time: '10:00',
    duration_minutes: 60,
    type: 'physical_therapy',
    status: 'completed',
    notes: 'جلسة علاج طبيعي ناجحة',
    goals_achieved: ['تحسين التوازن', 'تقوية العضلات'],
    next_session_goals: ['زيادة مدة التمرين', 'تحسين التنسيق'],
    public_id: 'SES_001'
  },
  {
    patient_id: null,
    doctor_id: null,
    appointment_id: null,
    session_date: '2024-01-21',
    session_time: '14:00',
    duration_minutes: 45,
    type: 'psychological_therapy',
    status: 'completed',
    notes: 'جلسة علاج نفسي إيجابية',
    goals_achieved: ['تحسين التواصل', 'تقليل القلق'],
    next_session_goals: ['تعزيز الثقة بالنفس', 'تحسين التفاعل الاجتماعي'],
    public_id: 'SES_002'
  }
];

// بيانات المطالبات التأمينية الأساسية
const sampleClaims = [
  {
    patient_id: null,
    appointment_id: null,
    claim_number: 'CLM001',
    insurance_provider: 'التأمين التعاوني',
    claim_amount: 500,
    approved_amount: 400,
    status: 'approved',
    submitted_date: '2024-01-25',
    processed_date: '2024-01-28',
    notes: 'مطالبة جلسة علاج طبيعي',
    public_id: 'CLM_001'
  },
  {
    patient_id: null,
    appointment_id: null,
    claim_number: 'CLM002',
    insurance_provider: 'تأمين تكافل',
    claim_amount: 600,
    approved_amount: 0,
    status: 'rejected',
    submitted_date: '2024-01-26',
    processed_date: '2024-01-29',
    notes: 'مطالبة جلسة علاج نفسي',
    rejection_reason: 'عدم تغطية الخدمة',
    public_id: 'CLM_002'
  }
];

// بيانات المدفوعات الأساسية
const samplePayments = [
  {
    patient_id: null,
    appointment_id: null,
    amount: 100,
    status: 'paid',
    payment_method: 'cash',
    transaction_id: 'TRN001',
    notes: 'دفعة لجلسة علاج طبيعي',
    public_id: 'PAY_001'
  },
  {
    patient_id: null,
    appointment_id: null,
    amount: 450,
    status: 'paid',
    payment_method: 'card',
    transaction_id: 'TRN002',
    notes: 'دفعة لجلسة علاج نطق',
    public_id: 'PAY_002'
  }
];

async function seedDatabase() {
  console.log('🌱 بدء ملء قاعدة البيانات بالبيانات الأساسية...');

  try {
    // إدراج المرضى
    console.log('👨‍👩‍👧‍👦 إدراج المرضى...');
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .insert(samplePatients)
      .select('id, public_id');
    
    if (patientsError) throw patientsError;
    console.log(`✅ تم إدراج ${patients.length} مرضى.`);

    // إدراج الأطباء
    console.log('👩‍⚕️ إدراج الأطباء...');
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .insert(sampleDoctors)
      .select('id, public_id');
    
    if (doctorsError) throw doctorsError;
    console.log(`✅ تم إدراج ${doctors.length} أطباء.`);

    // ربط المواعيد بالمرضى والأطباء
    console.log('📅 إدراج المواعيد...');
    const appointmentsWithIds = sampleAppointments.map((apt, index) => ({
      ...apt,
      patient_id: patients[index % patients.length].id,
      doctor_id: doctors[index % doctors.length].id
    }));

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .insert(appointmentsWithIds)
      .select('id, public_id');
    
    if (appointmentsError) throw appointmentsError;
    console.log(`✅ تم إدراج ${appointments.length} مواعيد.`);

    // ربط الجلسات بالمرضى والأطباء والمواعيد
    console.log('📝 إدراج الجلسات...');
    const sessionsWithIds = sampleSessions.map((ses, index) => ({
      ...ses,
      patient_id: patients[index % patients.length].id,
      doctor_id: doctors[index % doctors.length].id,
      appointment_id: appointments[index % appointments.length].id
    }));

    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .insert(sessionsWithIds)
      .select('id, public_id');
    
    if (sessionsError) throw sessionsError;
    console.log(`✅ تم إدراج ${sessions.length} جلسات.`);

    // ربط المطالبات بالمرضى والمواعيد
    console.log('📄 إدراج المطالبات التأمينية...');
    const claimsWithIds = sampleClaims.map((claim, index) => ({
      ...claim,
      patient_id: patients[index % patients.length].id,
      appointment_id: appointments[index % appointments.length].id
    }));

    const { data: claims, error: claimsError } = await supabase
      .from('insurance_claims')
      .insert(claimsWithIds)
      .select('id, public_id');
    
    if (claimsError) throw claimsError;
    console.log(`✅ تم إدراج ${claims.length} مطالبات.`);

    // ربط المدفوعات بالمرضى والمواعيد
    console.log('💰 إدراج المدفوعات...');
    const paymentsWithIds = samplePayments.map((payment, index) => ({
      ...payment,
      patient_id: patients[index % patients.length].id,
      appointment_id: appointments[index % appointments.length].id
    }));

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .insert(paymentsWithIds)
      .select('id, public_id');
    
    if (paymentsError) throw paymentsError;
    console.log(`✅ تم إدراج ${payments.length} مدفوعات.`);

    console.log('🎉 اكتمل ملء قاعدة البيانات بنجاح!');
    console.log('📊 إحصائيات البيانات:');
    console.log(`   👨‍👩‍👧‍👦 المرضى: ${patients.length}`);
    console.log(`   👩‍⚕️ الأطباء: ${doctors.length}`);
    console.log(`   📅 المواعيد: ${appointments.length}`);
    console.log(`   📝 الجلسات: ${sessions.length}`);
    console.log(`   📄 المطالبات: ${claims.length}`);
    console.log(`   💰 المدفوعات: ${payments.length}`);

  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    throw error;
  }
}

seedDatabase();