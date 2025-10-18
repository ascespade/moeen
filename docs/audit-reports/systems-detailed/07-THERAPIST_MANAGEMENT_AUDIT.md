# 👨‍⚕️ نظام إدارة الأخصائيين - Therapist Management System Audit

**التاريخ**: 2025-10-17  
**النظام**: Therapist Management & Scheduling  
**الأولوية**: 🟡 Medium  
**الجاهزية**: 65%

---

## 📋 نظرة عامة (Overview)

### الغرض:
نظام لإدارة الأخصائيين (المعالجين) في المركز:
- ملفات الأخصائيين
- تخصصاتهم
- جداول عملهم
- إحصائيات الأداء
- عدد الجلسات
- التقييمات

### السكوب لمركز الهمم:
```
👨‍⚕️ الأخصائيون:
   - أخصائي تعديل سلوك (ABA Therapist)
   - أخصائي علاج وظيفي (Occupational Therapist)
   - أخصائي تكامل حسي (Sensory Integration Specialist)
   - أخصائي نطق (Speech Therapist)
   - أخصائي تأهيل سمعي (Audiologist)

🎯 الوظائف:
   - إدارة الملف الشخصي
   - تحديد جدول العمل
   - عرض الجلسات القادمة
   - كتابة ملاحظات الجلسات
   - عرض الإحصائيات
```

---

## 🏗️ البنية الحالية

### الجداول الموجودة:

#### `users` (role = 'doctor'):
```sql
-- الأخصائيون مخزنون في جدول users
SELECT * FROM users WHERE role = 'doctor';

-- لكن لا توجد معلومات متخصصة مثل:
-- - التخصص الدقيق
-- - الشهادات
-- - سنوات الخبرة
```

---

## ✅ ما تم تنفيذه

### 1. Therapists في جدول users ✅
```
✅ role = 'doctor' للأخصائيين
✅ معلومات أساسية (اسم، بريد، جوال)
✅ RLS policies
```

### 2. ربط مع Appointments ✅
```
✅ appointments.doctor_id → users.id
✅ الأخصائي يرى جلساته
```

---

## 🔴 المشاكل والنقص

### 1. لا توجد معلومات متخصصة للأخصائيين 🟡
**المشكلة**:
```
⚠️  لا يوجد جدول therapist_profiles
⚠️  لا توجد تخصصات (specializations)
⚠️  لا توجد شهادات (certifications)
⚠️  لا توجد سيرة ذاتية
```

**الحل**:
```sql
CREATE TABLE therapist_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  specialization TEXT[], -- ['ABA', 'Occupational Therapy']
  certifications TEXT[], -- ['Board Certified Behavior Analyst', ...]
  years_of_experience INTEGER,
  bio TEXT,
  education TEXT,
  languages TEXT[], -- ['Arabic', 'English']
  available_for_home_visits BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**الوقت**: 4-6 ساعات  
**الأولوية**: 🟡 Medium

---

### 2. لا يوجد جدول عمل الأخصائيين 🔴
**المشكلة**:
```
❌ لا يوجد therapist_schedules (مهم!)
❌ لا يمكن تحديد: "أنا متاح الأحد 9-12"
❌ لا يمكن حساب المواعيد المتاحة
```

**الحل**:
```sql
-- نفس الجدول المذكور في Session Booking Audit
CREATE TABLE therapist_schedules (
  id UUID PRIMARY KEY,
  therapist_id UUID REFERENCES users(id),
  day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true
);
```

**الوقت**: 6-8 ساعات (مع واجهة إدارة الجدول)  
**الأولوية**: 🔴 Critical (مرتبط بـ Session Booking)

---

### 3. لا توجد إحصائيات أداء 🟡
**المشكلة**:
```
⚠️  الأخصائي لا يرى إحصائياته
⚠️  عدد الجلسات
⚠️  معدل الحضور
⚠️  التقييمات
```

**الحل**:
```typescript
<TherapistDashboard therapist={therapist}>
  <StatsCards>
    <StatCard 
      title="الجلسات هذا الشهر"
      value={statsثدرلا.sessions_count}
      icon="📅"
    />
    <StatCard 
      title="معدل الحضور"
      value={stats.attendance_rate}
      icon="✅"
    />
    <StatCard 
      title="تقييم الأسر"
      value={stats.avg_rating}
      icon="⭐"
    />
  </StatsCards>
  
  <UpcomingSessions sessions={upcoming} />
  <RecentNotes notes={recent} />
</TherapistDashboard>
```

**الوقت**: 8-10 ساعات  
**الأولوية**: 🟡 Medium

---

### 4. لا يوجد نظام تقييم الأخصائيين 🟡
**المشكلة**:
```
⚠️  الأسر لا يمكنها تقييم الأخصائي
⚠️  لا توجد مراجعات (reviews)
```

**الحل**:
```sql
CREATE TABLE therapist_reviews (
  id UUID PRIMARY KEY,
  therapist_id UUID REFERENCES users(id),
  reviewer_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**الوقت**: 4-6 ساعات  
**الأولوية**: 🟡 Low

---

## 📊 تقييم الجاهزية: **65/100** 🟡

| المعيار | النقاط | الوزن | الإجمالي |
|---------|--------|-------|----------|
| **Basic Info** | 80/100 | 30% | 24 |
| **Schedules** | 0/100 | 40% | 0 |
| **Stats & Reports** | 40/100 | 20% | 8 |
| **Reviews** | 30/100 | 10% | 3 |
| **المجموع** | - | - | **35** |

---

## 🎯 خطة العمل

### Week 1 (مع Session Booking):

#### Task: Therapist Schedules (6-8h)
```
✅ جدول therapist_schedules
✅ واجهة إدارة الجدول
✅ ربط مع available slots API
```

### Week 3 (بعد Core Features):

#### Task 1: Therapist Profiles (4-6h)
```
✅ جدول therapist_profiles
✅ صفحة Profile للأخصائي
✅ عرض التخصصات والشهادات
```

#### Task 2: Therapist Dashboard (8-10h)
```
✅ لوحة تحكم الأخصائي
✅ إحصائيات
✅ جلسات قادمة
✅ ملاحظات سابقة
```

**Total**: 18-24 ساعة  
**Result**: 65% → 85%

---

## 🎓 التوصيات

### Must Have:
```
1. 🔴 Therapist schedules (critical for booking)
```

### Should Have:
```
2. 🟡 Therapist profiles
3. 🟡 Dashboard & stats
```

### Nice to Have:
```
4. ⏳ Review system
5. ⏳ Performance reports
6. ⏳ Commission tracking
```

---

## ✅ الخلاصة

### الحالة: **65% - جيد لكن يحتاج Schedules** 🟡

**نقاط القوة**:
- ✅ Therapists في النظام
- ✅ ربط مع الجلسات

**ما ينقص**:
- 🔴 Schedules (critical!)
- 🟡 Profiles & specializations
- 🟡 Dashboard & stats

**الخطة**: 
- Week 1: Schedules (critical) → 70%
- Week 3: Profiles & Dashboard → 85%

**التكلفة**: $0  
**الوقت**: 18-24 ساعة

---

*Audit Date: 2025-10-17*  
*System: Therapist Management*  
*Status: ✅ Acceptable, Schedules Needed*
