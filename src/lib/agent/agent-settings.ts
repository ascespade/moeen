/**
 * Agent Settings System - نظام إعدادات الوكيل
 * Real-time agent rules and design guidelines enforcement
 */

export interface DesignGuideline {
  description: string;
  rules: string[];
}

export interface AgentRule {
  ruleType: string;
  action: 'enforce' | 'monitor' | 'autoAdjust' | 'autoCorrect' | 'monitorNewComponents' | 'generate';
  description: string;
  target?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface AgentSettings {
  agentSettings: {
    mode: 'real-time';
    designGuidelines: {
      modernDesign: DesignGuideline;
    };
    strictProjectRules: {
      description: string;
      rules: AgentRule[];
    };
  };
}

// Default agent settings based on your JSON
export const defaultAgentSettings: AgentSettings = {
  agentSettings: {
    mode: 'real-time',
    designGuidelines: {
      modernDesign: {
        description:
          'اليجنت ينشئ التصميم بأسلوب عصري، خطوط نظيفة، ألوان متناغمة، تباين واضح، تدرجات وظلال محسوبة، واجهات متجاوبة وانسيابية في التفاعل، يدعم الوضع الفاتح والداكن دون المساس بالألوان الأساسية.',
        rules: [
          'استخدام نظام ألوان مركزي مع الحفاظ على Primary & Secondary Colors.',
          'تطبيق التدرجات والظلال الذكية للمكونات الثانوية فقط.',
          'ضمان تباين نصوص وأيقونات وأزرار لا يقل عن معيار WCAG AA.',
          'تجنب الألوان غير عصرية أو غير موجودة في لوحة الألوان المركزية.',
          'تصميم متجاوب لجميع الأجهزة.',
          'تحسين شكل المكونات الجديدة لتتماشى مع أحدث الصيحات والتناسق العام.',
        ],
      },
    },
    strictProjectRules: {
      description: 'قواعد صارمة لا يمكن كسرها لضمان سلامة المشروع وجودة التصميم.',
      rules: [
        {
          ruleType: 'noFakeData',
          action: 'enforce',
          description:
            'ممنوع استخدام بيانات وهمية، هاردكود، موك أو محاكاة. جميع البيانات تأتي من قواعد البيانات الحقيقية.',
          severity: 'error',
        },
        {
          ruleType: 'preservePrimaryColors',
          action: 'enforce',
          description:
            'ممنوع تغيير الألوان الأساسية للنظام. فقط المكونات الثانوية يمكن تعديل ألوانها حسب التباين.',
          severity: 'error',
        },
        {
          ruleType: 'linkIntegrity',
          action: 'enforce',
          description:
            'ممنوع ترك أي زر أو رابط غير مرتبط بشكل صحيح. أي محاولة لترك رابط فارغ تُرفض تلقائيًا.',
          severity: 'error',
        },
        {
          ruleType: 'noDuplicateFiles',
          action: 'enforce',
          description:
            'ممنوع إنشاء ملفات أو مكونات مكررة. يجب تعديل الموجود أو إنشاء ملف جديد إذا لم يكن موجود.',
          severity: 'error',
        },
        {
          ruleType: 'preCheckExistence',
          action: 'enforce',
          description:
            'التحقق قبل إنشاء أي مكون أو صفحة جديدة من عدم وجوده مسبقًا في النظام.',
          severity: 'error',
        },
        {
          ruleType: 'enforceCompliance',
          action: 'monitor',
          description:
            'أي مخالفة للقواعد أعلاه ستوقف التنفيذ وتظهر تحذير فوري.',
          severity: 'error',
        },
        {
          ruleType: 'accessibilityCheck',
          action: 'autoAdjust',
          description:
            'ضمان أن جميع المكونات متوافقة مع معايير الوصول WCAG (تباين، حجم نص، ألوان، إرشادات قراءة الشاشة).',
          severity: 'warning',
        },
        {
          ruleType: 'themeCompatibility',
          action: 'autoAdjust',
          description:
            'ضمان توافق كل المكونات مع الوضع الفاتح والداكن ديناميكيًا، مع الحفاظ على الألوان الأساسية والتباين.',
          severity: 'warning',
        },
        {
          ruleType: 'preventDesignBreak',
          action: 'enforce',
          description:
            'أي تعديل قد يفسد انسجام المكونات أو شكل النظام العصري يتم منعه تلقائيًا.',
          severity: 'error',
        },
        {
          ruleType: 'gradientAndShadowSafety',
          action: 'autoAdjust',
          description:
            'تعديل التدرجات والظلال للمكونات الثانوية فقط، مع الحفاظ على المظهر العصري ومنع أي تشويه.',
          severity: 'warning',
        },
        {
          ruleType: 'realTimeMonitoring',
          action: 'monitorNewComponents',
          description:
            'مراقبة أي مكون جديد أو معدل فور إضافته، وضبط الألوان الثانوية والتباين لحظيًا دون التأثير على الألوان الأساسية.',
          severity: 'info',
        },
        {
          ruleType: 'report',
          action: 'generate',
          description:
            'تقرير لحظي عن أي تعديل أو مخالفة للقواعد، مع التأكيد على أن الألوان الأساسية لم تتغير.',
          severity: 'info',
        },
        {
          ruleType: 'proactiveCorrection',
          action: 'autoCorrect',
          description:
            'تصحيح أي تعديل قد يؤدي لخرق قواعد التصميم أو التناسق بشكل فوري قبل تطبيقه.',
          severity: 'warning',
        },
        {
          ruleType: 'centralizedPaletteEnforcement',
          action: 'enforce',
          description:
            'جميع المكونات الجديدة أو المعدلة تستخدم فقط الألوان من لوحة الألوان المركزية المعتمدة.',
          severity: 'error',
        },
      ],
    },
  },
};

/**
 * Load agent settings from localStorage or return defaults
 */
export function loadAgentSettings(): AgentSettings {
  if (typeof window === 'undefined') {
    return defaultAgentSettings;
  }

  try {
    const saved = localStorage.getItem('agent_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultAgentSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load agent settings:', error);
  }

  return defaultAgentSettings;
}

/**
 * Save agent settings to localStorage
 */
export function saveAgentSettings(settings: AgentSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('agent_settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save agent settings:', error);
  }
}

/**
 * Check if a rule should be enforced
 */
export function shouldEnforceRule(ruleType: string): boolean {
  const settings = loadAgentSettings();
  const rule = settings.agentSettings.strictProjectRules.rules.find(
    (r) => r.ruleType === ruleType
  );
  return rule?.action === 'enforce' || rule?.action === 'autoCorrect';
}

/**
 * Get rule severity
 */
export function getRuleSeverity(ruleType: string): 'error' | 'warning' | 'info' {
  const settings = loadAgentSettings();
  const rule = settings.agentSettings.strictProjectRules.rules.find(
    (r) => r.ruleType === ruleType
  );
  return rule?.severity || 'warning';
}

/**
 * Get all enforced rules
 */
export function getEnforcedRules(): AgentRule[] {
  const settings = loadAgentSettings();
  return settings.agentSettings.strictProjectRules.rules.filter(
    (r) => r.action === 'enforce' || r.action === 'autoCorrect'
  );
}

/**
 * Validate against agent rules
 */
export interface RuleViolation {
  ruleType: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  description: string;
}

export function validateAgainstRules(
  context: {
    componentName?: string;
    hasFakeData?: boolean;
    primaryColorChanged?: boolean;
    hasEmptyLinks?: boolean;
    isDuplicate?: boolean;
    accessibilityIssues?: string[];
    themeIssues?: string[];
    usesNonPaletteColors?: boolean;
  }
): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const settings = loadAgentSettings();

  // Check noFakeData rule
  if (context.hasFakeData && shouldEnforceRule('noFakeData')) {
    violations.push({
      ruleType: 'noFakeData',
      severity: getRuleSeverity('noFakeData'),
      message: 'ممنوع استخدام بيانات وهمية',
      description: 'جميع البيانات يجب أن تأتي من قواعد البيانات الحقيقية.',
    });
  }

  // Check preservePrimaryColors rule
  if (context.primaryColorChanged && shouldEnforceRule('preservePrimaryColors')) {
    violations.push({
      ruleType: 'preservePrimaryColors',
      severity: getRuleSeverity('preservePrimaryColors'),
      message: 'ممنوع تغيير الألوان الأساسية',
      description: 'الألوان الأساسية للنظام محمية ولا يمكن تغييرها.',
    });
  }

  // Check linkIntegrity rule
  if (context.hasEmptyLinks && shouldEnforceRule('linkIntegrity')) {
    violations.push({
      ruleType: 'linkIntegrity',
      severity: getRuleSeverity('linkIntegrity'),
      message: 'أزرار أو روابط غير مرتبطة',
      description: 'جميع الأزرار والروابط يجب أن تكون مرتبطة بشكل صحيح.',
    });
  }

  // Check noDuplicateFiles rule
  if (context.isDuplicate && shouldEnforceRule('noDuplicateFiles')) {
    violations.push({
      ruleType: 'noDuplicateFiles',
      severity: getRuleSeverity('noDuplicateFiles'),
      message: 'ملف أو مكون مكرر',
      description: 'ممنوع إنشاء ملفات أو مكونات مكررة.',
    });
  }

  // Check accessibility issues
  if (context.accessibilityIssues && context.accessibilityIssues.length > 0) {
    const rule = settings.agentSettings.strictProjectRules.rules.find(
      (r) => r.ruleType === 'accessibilityCheck'
    );
    if (rule) {
      violations.push({
        ruleType: 'accessibilityCheck',
        severity: getRuleSeverity('accessibilityCheck'),
        message: 'مشاكل في إمكانية الوصول',
        description: `المشاكل: ${context.accessibilityIssues.join(', ')}`,
      });
    }
  }

  // Check centralized palette
  if (context.usesNonPaletteColors && shouldEnforceRule('centralizedPaletteEnforcement')) {
    violations.push({
      ruleType: 'centralizedPaletteEnforcement',
      severity: getRuleSeverity('centralizedPaletteEnforcement'),
      message: 'استخدام ألوان غير معتمدة',
      description: 'جميع الألوان يجب أن تكون من لوحة الألوان المركزية.',
    });
  }

  return violations;
}

