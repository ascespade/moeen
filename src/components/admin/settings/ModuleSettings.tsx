'use client';

import { AdminCard } from '@/components/admin/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    DollarSign,
    FileText,
    Package,
    RefreshCw,
    Settings as SettingsIcon,
    Shield,
    User,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModuleConfig {
  enabled: boolean;
  features: string[];
  settings?: Record<string, any>;
}

interface ModulesState {
  reception: ModuleConfig;
  doctor: ModuleConfig;
  patient: ModuleConfig;
  therapy: ModuleConfig;
  emr: ModuleConfig;
  finance: ModuleConfig;
  admin: ModuleConfig;
  settings: ModuleConfig;
}

interface ModuleSettingsProps {
  onChange: () => void;
}

const defaultModules: ModulesState = {
  reception: {
    enabled: true,
    features: ['Patient check-in', 'Appointment scheduling', 'Visitor tracking'],
    settings: {
      autoCheckIn: true,
      queueManagement: true,
      smsNotifications: true
    }
  },
  doctor: {
    enabled: true,
    features: ['View patient list', 'Manage schedule', 'Prescribe treatments', 'Add notes'],
    settings: {
      appointmentReminders: true,
      patientHistory: true,
      prescriptionTemplates: true
    }
  },
  patient: {
    enabled: true,
    features: ['Profile management', 'Appointment requests', 'Medical history view', 'Receive reminders'],
    settings: {
      selfBooking: true,
      historyAccess: true,
      reminderPreferences: true
    }
  },
  therapy: {
    enabled: true,
    features: ['Treatment plans', 'Progress tracking', 'Session management'],
    settings: {
      progressReports: true,
      exerciseLibrary: true,
      outcomeTracking: true
    }
  },
  emr: {
    enabled: true,
    features: ['Medical records', 'Lab results', 'Imaging reports', 'Document storage'],
    settings: {
      autoBackup: true,
      encryptionLevel: 'high',
      retentionPeriod: '7 years'
    }
  },
  finance: {
    enabled: true,
    features: ['Payments', 'Insurance claims', 'Billing', 'Financial reports'],
    settings: {
      autoInvoicing: true,
      paymentReminders: true,
      insuranceIntegration: true
    }
  },
  admin: {
    enabled: true,
    features: ['User management', 'Audit logs', 'Reports', 'System monitoring'],
    settings: {
      auditLevel: 'detailed',
      reportScheduling: true,
      systemAlerts: true
    }
  },
  settings: {
    enabled: true,
    features: ['Theme switcher', 'Language switcher', 'RTL/LTR toggle', 'System cleaning'],
    settings: {
      themeCustomization: true,
      multiLanguage: true,
      systemMaintenance: true
    }
  }
};

const moduleConfigs = [
  {
    key: 'reception' as keyof ModulesState,
    name: 'الاستقبال',
    description: 'إدارة استقبال المرضى وتسجيل الدخول',
    icon: Users,
    color: '#3b82f6',
    category: 'core'
  },
  {
    key: 'doctor' as keyof ModulesState,
    name: 'الأطباء',
    description: 'نظام إدارة الأطباء والمواعيد',
    icon: UserCheck,
    color: '#10b981',
    category: 'healthcare'
  },
  {
    key: 'patient' as keyof ModulesState,
    name: 'المرضى',
    description: 'إدارة ملفات المرضى والحجوزات',
    icon: User,
    color: '#8b5cf6',
    category: 'healthcare'
  },
  {
    key: 'therapy' as keyof ModulesState,
    name: 'العلاج',
    description: 'خطط العلاج وتتبع التقدم',
    icon: Activity,
    color: '#f59e0b',
    category: 'healthcare'
  },
  {
    key: 'emr' as keyof ModulesState,
    name: 'السجلات الطبية',
    description: 'نظام السجلات الطبية الإلكترونية',
    icon: FileText,
    color: '#06b6d4',
    category: 'healthcare'
  },
  {
    key: 'finance' as keyof ModulesState,
    name: 'المالية',
    description: 'المدفوعات والفوترة والتأمين',
    icon: DollarSign,
    color: '#ef4444',
    category: 'business'
  },
  {
    key: 'admin' as keyof ModulesState,
    name: 'الإدارة',
    description: 'إدارة النظام والمستخدمين',
    icon: Shield,
    color: '#dc2626',
    category: 'system'
  },
  {
    key: 'settings' as keyof ModulesState,
    name: 'الإعدادات',
    description: 'إعدادات النظام والتخصيص',
    icon: SettingsIcon,
    color: '#64748b',
    category: 'system'
  }
];

const categories = {
  core: { name: 'الأساسية', description: 'المودولات الأساسية للنظام' },
  healthcare: { name: 'الرعاية الصحية', description: 'مودولات الخدمات الطبية' },
  business: { name: 'الأعمال', description: 'مودولات إدارة الأعمال' },
  system: { name: 'النظام', description: 'مودولات النظام والتحكم' }
};

export default function ModuleSettings({ onChange }: ModuleSettingsProps) {
  const [modules, setModules] = useState<ModulesState>(defaultModules);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModuleSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings/modules');
        const result = await response.json();
        
        if (result.success && result.data) {
          setModules(prev => ({ ...prev, ...result.data }));
        }
      } catch (error) {
        console.error('Error loading module settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModuleSettings();
  }, []);

  const toggleModule = (moduleKey: keyof ModulesState) => {
    setModules(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        enabled: !prev[moduleKey].enabled
      }
    }));
    onChange();
  };

  const updateModuleSettings = (moduleKey: keyof ModulesState, settings: Record<string, any>) => {
    setModules(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        settings: { ...prev[moduleKey].settings, ...settings }
      }
    }));
    onChange();
  };

  const getEnabledModulesCount = () => {
    return Object.values(modules).filter(module => module.enabled).length;
  };

  const getCategoryModules = (category: string) => {
    return moduleConfigs.filter(config => config.category === category);
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-32 bg-[var(--brand-surface)] rounded-lg animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Module Status Overview */}
      <AdminCard className='bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent border border-[var(--brand-primary)]/20'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center'>
              <CheckCircle className='w-8 h-8 text-[var(--brand-primary)]' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-[var(--text-primary)]'>
                {getEnabledModulesCount()} من {moduleConfigs.length} مودول نشط
              </h3>
              <p className='text-[var(--text-secondary)]'>
                النظام يعمل بكامل طاقته مع جميع المودولات الأساسية
              </p>
            </div>
          </div>
          
          <div className='flex gap-2'>
            <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
              {getEnabledModulesCount()} نشط
            </Badge>
            <Badge variant='outline' className='bg-gray-50 text-gray-700 border-gray-200'>
              {moduleConfigs.length - getEnabledModulesCount()} متوقف
            </Badge>
          </div>
        </div>
      </AdminCard>

      {/* Modules by Category */}
      {Object.entries(categories).map(([categoryKey, category]) => (
        <AdminCard key={categoryKey} className='space-y-6'>
          <div className='flex items-center gap-3 pb-4 border-b border-[var(--brand-border)]'>
            <div className='w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center'>
              <Package className='w-4 h-4 text-[var(--brand-primary)]' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-[var(--text-primary)]'>{category.name}</h3>
              <p className='text-sm text-[var(--text-secondary)]'>{category.description}</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {getCategoryModules(categoryKey).map((moduleConfig) => {
              const module = modules[moduleConfig.key];
              const Icon = moduleConfig.icon;
              
              return (
                <div
                  key={moduleConfig.key}
                  className={cn(
                    'p-6 rounded-xl border transition-all duration-200',
                    module.enabled
                      ? 'border-green-200 bg-green-50/50 shadow-sm'
                      : 'border-[var(--brand-border)] bg-[var(--panel)]'
                  )}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className='w-10 h-10 rounded-xl flex items-center justify-center'
                        style={{
                          backgroundColor: `${moduleConfig.color}15`,
                          border: `1px solid ${moduleConfig.color}30`
                        }}
                      >
                        <Icon className='w-5 h-5' style={{ color: moduleConfig.color }} />
                      </div>
                      <div>
                        <h4 className='font-semibold text-[var(--text-primary)]'>{moduleConfig.name}</h4>
                        <p className='text-sm text-[var(--text-secondary)]'>{moduleConfig.description}</p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(moduleConfig.key)}
                    />
                  </div>

                  {/* Features List */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium text-[var(--text-secondary)]'>الميزات المتاحة:</Label>
                    <div className='space-y-1'>
                      {module.features.map((feature, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            'flex items-center gap-2 text-sm p-2 rounded-lg transition-colors',
                            module.enabled 
                              ? 'text-green-700 bg-green-50' 
                              : 'text-gray-500 bg-gray-50'
                          )}
                        >
                          {module.enabled ? (
                            <CheckCircle className='w-3 h-3 text-green-500' />
                          ) : (
                            <AlertTriangle className='w-3 h-3 text-gray-400' />
                          )}
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Module Status */}
                  <div className='mt-4 pt-4 border-t border-[var(--brand-border)]/50'>
                    <Badge 
                      variant={module.enabled ? 'default' : 'outline'}
                      className={module.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                    >
                      {module.enabled ? 'نشط' : 'متوقف'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      ))}

      {/* Dependency Warning */}
      <AdminCard className='bg-yellow-50 border-yellow-200'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='w-6 h-6 text-yellow-600 flex-shrink-0 mt-1' />
          <div>
            <h4 className='font-semibold text-yellow-800 mb-2'>تنبيه المودولات</h4>
            <div className='text-sm text-yellow-700 space-y-1'>
              <p>• إيقاف مودول المرضى سيؤثر على مودولات الأطباء والعلاج</p>
              <p>• إيقاف مودول المالية سيؤثر على التقارير المالية</p>
              <p>• بعض المودولات مترابطة ولا يمكن إيقافها منفردة</p>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Quick Actions */}
      <AdminCard className='space-y-4'>
        <h4 className='font-semibold text-[var(--text-primary)] flex items-center gap-2'>
          <SettingsIcon className='w-5 h-5' />
          إجراءات سريعة
        </h4>
        
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Button
            variant='outline'
            onClick={() => {
              Object.keys(modules).forEach(key => {
                setModules(prev => ({
                  ...prev,
                  [key]: { ...prev[key as keyof ModulesState], enabled: true }
                }));
              });
              onChange();
            }}
            className='h-20 flex-col border-green-200 hover:bg-green-50'
          >
            <CheckCircle className='w-6 h-6 text-green-600 mb-2' />
            <span className='text-sm'>تفعيل الكل</span>
          </Button>

          <Button
            variant='outline'
            onClick={() => {
              ['finance', 'admin', 'settings'].forEach(key => {
                setModules(prev => ({
                  ...prev,
                  [key]: { ...prev[key as keyof ModulesState], enabled: false }
                }));
              });
              onChange();
            }}
            className='h-20 flex-col border-yellow-200 hover:bg-yellow-50'
          >
            <AlertTriangle className='w-6 h-6 text-yellow-600 mb-2' />
            <span className='text-sm'>الأساسية فقط</span>
          </Button>

          <Button
            variant='outline'
            onClick={() => setModules(defaultModules)}
            className='h-20 flex-col border-blue-200 hover:bg-blue-50'
          >
            <RefreshCw className='w-6 h-6 text-blue-600 mb-2' />
            <span className='text-sm'>إعادة تعيين</span>
          </Button>

          <Button
            variant='outline'
            onClick={async () => {
              const response = await fetch('/api/admin/settings/modules/backup', {
                method: 'POST'
              });
              // TODO: Handle backup creation
            }}
            className='h-20 flex-col border-purple-200 hover:bg-purple-50'
          >
            <Shield className='w-6 h-6 text-purple-600 mb-2' />
            <span className='text-sm'>نسخ احتياطي</span>
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}

