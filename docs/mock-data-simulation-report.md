# تقرير Mock Data و Simulation Data

**تاريخ التقرير:** 2024-01-15
**حالة المشروع:** يحتاج تنظيف

---

## 📊 ملخص تنفيذي

### إحصائيات عامة
- **إجمالي الملفات التي تحتوي على Mock Data:** 5 ملفات
- **إجمالي الملفات التي تحتوي على Simulation Data:** 3 ملفات
- **Mock Data معطل (معلق):** 2 ملف
- **Mock Data نشط (يستخدم):** 3 ملفات
- **Simulation Data نشط:** 3 ملفات

### التقييم العام
- ❌ **فشل** - يوجد Mock Data نشط في الكود
- ⚠️ **تحذير** - يوجد Simulation Data في APIs
- ✅ **مقبول** - معظم Mock Data معلق (commented out)

---

## 🔴 Mock Data النشط (يحتاج إزالة)

### 1. `src/app/(admin)/messages/page.tsx`
**السطر:** 152-304
**الحالة:** ⚠️ **نشط - يستخدم حالياً**

```152:304:src/app/(admin)/messages/page.tsx
  // Mock data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        subject: 'تأكيد موعد طبي',
        // ... 5 رسائل mock
      },
    ];
    setMessages(mockMessages);
    setTotalPages(Math.ceil(mockMessages.length / 10));
    setLoading(false);
  }, []);
```

**المشكلة:**
- ❌ يستخدم Mock Data مباشرة في `useEffect`
- ❌ لا يوجد استدعاء API حقيقي
- ❌ البيانات ثابتة وليست ديناميكية

**الحل المطلوب:**
- استبدال Mock Data باستدعاء API من Supabase
- استخدام `lib/supabase/queries/` لجلب الرسائل الحقيقية

---

### 2. `src/app/(admin)/notifications/page.tsx`
**السطر:** 141-280
**الحالة:** ⚠️ **نشط - يستخدم حالياً**

```141:280:src/app/(admin)/notifications/page.tsx
  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'تذكير بموعد طبي',
        // ... 5 إشعارات mock
      },
    ];
    setNotifications(mockNotifications);
    setTotalPages(Math.ceil(mockNotifications.length / 10));
    setLoading(false);
  }, []);
```

**المشكلة:**
- ❌ يستخدم Mock Data مباشرة
- ❌ لا يوجد استدعاء API حقيقي
- ❌ البيانات ثابتة

**الحل المطلوب:**
- استبدال Mock Data باستدعاء API من Supabase
- استخدام `lib/supabase/queries/` لجلب الإشعارات الحقيقية

---

### 3. `src/app/(health)/approvals/page.tsx`
**السطر:** 55-156
**الحالة:** ⚠️ **نشط - يستخدم حالياً**

```55:156:src/app/(health)/approvals/page.tsx
// Legacy mock data - replaced with database query
const mockApprovals: Approval[] = [
  {
    id: '1',
    patientName: 'أحمد محمد العتيبي',
    // ... 5 موافقات mock
  },
];
```

**المشكلة:**
- ❌ Mock Data معرف كـ `const` في أعلى الملف
- ❌ التعليق يقول "replaced with database query" لكن الكود لا يزال يستخدم Mock Data
- ❌ لا يوجد استدعاء API حقيقي

**الحل المطلوب:**
- إزالة `mockApprovals` تماماً
- استبدالها باستدعاء API من Supabase
- استخدام `lib/supabase/queries/` لجلب الموافقات الحقيقية

---

### 4. `src/app/(admin)/chatbot/analytics/page.tsx`
**السطر:** 32-81
**الحالة:** ⚠️ **نشط - يستخدم حالياً**

```32:81:src/app/(admin)/chatbot/analytics/page.tsx
const mockAnalytics: AnalyticsData = {
  totalMessages: 15420,
  totalUsers: 3247,
  avgResponseTime: 2.3,
  satisfactionRate: 4.2,
  topFlows: [
    { name: 'استقبال المرضى', usage: 1247, satisfaction: 4.5 },
    // ... بيانات mock
  ],
  // ... المزيد من البيانات
};
```

**المشكلة:**
- ❌ Mock Data معرف كـ `const` في أعلى الملف
- ❌ يستخدم مباشرة في الكومبوننت
- ❌ لا يوجد استدعاء API حقيقي

**الحل المطلوب:**
- إزالة `mockAnalytics` تماماً
- استبدالها باستدعاء API من Supabase
- استخدام `lib/supabase/queries/` لجلب إحصائيات الشات بوت الحقيقية

---

## 🟡 Mock Data المعطل (معلق - يمكن حذفه)

### 1. `src/app/(admin)/crm/page.tsx`
**السطر:** 199-352
**الحالة:** ✅ **معطل - معلق (commented out)**

```199:352:src/app/(admin)/crm/page.tsx
    // Legacy mock data removed - using real API
    /*const mockLeads: Lead[] = [
      // ... mock data
    ];
    const mockContacts: Contact[] = [
      // ... mock data
    ];
    const mockDeals: Deal[] = [
      // ... mock data
    ];*/
```

**التوصية:**
- ✅ يمكن حذف الكود المعلق بأمان
- ✅ الكود يستخدم API حقيقي الآن

---

### 2. `src/app/(admin)/security/page.tsx`
**السطر:** 157-292
**الحالة:** ✅ **معطل - معلق (commented out)**

```157:292:src/app/(admin)/security/page.tsx
    // Legacy mock data removed - using real API
    /*const mockEvents: SecurityEvent[] = [
      // ... mock data
    ];
    const mockPolicies: SecurityPolicy[] = [
      // ... mock data
    ];
    const mockSessions: UserSession[] = [
      // ... mock data
    ];
    const mockAlerts: SecurityAlert[] = [
      // ... mock data
    ];*/
```

**التوصية:**
- ✅ يمكن حذف الكود المعلق بأمان
- ✅ الكود يستخدم API حقيقي الآن

---

## 🔵 Simulation Data (محاكاة - يحتاج استبدال)

### 1. `src/app/api/insurance/claims/route.ts`
**السطر:** 327-350
**الحالة:** ⚠️ **نشط - يحتاج استبدال**

```327:350:src/app/api/insurance/claims/route.ts
async function submitToInsuranceProvider(claim: unknown, provider: string) {
  try {
    // This would integrate with actual insurance provider APIs
    // For now, we'll simulate the submission

    const providerEndpoints = {
      tawuniya: 'https://api.tawuniya.com/claims',
      bupa: 'https://api.bupa.com/claims',
      // ... endpoints
    };

    // Simulate API call
    const response = await fetch(endpoint, {
      // ... fetch call
    });
```

**المشكلة:**
- ⚠️ يحاول الاتصال بـ APIs حقيقية لكن التعليق يقول "simulate"
- ⚠️ قد لا تعمل الـ endpoints الحقيقية
- ⚠️ يحتاج تكامل حقيقي مع شركات التأمين

**التوصية:**
- ✅ الكود يحاول الاتصال الحقيقي (جيد)
- ⚠️ التأكد من أن الـ endpoints تعمل
- ⚠️ إضافة error handling أفضل
- ⚠️ إزالة التعليقات التي تقول "simulate"

---

### 2. `src/lib/monitoring/worker-pool.ts`
**السطر:** 91, 117, 133
**الحالة:** ⚠️ **نشط - يحتاج مراجعة**

```91:133:src/lib/monitoring/worker-pool.ts
      // Simulate task execution
      // In real implementation, this would run actual checks
      const result = await this.runTask(task, cpu);

    // Simulate different task types
    switch (task.type) {
      case 'code-analysis':
        return await this.runCodeAnalysis(task, cpu);

  private async runCodeAnalysis(task: TaskConfig, _cpu: number): Promise<any> {
    // Simulate code analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
```

**المشكلة:**
- ⚠️ التعليقات تقول "simulate" لكن الكود قد يعمل فعلياً
- ⚠️ يحتاج مراجعة للتأكد من أن المهام تعمل فعلياً

**التوصية:**
- ✅ مراجعة الكود للتأكد من أنه يعمل فعلياً
- ⚠️ إزالة التعليقات التي تقول "simulate" إذا كان الكود يعمل فعلياً

---

### 3. `src/lib/saudi-ministry-health-integration.ts` و `src/lib/saudi-health-integration.ts`
**الحالة:** ⚠️ **نشط - يحتاج مراجعة**

**المشكلة:**
- ⚠️ يستخدم `Math.random()` لإنشاء IDs
- ⚠️ قد يحتاج استبدال بـ IDs حقيقية من APIs

**التوصية:**
- ✅ مراجعة الكود للتأكد من أن الـ IDs تأتي من APIs حقيقية
- ⚠️ إزالة `Math.random()` إذا كان هناك APIs حقيقية

---

## 📋 خطة العمل الموصى بها

### الأولوية العالية (يجب إصلاحها فوراً)

1. **إزالة Mock Data النشط:**
   - [ ] `src/app/(admin)/messages/page.tsx` - استبدال بـ API حقيقي
   - [ ] `src/app/(admin)/notifications/page.tsx` - استبدال بـ API حقيقي
   - [ ] `src/app/(health)/approvals/page.tsx` - استبدال بـ API حقيقي
   - [ ] `src/app/(admin)/chatbot/analytics/page.tsx` - استبدال بـ API حقيقي

### الأولوية المتوسطة (يجب إصلاحها قريباً)

2. **تنظيف Mock Data المعطل:**
   - [ ] حذف الكود المعلق من `src/app/(admin)/crm/page.tsx`
   - [ ] حذف الكود المعلق من `src/app/(admin)/security/page.tsx`

3. **مراجعة Simulation Data:**
   - [ ] مراجعة `src/app/api/insurance/claims/route.ts` والتأكد من أن APIs تعمل
   - [ ] مراجعة `src/lib/monitoring/worker-pool.ts` وإزالة التعليقات الخاطئة
   - [ ] مراجعة integration files وإزالة `Math.random()` إذا لزم الأمر

### الأولوية المنخفضة (تحسينات)

4. **تحسينات عامة:**
   - [ ] إضافة validation للبيانات القادمة من APIs
   - [ ] إضافة error handling أفضل
   - [ ] إضافة loading states
   - [ ] إضافة empty states

---

## 📝 ملاحظات إضافية

### استخدامات `Math.random()` المقبولة

بعض استخدامات `Math.random()` مقبولة لأنها لأغراض تقنية وليست Mock Data:
- ✅ توليد IDs فريدة: `generateId()`, `generateCSRFToken()`
- ✅ توليد أسماء ملفات: `medical-records/upload/route.ts`
- ✅ توليد transaction IDs: `payments/process/route.ts`
- ✅ توليد session IDs: `chatbot/moeen/route.ts`

**هذه الاستخدامات مقبولة** لأنها لأغراض تقنية وليست Mock Data.

---

## 🔍 تقرير بيانات الداشبورد

### ملخص بيانات الداشبورد

**الوضع العام:** ⚠️ **مختلط** - بعض البيانات حقيقية وبعضها محسوبة أو Mock Data

### 1. `src/app/api/dashboard/statistics/route.ts`
**الحالة:** ✅ **100% حقيقي**

```59:181:src/app/api/dashboard/statistics/route.ts
    // Get patients statistics
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    const { count: activePatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('activated', true);

    // ... جميع البيانات من Supabase مباشرة
```

**التقييم:**
- ✅ جميع البيانات من Supabase مباشرة
- ✅ لا يوجد Mock Data
- ✅ لا يوجد حسابات تقريبية

---

### 2. `src/app/api/admin/dashboard/route.ts`
**الحالة:** ⚠️ **مختلط - يحتاج إصلاح**

```58:77:src/app/api/admin/dashboard/route.ts
    const stats = {
      totalPatients: totalPatients || 0,
      activePatients: Math.floor((totalPatients || 0) * 0.8), // 80% active
      blockedPatients: Math.floor((totalPatients || 0) * 0.2), // 20% blocked
      totalAppointments: totalAppointments || 0,
      completedAppointments: Math.floor((totalAppointments || 0) * 0.7), // 70% completed
      pendingAppointments: Math.floor((totalAppointments || 0) * 0.3), // 30% pending
      totalRevenue,
      monthlyRevenue: Math.floor(totalRevenue * 0.1), // 10% of total
      totalClaims: totalClaims || 0,
      approvedClaims: Math.floor((totalClaims || 0) * 0.6), // 60% approved
      pendingClaims: Math.floor((totalClaims || 0) * 0.3), // 30% pending
      rejectedClaims: Math.floor((totalClaims || 0) * 0.1), // 10% rejected
      totalStaff: 15, // Fixed number for now
      activeStaff: 12, // Fixed number for now
      onDutyStaff: 8, // Fixed number for now
      totalSessions: totalSessions || 0,
      completedSessions: Math.floor((totalSessions || 0) * 0.8), // 80% completed
      upcomingSessions: Math.floor((totalSessions || 0) * 0.2), // 20% upcoming
    };
```

**المشاكل:**
- ❌ `activePatients` - يحسب 80% بدلاً من جلب العدد الحقيقي من قاعدة البيانات
- ❌ `blockedPatients` - يحسب 20% بدلاً من جلب العدد الحقيقي
- ❌ `completedAppointments` - يحسب 70% بدلاً من جلب العدد الحقيقي
- ❌ `pendingAppointments` - يحسب 30% بدلاً من جلب العدد الحقيقي
- ❌ `monthlyRevenue` - يحسب 10% من الإجمالي بدلاً من جلب الإيرادات الشهرية الحقيقية
- ❌ `approvedClaims` - يحسب 60% بدلاً من جلب العدد الحقيقي
- ❌ `pendingClaims` - يحسب 30% بدلاً من جلب العدد الحقيقي
- ❌ `rejectedClaims` - يحسب 10% بدلاً من جلب العدد الحقيقي
- ❌ `totalStaff: 15` - **رقم ثابت!** يجب جلب العدد الحقيقي
- ❌ `activeStaff: 12` - **رقم ثابت!** يجب جلب العدد الحقيقي
- ❌ `onDutyStaff: 8` - **رقم ثابت!** يجب جلب العدد الحقيقي
- ❌ `completedSessions` - يحسب 80% بدلاً من جلب العدد الحقيقي
- ❌ `upcomingSessions` - يحسب 20% بدلاً من جلب العدد الحقيقي

**الحل المطلوب:**
- استبدال جميع الحسابات التقريبية باستعلامات حقيقية من Supabase
- استخدام نفس النهج المستخدم في `src/app/api/dashboard/statistics/route.ts`

---

### 3. `src/components/dashboard/Charts.tsx`
**الحالة:** ❌ **Mock Data - يحتاج إزالة**

```5:9:src/components/dashboard/Charts.tsx
const data = Array.from({ length: 7 }).map((_, i) => ({
  day: `D${i + 1}`,
  messages: Math.round(50 + Math.random() * 100),
  conversations: Math.round(5 + Math.random() * 20),
}));
const pie = [
  { name: 'WhatsApp', value: 60, color: '#16a34a' },
```

**المشاكل:**
- ❌ يستخدم `Math.random()` لإنشاء بيانات للرسوم البيانية
- ❌ البيانات ثابتة (pie chart)
- ❌ لا يوجد استدعاء API حقيقي

**الحل المطلوب:**
- إزالة Mock Data
- استبدالها باستدعاء API حقيقي لجلب بيانات الرسوم البيانية
- استخدام `lib/supabase/queries/` لجلب البيانات الحقيقية

---

### 4. `src/app/(admin)/admin-dashboard/page.tsx`
**الحالة:** ✅ **يستخدم API حقيقي**

```132:147:src/app/(admin)/admin-dashboard/page.tsx
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
```

**التقييم:**
- ✅ يستدعي API حقيقي (`/api/dashboard/metrics`)
- ✅ لا يوجد Mock Data في الكومبوننت
- ⚠️ لكن API الذي يستدعيه (`/api/dashboard/metrics`) قد يحتوي على بيانات محسوبة

---

### 5. `src/app/api/dashboard/metrics/route.ts`
**الحالة:** ✅ **يستخدم APIs حقيقية**

```116:133:src/app/api/dashboard/metrics/route.ts
    // Get system metrics from multiple sources with individual error handling
    const [
      systemHealth,
      systemMetrics,
      socialMediaMetrics,
      workflowMetrics,
      chatbotMetrics,
      healthcareMetrics,
      crmMetrics,
    ] = await Promise.allSettled([
      getSystemHealth(),
      getSystemMetrics(),
      getSocialMediaMetrics(),
      getWorkflowMetrics(),
      getChatbotMetrics(),
      getHealthcareMetrics(),
      getCrmMetrics(),
    ]);
```

**التقييم:**
- ✅ يستدعي دوال لجلب البيانات الحقيقية
- ✅ يستخدم `Promise.allSettled` للتعامل مع الأخطاء
- ✅ لديه fallback data عند فشل الاتصال

---

## 📋 خطة العمل المحدثة لبيانات الداشبورد

### الأولوية العالية (يجب إصلاحها فوراً)

1. **إصلاح `src/app/api/admin/dashboard/route.ts`:**
   - [ ] استبدال `activePatients: Math.floor((totalPatients || 0) * 0.8)` باستعلام حقيقي
   - [ ] استبدال `blockedPatients: Math.floor((totalPatients || 0) * 0.2)` باستعلام حقيقي
   - [ ] استبدال `completedAppointments: Math.floor((totalAppointments || 0) * 0.7)` باستعلام حقيقي
   - [ ] استبدال `pendingAppointments: Math.floor((totalAppointments || 0) * 0.3)` باستعلام حقيقي
   - [ ] استبدال `monthlyRevenue: Math.floor(totalRevenue * 0.1)` باستعلام حقيقي
   - [ ] استبدال `approvedClaims: Math.floor((totalClaims || 0) * 0.6)` باستعلام حقيقي
   - [ ] استبدال `pendingClaims: Math.floor((totalClaims || 0) * 0.3)` باستعلام حقيقي
   - [ ] استبدال `rejectedClaims: Math.floor((totalClaims || 0) * 0.1)` باستعلام حقيقي
   - [ ] استبدال `totalStaff: 15` باستعلام حقيقي
   - [ ] استبدال `activeStaff: 12` باستعلام حقيقي
   - [ ] استبدال `onDutyStaff: 8` باستعلام حقيقي
   - [ ] استبدال `completedSessions: Math.floor((totalSessions || 0) * 0.8)` باستعلام حقيقي
   - [ ] استبدال `upcomingSessions: Math.floor((totalSessions || 0) * 0.2)` باستعلام حقيقي

2. **إزالة Mock Data من `src/components/dashboard/Charts.tsx`:**
   - [ ] إزالة `Math.random()` من بيانات الرسوم البيانية
   - [ ] استبدالها باستدعاء API حقيقي
   - [ ] استخدام `lib/supabase/queries/` لجلب البيانات الحقيقية

### الأولوية المتوسطة (يجب إصلاحها قريباً)

3. **مراجعة `src/app/api/dashboard/metrics/route.ts`:**
   - [ ] التأكد من أن جميع الدوال (`getSystemHealth`, `getHealthcareMetrics`, إلخ) تجلب بيانات حقيقية
   - [ ] التأكد من عدم وجود حسابات تقريبية في الدوال

---

## ✅ الخلاصة النهائية لبيانات الداشبورد

### الوضع الحالي
- ✅ **1 ملف** يستخدم بيانات 100% حقيقية (`src/app/api/dashboard/statistics/route.ts`)
- ⚠️ **1 ملف** يستخدم حسابات تقريبية وبيانات ثابتة (`src/app/api/admin/dashboard/route.ts`)
- ❌ **1 ملف** يستخدم Mock Data (`src/components/dashboard/Charts.tsx`)
- ✅ **1 ملف** يستخدم API حقيقي لكن قد يحتوي على بيانات محسوبة (`src/app/(admin)/admin-dashboard/page.tsx`)

### الإجراءات المطلوبة
1. إصلاح `src/app/api/admin/dashboard/route.ts` - استبدال جميع الحسابات التقريبية باستعلامات حقيقية
2. إزالة Mock Data من `src/components/dashboard/Charts.tsx` - استبدالها ببيانات حقيقية
3. مراجعة `src/app/api/dashboard/metrics/route.ts` - التأكد من أن جميع الدوال تجلب بيانات حقيقية

### الامتثال لقواعد المشروع
حسب قواعد المشروع:
- ❌ **NO mock data** - يوجد Mock Data في `Charts.tsx`
- ❌ **100% dynamic from Supabase/APIs** - يوجد حسابات تقريبية وبيانات ثابتة في `admin/dashboard/route.ts`

**بيانات الداشبورد حالياً غير متوافقة مع القواعد** ويحتاج إصلاح فوري.

---

## ✅ الخلاصة

### الوضع الحالي
- ❌ **4 ملفات** تحتوي على Mock Data نشط
- ✅ **2 ملف** يحتوي على Mock Data معطل (يمكن حذفه)
- ⚠️ **3 ملفات** تحتوي على Simulation Data (يحتاج مراجعة)

### الإجراءات المطلوبة
1. إزالة جميع Mock Data النشط واستبداله بـ APIs حقيقية
2. حذف Mock Data المعطل (الكود المعلق)
3. مراجعة Simulation Data والتأكد من أنه يعمل فعلياً

### الامتثال لقواعد المشروع
حسب قواعد المشروع:
- ❌ **NO mock data** - يجب إزالة جميع Mock Data
- ❌ **100% dynamic from Supabase/APIs** - يجب استخدام APIs حقيقية فقط

**المشروع حالياً غير متوافق مع القواعد** ويحتاج إصلاح فوري.

