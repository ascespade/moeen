# 💳 نظام المدفوعات - Payments System Audit

**التاريخ**: 2025-10-17  
**النظام**: Payments & Billing  
**الأولوية**: 🔴 Critical  
**الجاهزية**: 55%

---

## 📋 نظرة عامة

### الغرض:
نظام لإدارة المدفوعات والفواتير:
- تسجيل المدفوعات
- إصدار الفواتير
- طرق الدفع المتعددة
- متابعة المستحقات
- التأمينات

---

## 🏗️ البنية الحالية

### الجداول الموجودة:

#### `payments`:
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method DEFAULT 'cash',
  payment_date DATE,
  status payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_method ENUM
CREATE TYPE payment_method AS ENUM (
  'cash',
  'credit_card',
  'bank_transfer',
  'insurance'
);

-- payment_status ENUM
CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);
```

---

## ✅ ما تم تنفيذه: 55%

```
✅ جدول payments موجود
✅ طرق دفع متعددة
✅ حالات الدفع
✅ RLS policies
```

---

## 🔴 ما ينقص

### 1. ربط الدفع بالجلسة 🔴

**المشكلة**:
```
❌ لا يوجد ربط بين payment و session
❌ لا نعرف أي جلسة تم دفعها
```

**الحل**:
```sql
ALTER TABLE payments ADD COLUMN session_id UUID REFERENCES sessions(id);
ALTER TABLE payments ADD COLUMN service_type TEXT; -- للوضوح
```

**الوقت**: 2-3h  
**الأولوية**: 🔴 Critical

---

### 2. إصدار الفواتير 🔴

**المشكلة**:
```
❌ لا يوجد نظام فواتير
❌ لا يمكن طباعة إيصال
❌ لا يوجد رقم فاتورة
```

**الحل**:
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL, -- "INV-2024-001"
  patient_id UUID REFERENCES patients(id),
  session_id UUID REFERENCES sessions(id),
  amount DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, paid, cancelled
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE,
  paid_at TIMESTAMPTZ
);

// Generate PDF invoice
<InvoicePDF
  invoice={invoice}
  patient={patient}
  center={{
    name: 'مركز الهمم',
    address: 'جدة - حي الصفا',
    phone: '+966126173693',
    tax_number: 'xxx',
  }}
/>
```

**الوقت**: 12-16h  
**الأولوية**: 🔴 Critical

---

### 3. بوابة دفع إلكتروني 🟡

**المشكلة**:
```
⚠️  لا يوجد دفع أونلاين
⚠️  كل شيء يدوي
```

**الحل (مستقبلاً)**:
```
Options:
1. Stripe (international)
2. Moyasar (Saudi)
3. Tap Payments (Saudi)
4. HyperPay (Saudi)

Cost: 2.5-3% per transaction
```

**الوقت**: 16-20h  
**الأولوية**: 🟡 Low (مستقبلاً)

---

### 4. متابعة المستحقات 🟡

**المشكلة**:
```
⚠️  لا يوجد نظام لمتابعة المدفوعات المتأخرة
⚠️  لا توجد إشعارات
```

**الحل**:
```typescript
// Overdue payments dashboard
<OverduePayments>
  <OverdueList>
    {overdueInvoices.map(invoice => (
      <InvoiceRow 
        invoice={invoice}
        daysOverdue={getDaysOverdue(invoice.due_date)}
        onSendReminder={sendReminderToGuardian}
      />
    ))}
  </OverdueList>
</OverduePayments>
```

**الوقت**: 8-10h  
**الأولوية**: 🟡 Medium

---

## 📊 تقييم: **55/100** 🟡

| المعيار | النقاط | الوزن | الإجمالي |
|---------|--------|-------|----------|
| **Basic Payments** | 80/100 | 30% | 24 |
| **Invoicing** | 20/100 | 40% | 8 |
| **Online Payment** | 0/100 | 20% | 0 |
| **Collections** | 40/100 | 10% | 4 |
| **المجموع** | - | - | **36** |

---

## 🎯 خطة العمل

### Phase 1: Core Billing (Week 1)

#### Task 1: Link Payment to Session (2-3h)
```sql
✅ Add session_id to payments
✅ Update UI
```

#### Task 2: Invoicing System (12-16h)
```typescript
✅ جدول invoices
✅ Invoice generation
✅ PDF export
✅ Invoice numbering
✅ Email invoice to guardian
```

#### Task 3: Payment Receipt (4-6h)
```typescript
✅ Receipt generation
✅ Print functionality
✅ Email receipt
```

**Total Phase 1**: 18-25 ساعة  
**Result**: 55% → 80%

---

### Phase 2: Advanced Features (Future)

#### Task 4: Overdue Management (8-10h)
```
✅ Overdue dashboard
✅ Reminders
✅ Reports
```

#### Task 5: Online Payment (16-20h)
```
✅ Payment gateway integration
✅ Online checkout
✅ Webhook handling
```

**Total Phase 2**: 24-30 ساعة  
**Result**: 80% → 95%

---

## 💰 التكلفة

### Payment Gateway (مستقبلاً):
```
Moyasar (Saudi):
- Setup: Free
- Transaction fee: 2.9% + 1 SAR

Expected:
- 100 transactions/month
- Average: 200 SAR
- Total: 20,000 SAR/month
- Fees: 580 + 100 = 680 SAR/month (~$180)

Start: After 3-6 months (manual first)
```

---

## 🎓 التوصيات

### Must Have (Now):
```
1. 🔴 Link payment to session
2. 🔴 Invoicing system
3. 🔴 Receipt generation
```

### Nice to Have (Future):
```
4. 🟡 Overdue management
5. 🟡 Online payment gateway
6. 🟡 Subscription billing
```

---

## ✅ الخلاصة

**الحالة**: 55% - يحتاج عمل 🟡

**ما ينقص**:
- 🔴 Invoicing (critical)
- 🔴 Receipts
- 🟡 Online payment (مستقبلاً)

**الخطة**: 18-25 ساعة → 80%  
**التكلفة الآن**: $0  
**التكلفة المستقبلية**: ~$180/month (payment gateway)

---

*Audit Date: 2025-10-17*  
*System: Payments*  
*Status: ⚠️  Needs Invoicing System*
