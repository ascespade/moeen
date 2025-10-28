import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// بيانات المستخدمين الأساسية
const sampleUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@alhemam.sa',
    name: 'أحمد محمد العتيبي',
    role: 'admin',
    phone: '+966501234567',
    is_active: true,
    preferences: {
      position: 'مدير المركز',
      department: 'الإدارة',
      hire_date: '2020-01-15',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
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
      hire_date: '2021-03-10',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
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
      hire_date: '2021-06-20',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
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
      hire_date: '2021-09-15',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'reception@alhemam.sa',
    name: 'فاطمة علي السعيد',
    role: 'agent',
    phone: '+966501234571',
    is_active: true,
    preferences: {
      position: 'موظفة استقبال',
      department: 'الاستقبال',
      hire_date: '2022-01-10',
    },
  },
];

// بيانات المرضى
const samplePatients = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    first_name: 'سارة',
    last_name: 'أحمد العتيبي',
    email: 'sara.ahmed@example.com',
    phone: '+966501234572',
    date_of_birth: '2015-03-15',
    gender: 'female',
    public_id: 'PAT_20240120_0001',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS001',
    emergency_contact_name: 'أحمد العتيبي',
    emergency_contact_phone: '+966501234573',
    address: 'جدة، حي الصفا',
    medical_history: 'التوحد، تأخر النطق',
    allergies: ['لا توجد حساسية معروفة'],
    medications: ['فيتامين د', 'أوميغا 3'],
    // chronic_conditions: ['التوحد', 'تأخر النطق'], // غير موجود في الجدول
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    first_name: 'محمد',
    last_name: 'عبدالله القحطاني',
    email: 'mohammed.abdullah@example.com',
    phone: '+966501234574',
    date_of_birth: '2018-07-22',
    gender: 'male',
    public_id: 'PAT_20240120_0002',
    insurance_provider: 'تأمين تكافل',
    insurance_number: 'INS002',
    emergency_contact_name: 'عبدالله القحطاني',
    emergency_contact_phone: '+966501234575',
    address: 'جدة، حي الروضة',
    medical_history: 'متلازمة داون، تأخر في المهارات الحركية',
    allergies: ['حساسية من المكسرات'],
    medications: ['فيتامين ب12', 'كالسيوم'],
    // chronic_conditions: ['متلازمة داون', 'تأخر المهارات الحركية'], // غير موجود في الجدول
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    first_name: 'نورا',
    last_name: 'سعد المطيري',
    email: 'nora.saad@example.com',
    phone: '+966501234576',
    date_of_birth: '2016-11-08',
    gender: 'female',
    public_id: 'PAT_20240120_0003',
    insurance_provider: 'التأمين التعاوني',
    insurance_number: 'INS003',
    emergency_contact_name: 'سعد المطيري',
    emergency_contact_phone: '+966501234577',
    address: 'جدة، حي النهضة',
    medical_history: 'صعوبات التعلم، اضطراب فرط الحركة',
    allergies: ['لا توجد حساسية معروفة'],
    medications: ['ريتالين', 'فيتامين د'],
    // chronic_conditions: ['صعوبات التعلم', 'اضطراب فرط الحركة'], // غير موجود في الجدول
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات الأطباء
const sampleDoctors = [
  {
    id: '550e8400-e29b-41d4-a716-446655440201',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
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
    public_id: 'DOC_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440202',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
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
    public_id: 'DOC_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440203',
    user_id: '550e8400-e29b-41d4-a716-446655440004',
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
    public_id: 'DOC_20240120_0003',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات المواعيد
const sampleAppointments = [
  {
    id: '550e8400-e29b-41d4-a716-446655440301',
    patient_id: '550e8400-e29b-41d4-a716-446655440101',
    doctor_id: '550e8400-e29b-41d4-a716-446655440201',
    appointment_date: '2024-01-25',
    appointment_time: '10:00',
    duration_minutes: 60,
    type: 'consultation',
    status: 'scheduled',
    notes: 'جلسة تقييم أولية',
    confirmation_code: 'APT001',
    public_id: 'APT_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440302',
    patient_id: '550e8400-e29b-41d4-a716-446655440102',
    doctor_id: '550e8400-e29b-41d4-a716-446655440202',
    appointment_date: '2024-01-26',
    appointment_time: '14:00',
    duration_minutes: 45,
    type: 'therapy',
    status: 'scheduled',
    notes: 'جلسة علاج نفسي',
    confirmation_code: 'APT002',
    public_id: 'APT_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440303',
    patient_id: '550e8400-e29b-41d4-a716-446655440103',
    doctor_id: '550e8400-e29b-41d4-a716-446655440203',
    appointment_date: '2024-01-27',
    appointment_time: '09:30',
    duration_minutes: 30,
    type: 'speech_therapy',
    status: 'completed',
    notes: 'جلسة علاج نطق',
    confirmation_code: 'APT003',
    public_id: 'APT_20240120_0003',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات الجلسات
const sampleSessions = [
  {
    id: '550e8400-e29b-41d4-a716-446655440401',
    patient_id: '550e8400-e29b-41d4-a716-446655440101',
    doctor_id: '550e8400-e29b-41d4-a716-446655440201',
    appointment_id: '550e8400-e29b-41d4-a716-446655440301',
    session_date: '2024-01-20',
    session_time: '10:00',
    duration_minutes: 60,
    type: 'physical_therapy',
    status: 'completed',
    notes: 'جلسة علاج طبيعي ناجحة',
    goals_achieved: ['تحسين التوازن', 'تقوية العضلات'],
    next_session_goals: ['زيادة مدة التمرين', 'تحسين التنسيق'],
    public_id: 'SES_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440402',
    patient_id: '550e8400-e29b-41d4-a716-446655440102',
    doctor_id: '550e8400-e29b-41d4-a716-446655440202',
    appointment_id: '550e8400-e29b-41d4-a716-446655440302',
    session_date: '2024-01-21',
    session_time: '14:00',
    duration_minutes: 45,
    type: 'psychological_therapy',
    status: 'completed',
    notes: 'جلسة علاج نفسي إيجابية',
    goals_achieved: ['تحسين التواصل', 'تقليل القلق'],
    next_session_goals: ['تعزيز الثقة بالنفس', 'تحسين التفاعل الاجتماعي'],
    public_id: 'SES_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات المطالبات التأمينية
const sampleClaims = [
  {
    id: '550e8400-e29b-41d4-a716-446655440501',
    patient_id: '550e8400-e29b-41d4-a716-446655440101',
    appointment_id: '550e8400-e29b-41d4-a716-446655440301',
    claim_number: 'CLM001',
    insurance_provider: 'التأمين التعاوني',
    claim_amount: 500,
    approved_amount: 400,
    status: 'approved',
    submitted_date: '2024-01-25',
    processed_date: '2024-01-28',
    notes: 'مطالبة جلسة علاج طبيعي',
    rejection_reason: null,
    public_id: 'CLM_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440502',
    patient_id: '550e8400-e29b-41d4-a716-446655440102',
    appointment_id: '550e8400-e29b-41d4-a716-446655440302',
    claim_number: 'CLM002',
    insurance_provider: 'تأمين تكافل',
    claim_amount: 600,
    approved_amount: 0,
    status: 'rejected',
    submitted_date: '2024-01-26',
    processed_date: '2024-01-29',
    notes: 'مطالبة جلسة علاج نفسي',
    rejection_reason: 'عدم تغطية الخدمة',
    public_id: 'CLM_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات المدفوعات
const samplePayments = [
  {
    id: '550e8400-e29b-41d4-a716-446655440601',
    patient_id: '550e8400-e29b-41d4-a716-446655440101',
    appointment_id: '550e8400-e29b-41d4-a716-446655440301',
    amount: 100,
    status: 'paid',
    payment_method: 'cash',
    transaction_id: 'TRN001',
    notes: 'دفعة لجلسة علاج طبيعي',
    public_id: 'PAY_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440602',
    patient_id: '550e8400-e29b-41d4-a716-446655440103',
    appointment_id: '550e8400-e29b-41d4-a716-446655440303',
    amount: 450,
    status: 'paid',
    payment_method: 'card',
    transaction_id: 'TRN002',
    notes: 'دفعة لجلسة علاج نطق',
    public_id: 'PAY_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات الموظفين
const sampleStaff = [
  {
    id: '550e8400-e29b-41d4-a716-446655440701',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    first_name: 'أحمد',
    last_name: 'محمد العتيبي',
    position: 'مدير المركز',
    department: 'الإدارة',
    employee_id: 'EMP001',
    hire_date: '2020-01-15',
    salary: 15000,
    work_hours_per_week: 40,
    public_id: 'STF_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440702',
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    first_name: 'فاطمة',
    last_name: 'علي السعيد',
    position: 'موظفة استقبال',
    department: 'الاستقبال',
    employee_id: 'EMP002',
    hire_date: '2022-01-10',
    salary: 8000,
    work_hours_per_week: 40,
    public_id: 'STF_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

// بيانات سجلات التدقيق
const sampleAuditLogs = [
  {
    id: '550e8400-e29b-41d4-a716-446655440801',
    action: 'create',
    resource_type: 'patient',
    resource_id: '550e8400-e29b-41d4-a716-446655440101',
    old_values: null,
    new_values: { first_name: 'سارة', last_name: 'أحمد العتيبي' },
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    status: 'success',
    metadata: { notes: 'تم إنشاء مريض جديد' },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440802',
    action: 'update',
    resource_type: 'appointment',
    resource_id: '550e8400-e29b-41d4-a716-446655440301',
    old_values: { status: 'scheduled' },
    new_values: { status: 'confirmed' },
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    status: 'success',
    metadata: { notes: 'تم تأكيد الموعد' },
  },
];

// بيانات إعدادات النظام
const sampleSystemSettings = [
  {
    id: '550e8400-e29b-41d4-a716-446655440901',
    setting_key: 'clinic_name',
    setting_value: 'مركز الهمم للرعاية الصحية',
    setting_type: 'string',
    category: 'general',
    description: 'اسم المركز',
    public_id: 'SET_20240120_0001',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440902',
    setting_key: 'clinic_phone',
    setting_value: '+966126173693',
    setting_type: 'string',
    category: 'contact',
    description: 'رقم هاتف المركز',
    public_id: 'SET_20240120_0002',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440903',
    setting_key: 'clinic_email',
    setting_value: 'info@alhemam.sa',
    setting_type: 'string',
    category: 'contact',
    description: 'بريد المركز الإلكتروني',
    public_id: 'SET_20240120_0003',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440904',
    setting_key: 'working_hours',
    setting_value: '{"start": "08:00", "end": "17:00", "days": [1,2,3,4,5]}',
    setting_type: 'json',
    category: 'schedule',
    description: 'ساعات العمل',
    public_id: 'SET_20240120_0004',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    updated_by: '550e8400-e29b-41d4-a716-446655440001',
  },
];

async function seedDatabase() {
  console.log('🌱 بدء ملء قاعدة البيانات بالبيانات التجريبية الاحترافية...');

  try {
    // إدراج المستخدمين
    console.log('👥 إدراج المستخدمين...');
    const { error: usersError } = await supabase
      .from('users')
      .upsert(sampleUsers, { onConflict: 'id' });
    if (usersError) throw usersError;
    console.log(`✅ تم إدراج ${sampleUsers.length} مستخدمين.`);

    // إدراج المرضى
    console.log('👨‍👩‍👧‍👦 إدراج المرضى...');
    const { error: patientsError } = await supabase
      .from('patients')
      .upsert(samplePatients, { onConflict: 'id' });
    if (patientsError) throw patientsError;
    console.log(`✅ تم إدراج ${samplePatients.length} مرضى.`);

    // إدراج الأطباء
    console.log('👩‍⚕️ إدراج الأطباء...');
    const { error: doctorsError } = await supabase
      .from('doctors')
      .upsert(sampleDoctors, { onConflict: 'id' });
    if (doctorsError) throw doctorsError;
    console.log(`✅ تم إدراج ${sampleDoctors.length} أطباء.`);

    // إدراج المواعيد
    console.log('📅 إدراج المواعيد...');
    const { error: appointmentsError } = await supabase
      .from('appointments')
      .upsert(sampleAppointments, { onConflict: 'id' });
    if (appointmentsError) throw appointmentsError;
    console.log(`✅ تم إدراج ${sampleAppointments.length} مواعيد.`);

    // إدراج الجلسات
    console.log('📝 إدراج الجلسات...');
    const { error: sessionsError } = await supabase
      .from('sessions')
      .upsert(sampleSessions, { onConflict: 'id' });
    if (sessionsError) throw sessionsError;
    console.log(`✅ تم إدراج ${sampleSessions.length} جلسات.`);

    // إدراج المطالبات التأمينية
    console.log('📄 إدراج المطالبات التأمينية...');
    const { error: claimsError } = await supabase
      .from('insurance_claims')
      .upsert(sampleClaims, { onConflict: 'id' });
    if (claimsError) throw claimsError;
    console.log(`✅ تم إدراج ${sampleClaims.length} مطالبات.`);

    // إدراج المدفوعات
    console.log('💰 إدراج المدفوعات...');
    const { error: paymentsError } = await supabase
      .from('payments')
      .upsert(samplePayments, { onConflict: 'id' });
    if (paymentsError) throw paymentsError;
    console.log(`✅ تم إدراج ${samplePayments.length} مدفوعات.`);

    // إدراج الموظفين
    console.log('👨‍💼 إدراج الموظفين...');
    const { error: staffError } = await supabase
      .from('staff')
      .upsert(sampleStaff, { onConflict: 'id' });
    if (staffError) throw staffError;
    console.log(`✅ تم إدراج ${sampleStaff.length} موظفين.`);

    // إدراج سجلات التدقيق
    console.log('📊 إدراج سجلات التدقيق...');
    const { error: auditLogsError } = await supabase
      .from('audit_logs')
      .upsert(sampleAuditLogs, { onConflict: 'id' });
    if (auditLogsError) throw auditLogsError;
    console.log(`✅ تم إدراج ${sampleAuditLogs.length} سجل تدقيق.`);

    // إدراج إعدادات النظام
    console.log('⚙️ إدراج إعدادات النظام...');
    const { error: settingsError } = await supabase
      .from('system_settings')
      .upsert(sampleSystemSettings, { onConflict: 'id' });
    if (settingsError) throw settingsError;
    console.log(`✅ تم إدراج ${sampleSystemSettings.length} إعداد.`);

    console.log('🎉 اكتمل ملء قاعدة البيانات بنجاح!');
    console.log('📊 إحصائيات البيانات:');
    console.log(`   👥 المستخدمين: ${sampleUsers.length}`);
    console.log(`   👨‍👩‍👧‍👦 المرضى: ${samplePatients.length}`);
    console.log(`   👩‍⚕️ الأطباء: ${sampleDoctors.length}`);
    console.log(`   📅 المواعيد: ${sampleAppointments.length}`);
    console.log(`   📝 الجلسات: ${sampleSessions.length}`);
    console.log(`   📄 المطالبات: ${sampleClaims.length}`);
    console.log(`   💰 المدفوعات: ${samplePayments.length}`);
    console.log(`   👨‍💼 الموظفين: ${sampleStaff.length}`);
    console.log(`   📊 سجلات التدقيق: ${sampleAuditLogs.length}`);
    console.log(`   ⚙️ الإعدادات: ${sampleSystemSettings.length}`);
  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    throw error;
  }
}

seedDatabase();
