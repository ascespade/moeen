# 🏥 نظام التأمينات الآلي - Insurance Automation System

**التاريخ**: 2025-10-17  
**الأولوية**: 🔴 **عالية جداً** - محور تركيز رئيسي  
**الحالة**: 70% → Target: 98%

---

## 📊 ملخص تنفيذي - Executive Summary

نظام التأمينات سيكون **الميزة التنافسية الرئيسية** للمشروع من خلال:

1. ربط تلقائي مع **10 شركات تأمين سعودية رئيسية**
2. **إطار عمل عام** للربط مع شركات جديدة بدون تعديل كود
3. **أتمتة كاملة** لجميع مراحل المطالبات
4. **سهولة وسرعة فائقة** تميزنا عن المنافسين

---

## 🎯 الشركات العشر الرئيسية - Top 10 Saudi Insurance Companies

### الترتيب حسب الحصة السوقية:

| #                       | الشركة | الحصة السوقية | الأولوية | الحالة |
| ----------------------- | ------ | ------------- | -------- | ------ |
| 1. **Tawuniya** (طويق)  | 25%    | 🔴 عالية جداً | ⚠️ بناء  |
| 2. **Bupa Arabia**      | 20%    | 🔴 عالية جداً | ⚠️ بناء  |
| 3. **Medgulf**          | 12%    | 🔴 عالية      | ⚠️ بناء  |
| 4. **AXA Cooperative**  | 10%    | 🔴 عالية      | ⚠️ بناء  |
| 5. **SABB Takaful**     | 8%     | 🟡 متوسطة     | ⚠️ بناء  |
| 6. **Al Rajhi Takaful** | 7%     | 🟡 متوسطة     | ⚠️ بناء  |
| 7. **Malath**           | 5%     | 🟡 متوسطة     | ⚠️ بناء  |
| 8. **Gulf Union**       | 4%     | 🟢 منخفضة     | ⚠️ بناء  |
| 9. **Sanad**            | 4%     | 🟢 منخفضة     | ⚠️ بناء  |
| 10. **Walaa**           | 3%     | 🟢 منخفضة     | ⚠️ بناء  |

**تغطية مستهدفة**: 98% من السوق السعودي!

---

## 🏗️ معمارية النظام - System Architecture

### 1. الإطار العام - Generic Integration Framework

```typescript
// src/lib/insurance/insurance-adapter.ts

export interface InsuranceProvider {
  id: string;
  name: string;
  code: string; // 'tawuniya', 'bupa', etc.
  type: 'standard' | 'custom';
  config: ProviderConfig;
}

export interface ProviderConfig {
  apiUrl: string;
  authType: 'bearer' | 'api_key' | 'oauth' | 'certificate';
  credentials: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    certificate?: string;
  };
  endpoints: {
    submitClaim: string;
    checkStatus: string;
    getCoverage: string;
    priorAuthorization?: string;
  };
  dataMapping: DataMappingRules;
  responseFormat: 'json' | 'xml' | 'soap';
}

export interface DataMappingRules {
  patientId: string; // field name in provider API
  nationalId: string;
  policyNumber: string;
  claimType: string;
  // ... mapping for all fields
}

export abstract class InsuranceAdapter {
  constructor(protected config: ProviderConfig) {}

  abstract async submitClaim(claim: Claim): Promise<ClaimResponse>;
  abstract async checkStatus(claimId: string): Promise<ClaimStatus>;
  abstract async getCoverage(policyNumber: string): Promise<Coverage>;

  // Generic helpers
  protected async makeRequest(endpoint: string, data: any): Promise<any> {
    // Handle different auth types
    // Handle different response formats
    // Handle errors consistently
  }

  protected mapClaimData(claim: Claim): any {
    // Use DataMappingRules to transform data
  }

  protected parseResponse(response: any): ClaimResponse {
    // Parse different response formats
  }
}
```

---

### 2. التكاملات الخاصة - Provider-Specific Implementations

#### مثال: Tawuniya (طويق)

```typescript
// src/lib/insurance/providers/tawuniya-adapter.ts

export class TawuniyaAdapter extends InsuranceAdapter {
  async submitClaim(claim: Claim): Promise<ClaimResponse> {
    // Tawuniya-specific implementation
    const mappedData = {
      memberNumber: claim.patient.nationalId,
      providerId: 'HEMAM-001', // مخصص لنا
      claimType: this.mapClaimType(claim.type),
      services: claim.services.map(s => ({
        code: s.cptCode,
        description: s.descriptionAr,
        qty: s.quantity,
        unitPrice: s.unitPrice,
        total: s.total,
      })),
      diagnosis: {
        icd10: claim.diagnosis.code,
        description: claim.diagnosis.descriptionAr,
      },
      attachments: await this.uploadAttachments(claim.attachments),
    };

    const response = await this.makeRequest(
      this.config.endpoints.submitClaim,
      mappedData
    );

    return {
      success: response.status === 'approved',
      claimId: response.claimReferenceNumber,
      approvalCode: response.approvalNumber,
      status: this.mapStatus(response.status),
      message: response.messageAr,
    };
  }

  async checkStatus(claimId: string): Promise<ClaimStatus> {
    const response = await this.makeRequest(this.config.endpoints.checkStatus, {
      claimId,
    });

    return {
      status: this.mapStatus(response.status),
      updatedAt: new Date(response.lastUpdateDate),
      approvalCode: response.approvalNumber,
      rejectionReason: response.rejectionReasonAr,
    };
  }

  private mapClaimType(type: string): string {
    const mapping = {
      outpatient: 'OP',
      inpatient: 'IP',
      emergency: 'ER',
      dental: 'DE',
      optical: 'OP',
    };
    return mapping[type] || 'OP';
  }

  private mapStatus(providerStatus: string): ClaimStatus {
    const mapping = {
      approved: 'approved',
      rejected: 'rejected',
      pending: 'pending',
      under_review: 'under_review',
      requires_info: 'info_required',
    };
    return mapping[providerStatus] || 'pending';
  }

  private async uploadAttachments(
    attachments: Attachment[]
  ): Promise<string[]> {
    // Upload to Tawuniya's file storage
    // Return array of file IDs
  }
}
```

#### مثال: Bupa Arabia

```typescript
// src/lib/insurance/providers/bupa-adapter.ts

export class BupaAdapter extends InsuranceAdapter {
  async submitClaim(claim: Claim): Promise<ClaimResponse> {
    // Bupa has different API structure
    const mappedData = {
      policyNo: claim.patient.insurancePolicyNumber,
      memberId: claim.patient.insuranceMemberId,
      facilityCode: 'HEMAM',
      visitDate: claim.visitDate,
      claimLines: claim.services.map(s => ({
        serviceCode: s.cptCode,
        serviceDesc: s.descriptionEn, // Bupa uses English
        quantity: s.quantity,
        charges: s.unitPrice,
      })),
      diagnosisCodes: [claim.diagnosis.code],
      documents: claim.attachments.map(a => ({
        type: a.type,
        url: a.url,
        description: a.description,
      })),
    };

    // Bupa uses OAuth
    const token = await this.getOAuthToken();

    const response = await fetch(this.config.apiUrl + '/claims/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Provider-ID': 'HEMAM',
      },
      body: JSON.stringify(mappedData),
    });

    const data = await response.json();

    return {
      success: data.status === 'APPROVED',
      claimId: data.claimReference,
      approvalCode: data.authorizationCode,
      status: data.status.toLowerCase(),
      message: data.statusMessage,
    };
  }

  private async getOAuthToken(): Promise<string> {
    // Bupa OAuth flow
  }
}
```

---

### 3. المصنع - Adapter Factory

```typescript
// src/lib/insurance/adapter-factory.ts

export class InsuranceAdapterFactory {
  private static adapters: Map<string, InsuranceAdapter> = new Map();

  static async getAdapter(providerCode: string): Promise<InsuranceAdapter> {
    // Check cache
    if (this.adapters.has(providerCode)) {
      return this.adapters.get(providerCode)!;
    }

    // Get provider config from database
    const provider = await getProviderConfig(providerCode);

    // Create specific adapter
    let adapter: InsuranceAdapter;

    switch (provider.code) {
      case 'tawuniya':
        adapter = new TawuniyaAdapter(provider.config);
        break;
      case 'bupa':
        adapter = new BupaAdapter(provider.config);
        break;
      case 'medgulf':
        adapter = new MedgulfAdapter(provider.config);
        break;
      // ... other providers
      default:
        // Generic adapter for custom providers
        adapter = new GenericAdapter(provider.config);
    }

    // Cache it
    this.adapters.set(providerCode, adapter);

    return adapter;
  }
}
```

---

## 🔄 سير عمل المطالبات - Claims Workflow

### 1. تقديم المطالبة - Claim Submission

```typescript
// src/app/api/insurance/claims/submit/route.ts

export async function POST(request: NextRequest) {
  const { user } = await authorize(request);
  const claim = await request.json();

  try {
    // 1. Validate claim data
    const validatedClaim = await validateClaim(claim);

    // 2. Get patient insurance info
    const patient = await getPatient(claim.patientId);
    const insuranceProvider = patient.insurance.provider;

    // 3. Get appropriate adapter
    const adapter = await InsuranceAdapterFactory.getAdapter(insuranceProvider);

    // 4. Submit to insurance company
    const response = await adapter.submitClaim(validatedClaim);

    // 5. Save to database
    await saveClaimSubmission({
      ...validatedClaim,
      externalClaimId: response.claimId,
      status: response.status,
      approvalCode: response.approvalCode,
      submittedAt: new Date(),
      submittedBy: user.id,
    });

    // 6. Create notification
    await notifyStaff({
      type: 'claim_submitted',
      claimId: response.claimId,
      provider: insuranceProvider,
      status: response.status,
    });

    // 7. If approved automatically, update appointment
    if (response.status === 'approved') {
      await updateAppointmentStatus(claim.appointmentId, 'insurance_approved');
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error('Claim submission failed', error);

    // Save failed attempt
    await saveFailedAttempt(claim, error);

    // Retry logic
    if (isRetryable(error)) {
      await scheduleRetry(claim);
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

---

### 2. التحقق التلقائي - Automatic Status Checking

```typescript
// src/lib/insurance/status-checker.ts

export class ClaimStatusChecker {
  async checkPendingClaims() {
    // Get all pending claims
    const pendingClaims = await getPendingClaims();

    for (const claim of pendingClaims) {
      try {
        const adapter = await InsuranceAdapterFactory.getAdapter(
          claim.insuranceProvider
        );

        const status = await adapter.checkStatus(claim.externalClaimId);

        // If status changed
        if (status.status !== claim.status) {
          await updateClaimStatus(claim.id, status);

          // Notify staff
          await notifyStatusChange(claim, status);

          // If approved, process automatically
          if (status.status === 'approved') {
            await processApprovedClaim(claim);
          }

          // If rejected, notify and suggest action
          if (status.status === 'rejected') {
            await handleRejection(claim, status.rejectionReason);
          }
        }
      } catch (error) {
        logger.error(`Failed to check status for claim ${claim.id}`, error);
      }
    }
  }

  // Run every 5 minutes
  startAutomaticChecking() {
    setInterval(() => this.checkPendingClaims(), 5 * 60 * 1000);
  }
}
```

---

### 3. التفويض المسبق - Prior Authorization

```typescript
// Some services require prior authorization

export async function requestPriorAuthorization(request: PriorAuthRequest) {
  const adapter = await InsuranceAdapterFactory.getAdapter(request.provider);

  // Check if provider supports prior auth
  if (!adapter.supportsPriorAuthorization()) {
    return {
      required: false,
      message: 'Provider does not require prior authorization',
    };
  }

  const response = await adapter.requestPriorAuthorization({
    patientId: request.patientId,
    serviceCode: request.serviceCode,
    diagnosis: request.diagnosis,
    estimatedCost: request.estimatedCost,
  });

  return {
    required: true,
    approved: response.approved,
    authorizationCode: response.code,
    validUntil: response.expiryDate,
  };
}
```

---

## 🎨 واجهة المستخدم - User Interface

### 1. صفحة تقديم المطالبة

```typescript
// src/app/(health)/insurance/submit-claim/page.tsx

'use client';

export default function SubmitClaimPage() {
  const [step, setStep] = useState(1);
  const [claim, setClaim] = useState<Partial<Claim>>({});

  return (
    <div className="container mx-auto py-8">
      <h1>تقديم مطالبة تأمينية</h1>

      {/* Progress Steps */}
      <Steps current={step} total={5}>
        <Step title="معلومات المريض" />
        <Step title="معلومات التأمين" />
        <Step title="الخدمات المقدمة" />
        <Step title="المرفقات" />
        <Step title="المراجعة والإرسال" />
      </Steps>

      {/* Step 1: Patient Info */}
      {step === 1 && (
        <PatientInfoStep
          value={claim.patient}
          onChange={(patient) => setClaim({ ...claim, patient })}
          onNext={() => setStep(2)}
        />
      )}

      {/* Step 2: Insurance Info */}
      {step === 2 && (
        <InsuranceInfoStep
          patient={claim.patient}
          value={claim.insurance}
          onChange={(insurance) => setClaim({ ...claim, insurance })}
          onNext={() => {
            // Auto-check coverage
            checkCoverage(claim.insurance).then(coverage => {
              setClaim({ ...claim, coverage });
              setStep(3);
            });
          }}
          onBack={() => setStep(1)}
        />
      )}

      {/* Step 3: Services */}
      {step === 3 && (
        <ServicesStep
          coverage={claim.coverage}
          value={claim.services}
          onChange={(services) => setClaim({ ...claim, services })}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* Step 4: Attachments */}
      {step === 4 && (
        <AttachmentsStep
          value={claim.attachments}
          onChange={(attachments) => setClaim({ ...claim, attachments })}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {/* Step 5: Review & Submit */}
      {step === 5 && (
        <ReviewSubmitStep
          claim={claim}
          onSubmit={async () => {
            const result = await submitClaim(claim);
            if (result.success) {
              // Show success with approval code
              showSuccess(result);
            }
          }}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}
```

---

### 2. لوحة متابعة المطالبات

```typescript
// Real-time status dashboard

export default function ClaimsDashboardPage() {
  const { data: claims } = useSWR('/api/insurance/claims', {
    refreshInterval: 30000, // Check every 30 seconds
  });

  return (
    <div>
      <h1>لوحة متابعة المطالبات</h1>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="معلقة"
          value={claims.filter(c => c.status === 'pending').length}
          icon={<ClockIcon />}
          color="yellow"
        />
        <StatCard
          title="موافق عليها"
          value={claims.filter(c => c.status === 'approved').length}
          icon={<CheckIcon />}
          color="green"
        />
        <StatCard
          title="مرفوضة"
          value={claims.filter(c => c.status === 'rejected').length}
          icon={<XIcon />}
          color="red"
        />
        <StatCard
          title="قيد المراجعة"
          value={claims.filter(c => c.status === 'under_review').length}
          icon={<SearchIcon />}
          color="blue"
        />
      </div>

      {/* Claims Table */}
      <DataTable
        columns={[
          { key: 'claimId', title: 'رقم المطالبة' },
          { key: 'patient', title: 'المريض' },
          { key: 'provider', title: 'شركة التأمين' },
          { key: 'amount', title: 'المبلغ' },
          { key: 'status', title: 'الحالة', render: (claim) => (
            <StatusBadge status={claim.status} />
          )},
          { key: 'submittedAt', title: 'تاريخ التقديم' },
          { key: 'actions', title: 'إجراءات', render: (claim) => (
            <ClaimActions claim={claim} />
          )},
        ]}
        data={claims}
      />
    </div>
  );
}
```

---

## 🔧 إضافة شركة تأمين جديدة - Adding New Provider

### واجهة Admin

```typescript
// src/app/(admin)/insurance/providers/new/page.tsx

export default function AddProviderPage() {
  return (
    <Form onSubmit={handleAddProvider}>
      <h1>إضافة شركة تأمين جديدة</h1>

      {/* Basic Info */}
      <Section title="معلومات أساسية">
        <Input name="name" label="اسم الشركة" required />
        <Input name="code" label="الرمز (بالإنجليزية)" required />
        <Select name="type" label="نوع التكامل">
          <option value="standard">قياسي (استخدام adapter موجود)</option>
          <option value="custom">مخصص (يحتاج برمجة)</option>
        </Select>
      </Section>

      {/* API Configuration */}
      <Section title="إعدادات API">
        <Input name="apiUrl" label="عنوان API" />
        <Select name="authType" label="نوع التوثيق">
          <option value="api_key">API Key</option>
          <option value="bearer">Bearer Token</option>
          <option value="oauth">OAuth 2.0</option>
          <option value="certificate">Certificate</option>
        </Select>

        {authType === 'api_key' && (
          <Input name="apiKey" label="API Key" type="password" />
        )}

        {authType === 'oauth' && (
          <>
            <Input name="clientId" label="Client ID" />
            <Input name="clientSecret" label="Client Secret" type="password" />
            <Input name="tokenUrl" label="Token URL" />
          </>
        )}
      </Section>

      {/* Endpoints */}
      <Section title="Endpoints">
        <Input name="submitClaim" label="تقديم مطالبة" placeholder="/claims/submit" />
        <Input name="checkStatus" label="التحقق من الحالة" placeholder="/claims/status" />
        <Input name="getCoverage" label="الحصول على التغطية" placeholder="/coverage/check" />
      </Section>

      {/* Data Mapping */}
      <Section title="Data Mapping (الحقول)">
        <p>ربط حقول نظامنا مع حقول API الشركة</p>
        <MappingTable
          ourFields={['patientId', 'nationalId', 'policyNumber', /* ... */]}
          onMap={(field, theirField) => {
            // Save mapping
          }}
        />
      </Section>

      {/* Test Connection */}
      <Section title="اختبار الاتصال">
        <Button onClick={testConnection}>
          اختبار الآن
        </Button>
        {testResult && <TestResult result={testResult} />}
      </Section>

      <Button type="submit">حفظ الشركة</Button>
    </Form>
  );
}
```

---

## 📊 التقارير والتحليلات - Reports & Analytics

### 1. تقرير أداء الشركات

```typescript
export function ProvidersPerformanceReport() {
  return (
    <div>
      <h2>أداء شركات التأمين</h2>

      <Table>
        <thead>
          <tr>
            <th>الشركة</th>
            <th>عدد المطالبات</th>
            <th>نسبة الموافقة</th>
            <th>متوسط وقت الرد</th>
            <th>نسبة الأخطاء</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(provider => (
            <tr key={provider.id}>
              <td>{provider.name}</td>
              <td>{provider.totalClaims}</td>
              <td>
                <PercentageBadge value={provider.approvalRate} />
              </td>
              <td>{provider.avgResponseTime} hours</td>
              <td>{provider.errorRate}%</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Chart
        type="bar"
        data={providers.map(p => ({
          label: p.name,
          value: p.approvalRate,
        }))}
      />
    </div>
  );
}
```

---

## 🎯 الميزات التنافسية - Competitive Advantages

### ما يميزنا:

1. **✅ أتمتة كاملة**
   - تقديم تلقائي
   - تحديث تلقائي للحالة
   - معالجة تلقائية للموافقات

2. **✅ سرعة فائقة**
   - تقديم في ثواني
   - نتيجة فورية (للشركات المدعومة)
   - لا انتظار

3. **✅ سهولة الاستخدام**
   - واجهة بسيطة
   - خطوات واضحة
   - إرشادات مفصلة

4. **✅ مرونة عالية**
   - إضافة شركات جديدة بدون برمجة
   - تخصيص لكل شركة
   - دعم جميع أنواع APIs

5. **✅ شفافية كاملة**
   - متابعة لحظية
   - إشعارات فورية
   - تقارير شاملة

---

## 📋 خطة التنفيذ - Implementation Plan

### المرحلة 1 (أسبوع 1): البنية التحتية

- [x] Database schema (موجود)
- [ ] Generic adapter framework
- [ ] Adapter factory
- [ ] Base UI components

### المرحلة 2 (أسبوع 2): الشركات الأساسية (4 شركات)

- [ ] Tawuniya adapter
- [ ] Bupa adapter
- [ ] Medgulf adapter
- [ ] AXA adapter

### المرحلة 3 (أسبوع 3): باقي الشركات (6 شركات)

- [ ] SABB Takaful adapter
- [ ] Al Rajhi Takaful adapter
- [ ] Malath adapter
- [ ] Gulf Union adapter
- [ ] Sanad adapter
- [ ] Walaa adapter

### المرحلة 4 (أسبوع 4): التحسينات

- [ ] Automatic status checking
- [ ] Prior authorization
- [ ] Reports & analytics
- [ ] Admin UI for adding providers

---

## 🎯 المقاييس المستهدفة - Target Metrics

```
معدل الموافقة التلقائية:     > 70%
متوسط وقت التقديم:          < 2 دقيقة
متوسط وقت الرد:            < 24 ساعة
معدل الأخطاء:              < 2%
رضا المستخدمين:            > 95%
```

---

**Status**: 🚧 جاهز للتنفيذ  
**Estimated Time**: 4 أسابيع  
**Priority**: 🔴 **عالية جداً**
