# 🔌 نظام التكاملات مع Wizard UI - تقرير شامل
## Integrations Wizard System - Comprehensive Report

**تاريخ الإعداد**: 2025-01-17  
**الحالة الحالية**: 30% (ضعيف جداً)  
**الهدف**: 95% (نظام ويزرد متكامل ومؤتمت)

---

## 📊 الملخص التنفيذي

### الوضع الحالي:
- ❌ **UI محذوف** (IntegrationsTab.tsx)
- ❌ **معظم التكاملات معطّلة** (WhatsApp, SMS, Email)
- ❌ **التشفير Base64 فقط** (غير آمن)
- ❌ **لا يوجد ويزرد** للمستخدمين
- ❌ **تجربة مستخدم سيئة**

### الرؤية المستقبلية:
- ✅ **Wizard UI متقدم** مع خطوات واضحة
- ✅ **تعليمات تفاعلية** لكل مرحلة
- ✅ **اختبار فوري** للمدخلات
- ✅ **تجربة مستخدم ممتعة** ومحفزة
- ✅ **دعم تكاملات متعددة** لنفس الخدمة
- ✅ **إضافة شركات جديدة** بدون كود

---

## 🧙‍♂️ نظام Wizard UI المتقدم

### الفلسفة:
**"كل تكامل = رحلة سلسة وممتعة"**

بدلاً من نماذج معقدة، كل تكامل يصبح:
- 🎯 **رحلة واضحة** مع خطوات محددة
- 📚 **تعليمات تفاعلية** في كل خطوة
- ✅ **اختبار فوري** للمدخلات
- 🎉 **تأكيدات إيجابية** عند النجاح

---

## 🏗️ البنية المعمارية

### 1. **Wizard Engine** - محرك الويزرد
```typescript
// src/lib/integrations/wizard-engine.ts

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<WizardStepProps>;
  validation: ValidationRule[];
  dependencies?: string[];
  optional?: boolean;
}

export interface WizardConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'payment' | 'scheduling' | 'analytics';
  steps: WizardStep[];
  allowMultiple: boolean; // هل يسمح بتكاملات متعددة؟
  maxInstances?: number;
}

export class WizardEngine {
  private configs: Map<string, WizardConfig> = new Map();
  
  registerWizard(config: WizardConfig): void {
    this.configs.set(config.id, config);
  }
  
  getWizard(id: string): WizardConfig | undefined {
    return this.configs.get(id);
  }
  
  getAllWizards(): WizardConfig[] {
    return Array.from(this.configs.values());
  }
  
  getWizardsByCategory(category: string): WizardConfig[] {
    return this.getAllWizards().filter(w => w.category === category);
  }
}
```

---

### 2. **Wizard Components** - مكونات الويزرد

#### A. **Wizard Container** - الحاوي الرئيسي
```typescript
// src/components/integrations/wizard/WizardContainer.tsx

interface WizardContainerProps {
  wizardId: string;
  onComplete: (result: IntegrationResult) => void;
  onCancel: () => void;
}

export function WizardContainer({ wizardId, onComplete, onCancel }: WizardContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  const wizard = wizardEngine.getWizard(wizardId);
  const currentStepConfig = wizard?.steps[currentStep];
  
  const handleNext = async () => {
    if (!currentStepConfig) return;
    
    setIsValidating(true);
    
    try {
      // Validate current step
      const validation = await validateStep(currentStepConfig, stepData);
      
      if (!validation.isValid) {
        showError(validation.errors);
        return;
      }
      
      // Save step data
      setStepData(prev => ({
        ...prev,
        [currentStepConfig.id]: stepData[currentStepConfig.id]
      }));
      
      // Move to next step
      if (currentStep < wizard.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete wizard
        await completeWizard(wizardId, stepData);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleStepDataChange = (stepId: string, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };
  
  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      <WizardProgress
        steps={wizard.steps}
        currentStep={currentStep}
      />
      
      {/* Step Content */}
      <div className="wizard-content">
        <WizardStepHeader
          step={currentStepConfig}
          stepNumber={currentStep + 1}
          totalSteps={wizard.steps.length}
        />
        
        <WizardStepContent
          step={currentStepConfig}
          data={stepData[currentStepConfig.id]}
          onChange={(data) => handleStepDataChange(currentStepConfig.id, data)}
        />
      </div>
      
      {/* Navigation */}
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={wizard.steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onCancel={onCancel}
        isValidating={isValidating}
        canProceed={isStepValid(currentStepConfig, stepData)}
      />
    </div>
  );
}
```

---

#### B. **Wizard Progress** - شريط التقدم
```typescript
// src/components/integrations/wizard/WizardProgress.tsx

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="wizard-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      <div className="steps-indicators">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-indicator ${
              index <= currentStep ? 'completed' : 
              index === currentStep ? 'current' : 'pending'
            }`}
          >
            <div className="step-icon">
              {index < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-label">
              <span className="step-title">{step.title}</span>
              {index === currentStep && (
                <span className="step-description">{step.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

#### C. **Wizard Step Content** - محتوى الخطوة
```typescript
// src/components/integrations/wizard/WizardStepContent.tsx

interface WizardStepContentProps {
  step: WizardStep;
  data: any;
  onChange: (data: any) => void;
}

export function WizardStepContent({ step, data, onChange }: WizardStepContentProps) {
  const StepComponent = step.component;
  
  return (
    <div className="wizard-step-content">
      <div className="step-header">
        <div className="step-icon">
          <span className="text-2xl">{step.icon}</span>
        </div>
        <div className="step-info">
          <h2 className="step-title">{step.title}</h2>
          <p className="step-description">{step.description}</p>
        </div>
      </div>
      
      <div className="step-body">
        <StepComponent
          data={data}
          onChange={onChange}
          validation={step.validation}
        />
      </div>
      
      {/* Help Section */}
      <WizardHelp
        stepId={step.id}
        data={data}
      />
    </div>
  );
}
```

---

## 🔧 تكاملات محددة مع Wizard UI

### 1. **WhatsApp Business API Wizard**

```typescript
// src/lib/integrations/wizards/whatsapp-wizard.ts

export const whatsappWizardConfig: WizardConfig = {
  id: 'whatsapp',
  name: 'WhatsApp Business API',
  description: 'ربط حساب WhatsApp Business لإرسال الرسائل',
  icon: '📱',
  category: 'communication',
  allowMultiple: false, // تكامل واحد فقط
  steps: [
    {
      id: 'account-setup',
      title: 'إعداد الحساب',
      description: 'أدخل معلومات حساب WhatsApp Business',
      icon: '🏢',
      component: WhatsAppAccountStep,
      validation: [
        { field: 'businessName', required: true, message: 'اسم النشاط التجاري مطلوب' },
        { field: 'phoneNumber', required: true, pattern: /^\+966[0-9]{9}$/, message: 'رقم الهاتف غير صحيح' },
      ],
    },
    {
      id: 'api-credentials',
      title: 'معلومات API',
      description: 'أدخل بيانات API من Meta Business',
      icon: '🔑',
      component: WhatsAppCredentialsStep,
      validation: [
        { field: 'accessToken', required: true, minLength: 50, message: 'Access Token مطلوب' },
        { field: 'phoneNumberId', required: true, message: 'Phone Number ID مطلوب' },
        { field: 'webhookVerifyToken', required: true, minLength: 10, message: 'Webhook Verify Token مطلوب' },
      ],
    },
    {
      id: 'webhook-setup',
      title: 'إعداد Webhook',
      description: 'قم بإعداد Webhook لاستقبال الرسائل',
      icon: '🔗',
      component: WhatsAppWebhookStep,
      validation: [
        { field: 'webhookUrl', required: true, url: true, message: 'Webhook URL مطلوب' },
      ],
    },
    {
      id: 'test-connection',
      title: 'اختبار الاتصال',
      description: 'تأكد من أن كل شيء يعمل بشكل صحيح',
      icon: '🧪',
      component: WhatsAppTestStep,
      validation: [],
    },
  ],
};
```

---

#### **WhatsApp Account Step** - خطوة الحساب
```typescript
// src/components/integrations/wizard/steps/WhatsAppAccountStep.tsx

interface WhatsAppAccountStepProps {
  data: any;
  onChange: (data: any) => void;
  validation: ValidationRule[];
}

export function WhatsAppAccountStep({ data, onChange, validation }: WhatsAppAccountStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: string, value: any) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
    
    // Real-time validation
    validateField(field, value, validation);
  };
  
  return (
    <div className="whatsapp-account-step">
      <div className="step-intro">
        <h3>مرحباً! 👋</h3>
        <p>سنساعدك في ربط حساب WhatsApp Business مع النظام</p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="businessName">
            اسم النشاط التجاري *
            <span className="help-text">
              الاسم الذي سيظهر للمرضى في الرسائل
            </span>
          </label>
          <Input
            id="businessName"
            value={data.businessName || ''}
            onChange={(e) => handleChange('businessName', e.target.value)}
            placeholder="مثال: مركز الهمم للرعاية الصحية"
            error={errors.businessName}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">
            رقم الهاتف *
            <span className="help-text">
              رقم WhatsApp Business (يجب أن يبدأ بـ +966)
            </span>
          </label>
          <PhoneInput
            id="phoneNumber"
            value={data.phoneNumber || ''}
            onChange={(value) => handleChange('phoneNumber', value)}
            country="SA"
            placeholder="+966501234567"
            error={errors.phoneNumber}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="businessCategory">
            فئة النشاط التجاري
            <span className="help-text">
              اختر الفئة الأقرب لنشاطك
            </span>
          </label>
          <Select
            value={data.businessCategory || ''}
            onChange={(e) => handleChange('businessCategory', e.target.value)}
          >
            <option value="">اختر الفئة</option>
            <option value="healthcare">الرعاية الصحية</option>
            <option value="medical">الطب</option>
            <option value="clinic">العيادة</option>
            <option value="hospital">المستشفى</option>
          </Select>
        </div>
      </div>
      
      <div className="help-section">
        <h4>💡 نصائح مهمة:</h4>
        <ul>
          <li>تأكد من أن الرقم مسجل في WhatsApp Business</li>
          <li>الاسم سيظهر في جميع الرسائل المرسلة</li>
          <li>يمكنك تغيير هذه المعلومات لاحقاً</li>
        </ul>
      </div>
    </div>
  );
}
```

---

#### **WhatsApp Credentials Step** - خطوة بيانات API
```typescript
// src/components/integrations/wizard/steps/WhatsAppCredentialsStep.tsx

export function WhatsAppCredentialsStep({ data, onChange, validation }: WhatsAppCredentialsStepProps) {
  const [showSecrets, setShowSecrets] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  return (
    <div className="whatsapp-credentials-step">
      <div className="step-intro">
        <h3>معلومات API من Meta Business 🔑</h3>
        <p>ستحتاج للحصول على هذه البيانات من Meta Business Manager</p>
      </div>
      
      <div className="credentials-guide">
        <div className="guide-card">
          <h4>📋 خطوات الحصول على البيانات:</h4>
          <ol>
            <li>اذهب إلى <a href="https://business.facebook.com" target="_blank">Meta Business Manager</a></li>
            <li>انتقل إلى "WhatsApp Business API"</li>
            <li>اختر "API Setup"</li>
            <li>انسخ البيانات المطلوبة أدناه</li>
          </ol>
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="accessToken">
            Access Token *
            <span className="help-text">
              المفتاح الرئيسي للوصول إلى API
            </span>
          </label>
          <div className="input-with-toggle">
            <Input
              id="accessToken"
              type={showSecrets ? 'text' : 'password'}
              value={data.accessToken || ''}
              onChange={(e) => handleChange('accessToken', e.target.value)}
              placeholder="EAAxxxxxxxxxxxxxxxxxxxxx"
              error={errors.accessToken}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumberId">
            Phone Number ID *
            <span className="help-text">
              معرف رقم الهاتف في WhatsApp API
            </span>
          </label>
          <Input
            id="phoneNumberId"
            value={data.phoneNumberId || ''}
            onChange={(e) => handleChange('phoneNumberId', e.target.value)}
            placeholder="123456789012345"
            error={errors.phoneNumberId}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="webhookVerifyToken">
            Webhook Verify Token *
            <span className="help-text">
              رمز التحقق من Webhook (اختر أي نص تريده)
            </span>
          </label>
          <Input
            id="webhookVerifyToken"
            value={data.webhookVerifyToken || ''}
            onChange={(e) => handleChange('webhookVerifyToken', e.target.value)}
            placeholder="my_secure_verify_token_123"
            error={errors.webhookVerifyToken}
          />
        </div>
      </div>
      
      <div className="security-warning">
        <Alert type="warning">
          <ShieldIcon />
          <div>
            <strong>أمان البيانات:</strong>
            <p>جميع البيانات مشفرة بأمان في قاعدة البيانات</p>
          </div>
        </Alert>
      </div>
    </div>
  );
}
```

---

#### **WhatsApp Test Step** - خطوة الاختبار
```typescript
// src/components/integrations/wizard/steps/WhatsAppTestStep.tsx

export function WhatsAppTestStep({ data, onChange, validation }: WhatsAppTestStepProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  
  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'فحص الاتصال',
        test: () => testConnection(data),
      },
      {
        name: 'فحص الصلاحيات',
        test: () => testPermissions(data),
      },
      {
        name: 'فحص Webhook',
        test: () => testWebhook(data),
      },
    ];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'success',
          message: result.message,
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          message: error.message,
        }]);
      }
    }
    
    setIsTesting(false);
  };
  
  const sendTestMessage = async () => {
    if (!testPhone) {
      showError('أدخل رقم الهاتف للاختبار');
      return;
    }
    
    try {
      await sendWhatsAppMessage({
        to: testPhone,
        message: 'مرحباً! هذه رسالة اختبار من مركز الهمم 🏥',
        credentials: data,
      });
      
      showSuccess('تم إرسال الرسالة بنجاح!');
    } catch (error) {
      showError('فشل في إرسال الرسالة: ' + error.message);
    }
  };
  
  return (
    <div className="whatsapp-test-step">
      <div className="step-intro">
        <h3>اختبار الاتصال 🧪</h3>
        <p>تأكد من أن كل شيء يعمل بشكل صحيح</p>
      </div>
      
      <div className="test-section">
        <Button
          onClick={runTests}
          disabled={isTesting}
          className="test-button"
        >
          {isTesting ? (
            <>
              <LoaderIcon className="animate-spin" />
              جاري الاختبار...
            </>
          ) : (
            <>
              <PlayIcon />
              بدء الاختبار
            </>
          )}
        </Button>
        
        {testResults.length > 0 && (
          <div className="test-results">
            {testResults.map((result, index) => (
              <div key={index} className={`test-result ${result.status}`}>
                <div className="result-icon">
                  {result.status === 'success' ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <XCircleIcon className="text-red-500" />
                  )}
                </div>
                <div className="result-content">
                  <div className="result-name">{result.name}</div>
                  <div className="result-message">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="test-message-section">
        <h4>إرسال رسالة اختبار</h4>
        <p>أرسل رسالة تجريبية للتأكد من عمل النظام</p>
        
        <div className="test-message-form">
          <Input
            label="رقم الهاتف للاختبار"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+966501234567"
          />
          <Button
            onClick={sendTestMessage}
            disabled={!testPhone || isTesting}
          >
            إرسال رسالة اختبار
          </Button>
        </div>
      </div>
      
      <div className="success-message">
        <div className="success-icon">🎉</div>
        <h4>ممتاز! كل شيء جاهز</h4>
        <p>WhatsApp Business API مربوط بنجاح مع النظام</p>
      </div>
    </div>
  );
}
```

---

### 2. **SMS Gateway Wizard** - ويزرد الرسائل النصية

```typescript
// src/lib/integrations/wizards/sms-wizard.ts

export const smsWizardConfig: WizardConfig = {
  id: 'sms',
  name: 'SMS Gateway',
  description: 'ربط خدمة الرسائل النصية لإرسال SMS',
  icon: '📱',
  category: 'communication',
  allowMultiple: true, // يسمح بتكاملات متعددة
  maxInstances: 3,
  steps: [
    {
      id: 'provider-selection',
      title: 'اختيار المزود',
      description: 'اختر مزود خدمة SMS',
      icon: '🏢',
      component: SMSProviderStep,
      validation: [
        { field: 'provider', required: true, message: 'اختر مزود الخدمة' },
      ],
    },
    {
      id: 'credentials',
      title: 'بيانات الاعتماد',
      description: 'أدخل بيانات API من المزود',
      icon: '🔑',
      component: SMSCredentialsStep,
      validation: [
        { field: 'apiKey', required: true, message: 'API Key مطلوب' },
        { field: 'apiSecret', required: true, message: 'API Secret مطلوب' },
      ],
    },
    {
      id: 'sender-config',
      title: 'إعداد المرسل',
      description: 'قم بإعداد اسم المرسل والرقم',
      icon: '📤',
      component: SMSSenderStep,
      validation: [
        { field: 'senderName', required: true, message: 'اسم المرسل مطلوب' },
        { field: 'senderNumber', required: true, message: 'رقم المرسل مطلوب' },
      ],
    },
    {
      id: 'test-sms',
      title: 'اختبار SMS',
      description: 'أرسل رسالة تجريبية',
      icon: '🧪',
      component: SMSTestStep,
      validation: [],
    },
  ],
};
```

---

### 3. **Email Service Wizard** - ويزرد البريد الإلكتروني

```typescript
// src/lib/integrations/wizards/email-wizard.ts

export const emailWizardConfig: WizardConfig = {
  id: 'email',
  name: 'Email Service',
  description: 'ربط خدمة البريد الإلكتروني',
  icon: '📧',
  category: 'communication',
  allowMultiple: true,
  maxInstances: 2,
  steps: [
    {
      id: 'email-provider',
      title: 'اختيار مزود البريد',
      description: 'اختر مزود خدمة البريد الإلكتروني',
      icon: '🏢',
      component: EmailProviderStep,
      validation: [
        { field: 'provider', required: true, message: 'اختر مزود البريد' },
      ],
    },
    {
      id: 'email-credentials',
      title: 'بيانات الاعتماد',
      description: 'أدخل بيانات API',
      icon: '🔑',
      component: EmailCredentialsStep,
      validation: [
        { field: 'apiKey', required: true, message: 'API Key مطلوب' },
      ],
    },
    {
      id: 'email-settings',
      title: 'إعدادات البريد',
      description: 'قم بإعداد المرسل والقوالب',
      icon: '⚙️',
      component: EmailSettingsStep,
      validation: [
        { field: 'fromEmail', required: true, email: true, message: 'البريد المرسل مطلوب' },
        { field: 'fromName', required: true, message: 'اسم المرسل مطلوب' },
      ],
    },
    {
      id: 'email-test',
      title: 'اختبار البريد',
      description: 'أرسل بريد تجريبي',
      icon: '🧪',
      component: EmailTestStep,
      validation: [],
    },
  ],
};
```

---

## 🎨 واجهة إدارة التكاملات

### 1. **Integration Dashboard** - لوحة التحكم الرئيسية

```typescript
// src/app/(admin)/integrations/page.tsx

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [wizards, setWizards] = useState<WizardConfig[]>([]);
  
  return (
    <div className="integrations-page">
      <div className="page-header">
        <h1>إدارة التكاملات</h1>
        <p>ربط النظام مع الخدمات الخارجية</p>
      </div>
      
      {/* Quick Stats */}
      <div className="stats-grid">
        <StatCard
          title="التكاملات النشطة"
          value={integrations.filter(i => i.isActive).length}
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatCard
          title="التكاملات المتاحة"
          value={wizards.length}
          icon={<PlusIcon />}
          color="blue"
        />
        <StatCard
          title="الرسائل المرسلة اليوم"
          value={getTodayMessages()}
          icon={<MessageIcon />}
          color="purple"
        />
        <StatCard
          title="معدل النجاح"
          value={`${getSuccessRate()}%`}
          icon={<TrendingUpIcon />}
          color="orange"
        />
      </div>
      
      {/* Integration Categories */}
      <div className="integration-categories">
        <h2>فئات التكاملات</h2>
        
        <div className="categories-grid">
          <CategoryCard
            title="التواصل"
            description="WhatsApp, SMS, Email"
            icon="💬"
            count={getCategoryCount('communication')}
            onClick={() => setActiveCategory('communication')}
          />
          <CategoryCard
            title="المدفوعات"
            description="Stripe, Moyasar, PayPal"
            icon="💳"
            count={getCategoryCount('payment')}
            onClick={() => setActiveCategory('payment')}
          />
          <CategoryCard
            title="الجدولة"
            description="Google Calendar, Outlook"
            icon="📅"
            count={getCategoryCount('scheduling')}
            onClick={() => setActiveCategory('scheduling')}
          />
          <CategoryCard
            title="التحليلات"
            description="Google Analytics, Mixpanel"
            icon="📊"
            count={getCategoryCount('analytics')}
            onClick={() => setActiveCategory('analytics')}
          />
        </div>
      </div>
      
      {/* Active Integrations */}
      <div className="active-integrations">
        <h2>التكاملات النشطة</h2>
        
        <div className="integrations-list">
          {integrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={() => editIntegration(integration.id)}
              onToggle={() => toggleIntegration(integration.id)}
              onDelete={() => deleteIntegration(integration.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Add New Integration */}
      <div className="add-integration">
        <Button
          onClick={() => setShowWizardSelector(true)}
          className="add-button"
        >
          <PlusIcon />
          إضافة تكامل جديد
        </Button>
      </div>
      
      {/* Wizard Selector Modal */}
      {showWizardSelector && (
        <WizardSelectorModal
          wizards={wizards}
          onSelect={(wizardId) => startWizard(wizardId)}
          onClose={() => setShowWizardSelector(false)}
        />
      )}
    </div>
  );
}
```

---

### 2. **Integration Card** - بطاقة التكامل

```typescript
// src/components/integrations/IntegrationCard.tsx

interface IntegrationCardProps {
  integration: Integration;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function IntegrationCard({ integration, onEdit, onToggle, onDelete }: IntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleIntegration(integration.id);
      onToggle();
    } catch (error) {
      showError('فشل في تغيير الحالة');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await testIntegration(integration.id);
      showSuccess('الاختبار نجح!');
    } catch (error) {
      showError('فشل في الاختبار: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="integration-card">
      <div className="card-header">
        <div className="integration-info">
          <div className="integration-icon">
            <span className="text-2xl">{integration.icon}</span>
          </div>
          <div className="integration-details">
            <h3 className="integration-name">{integration.name}</h3>
            <p className="integration-description">{integration.description}</p>
            <div className="integration-meta">
              <span className="integration-type">{integration.type}</span>
              <span className="integration-status">
                <StatusBadge status={integration.status} />
              </span>
            </div>
          </div>
        </div>
        
        <div className="integration-actions">
          <Switch
            checked={integration.isActive}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="card-body">
        <div className="integration-stats">
          <div className="stat">
            <span className="stat-label">الرسائل المرسلة</span>
            <span className="stat-value">{integration.messagesSent}</span>
          </div>
          <div className="stat">
            <span className="stat-label">معدل النجاح</span>
            <span className="stat-value">{integration.successRate}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">آخر اختبار</span>
            <span className="stat-value">
              {formatDate(integration.lastTestAt)}
            </span>
          </div>
        </div>
        
        <div className="integration-health">
          <div className="health-indicator">
            <div className={`health-dot ${integration.healthStatus}`} />
            <span>صحة الاتصال: {integration.healthScore}%</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="action-buttons">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isLoading}
          >
            <TestTubeIcon />
            اختبار
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <EditIcon />
            تعديل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600"
          >
            <TrashIcon />
            حذف
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

## 🔧 نظام إدارة التكوينات

### 1. **Configuration Manager** - مدير التكوينات

```typescript
// src/lib/integrations/configuration-manager.ts

export class ConfigurationManager {
  private configs: Map<string, IntegrationConfig> = new Map();
  
  async loadConfigurations(): Promise<void> {
    const { data } = await supabase
      .from('integration_configs')
      .select('*')
      .eq('is_active', true);
    
    data?.forEach(config => {
      this.configs.set(config.id, config);
    });
  }
  
  getConfig(integrationId: string): IntegrationConfig | undefined {
    return this.configs.get(integrationId);
  }
  
  async saveConfig(config: IntegrationConfig): Promise<void> {
    // Encrypt sensitive data
    const encryptedConfig = await this.encryptConfig(config);
    
    const { error } = await supabase
      .from('integration_configs')
      .upsert({
        ...config,
        config: encryptedConfig,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    
    this.configs.set(config.id, config);
  }
  
  async testConfig(config: IntegrationConfig): Promise<TestResult> {
    const adapter = this.getAdapter(config.type);
    return await adapter.testConnection(config);
  }
  
  private async encryptConfig(config: IntegrationConfig): Promise<any> {
    // Use proper encryption (not Base64!)
    const encryptionKey = await this.getEncryptionKey();
    return await encrypt(JSON.stringify(config.config), encryptionKey);
  }
  
  private async decryptConfig(encryptedConfig: any): Promise<any> {
    const encryptionKey = await this.getEncryptionKey();
    return JSON.parse(await decrypt(encryptedConfig, encryptionKey));
  }
}
```

---

### 2. **Adapter Factory** - مصنع المحولات

```typescript
// src/lib/integrations/adapter-factory.ts

export class AdapterFactory {
  private adapters: Map<string, new (config: any) => IntegrationAdapter> = new Map();
  
  registerAdapter(type: string, adapterClass: new (config: any) => IntegrationAdapter): void {
    this.adapters.set(type, adapterClass);
  }
  
  createAdapter(type: string, config: any): IntegrationAdapter {
    const AdapterClass = this.adapters.get(type);
    if (!AdapterClass) {
      throw new Error(`Adapter not found for type: ${type}`);
    }
    
    return new AdapterClass(config);
  }
  
  getSupportedTypes(): string[] {
    return Array.from(this.adapters.keys());
  }
}

// Register all adapters
const adapterFactory = new AdapterFactory();

adapterFactory.registerAdapter('whatsapp', WhatsAppAdapter);
adapterFactory.registerAdapter('sms_twilio', TwilioSMSAdapter);
adapterFactory.registerAdapter('sms_moyasar', MoyasarSMSAdapter);
adapterFactory.registerAdapter('email_sendgrid', SendGridEmailAdapter);
adapterFactory.registerAdapter('email_ses', SESEmailAdapter);
adapterFactory.registerAdapter('calendar_google', GoogleCalendarAdapter);
adapterFactory.registerAdapter('calendar_outlook', OutlookCalendarAdapter);
adapterFactory.registerAdapter('analytics_google', GoogleAnalyticsAdapter);
adapterFactory.registerAdapter('analytics_mixpanel', MixpanelAdapter);
```

---

## 📊 مراقبة الأداء والتحليلات

### 1. **Integration Analytics** - تحليلات التكاملات

```typescript
// src/lib/integrations/analytics.ts

export class IntegrationAnalytics {
  async getIntegrationStats(integrationId: string, period: string): Promise<IntegrationStats> {
    const { data } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('integration_id', integrationId)
      .gte('created_at', this.getPeriodStart(period));
    
    return {
      totalRequests: data.length,
      successfulRequests: data.filter(log => log.status === 'success').length,
      failedRequests: data.filter(log => log.status === 'failed').length,
      averageResponseTime: this.calculateAverageResponseTime(data),
      successRate: this.calculateSuccessRate(data),
      errorBreakdown: this.getErrorBreakdown(data),
      hourlyDistribution: this.getHourlyDistribution(data),
    };
  }
  
  async getProviderComparison(): Promise<ProviderComparison[]> {
    const providers = await this.getAllProviders();
    
    return providers.map(provider => ({
      name: provider.name,
      type: provider.type,
      successRate: provider.successRate,
      averageResponseTime: provider.averageResponseTime,
      totalRequests: provider.totalRequests,
      cost: provider.estimatedCost,
    }));
  }
  
  async getUsageTrends(period: string): Promise<UsageTrend[]> {
    // Implementation for usage trends
  }
}
```

---

### 2. **Real-time Monitoring** - المراقبة الفورية

```typescript
// src/components/integrations/IntegrationMonitor.tsx

export function IntegrationMonitor() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    // Real-time updates
    const interval = setInterval(async () => {
      await updateIntegrationStatus();
      await checkForAlerts();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="integration-monitor">
      <h2>مراقبة التكاملات</h2>
      
      {/* Health Status */}
      <div className="health-grid">
        {integrations.map(integration => (
          <HealthCard
            key={integration.id}
            integration={integration}
            onAlert={(alert) => setAlerts(prev => [...prev, alert])}
          />
        ))}
      </div>
      
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>التنبيهات</h3>
          {alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 خطة التنفيذ

### المرحلة 1: البنية التحتية (أسبوع 1-2)
- [ ] إنشاء Wizard Engine
- [ ] بناء مكونات الويزرد الأساسية
- [ ] نظام إدارة التكوينات
- [ ] Adapter Factory

### المرحلة 2: التكاملات الأساسية (أسبوع 3-4)
- [ ] WhatsApp Wizard
- [ ] SMS Wizard (Twilio)
- [ ] Email Wizard (SendGrid)
- [ ] واجهة إدارة التكاملات

### المرحلة 3: التكاملات المتقدمة (أسبوع 5-6)
- [ ] Google Calendar Wizard
- [ ] Analytics Wizards
- [ ] Payment Wizards
- [ ] مراقبة الأداء

### المرحلة 4: التحسينات (أسبوع 7-8)
- [ ] AI-powered suggestions
- [ ] Advanced testing
- [ ] Performance optimization
- [ ] Mobile optimization

**المجموع: 8 أسابيع**

---

## 💰 التكلفة المتوقعة

| البند | التكلفة الشهرية |
|------|-----------------|
| WhatsApp Business API | $0-50 |
| Twilio SMS | $20-100 |
| SendGrid Email | $15-50 |
| Google Calendar API | $0 |
| Analytics APIs | $0-30 |
| **المجموع** | **$35-230/شهر** |

---

## 🎯 النتائج المتوقعة

### بعد التنفيذ الكامل:
- ✅ **سهولة الإعداد**: من 30 دقيقة إلى 5 دقائق
- ✅ **تقليل الأخطاء**: من 25% إلى أقل من 5%
- ✅ **رضا المستخدمين**: 95%+
- ✅ **أتمتة 90%** من عمليات الإعداد
- ✅ **تجربة مستخدم ممتعة** ومحفزة

---

*تم إعداد هذا التقرير بتاريخ: 2025-01-17*  
*الحالة: جاهز للتنفيذ الفوري*  
*الأولوية: 🔴 عالية*

