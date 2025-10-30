'use client';

import { RouteGuard } from '@/components/admin/RouteGuard';
import { AdminCard, AdminHeader } from '@/components/admin/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
    Bell,
    Brain,
    Building2,
    Package,
    RefreshCw,
    Save,
    Settings as SettingsIcon,
    Shield,
    Zap
} from 'lucide-react';
import { useState } from 'react';

// Import settings components (to be created)
import AISettings from '@/components/admin/settings/AISettings';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import IntegrationSettings from '@/components/admin/settings/IntegrationSettings';
import ModuleSettings from '@/components/admin/settings/ModuleSettings';
import NotificationSettings from '@/components/admin/settings/NotificationSettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';

type SettingsTab = 'general' | 'modules' | 'ai' | 'security' | 'integrations' | 'notifications';

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
  adminOnly?: boolean;
}

const settingsTabs: TabConfig[] = [
  {
    id: 'general',
    label: 'الإعدادات العامة',
    icon: <Building2 className='w-5 h-5' />,
    description: 'معلومات المركز والإعدادات الأساسية',
  },
  {
    id: 'modules',
    label: 'إعدادات المودولات',
    icon: <Package className='w-5 h-5' />,
    description: 'تفعيل وإعداد مودولات النظام',
  },
  {
    id: 'ai',
    label: 'الذكاء الاصطناعي',
    icon: <Brain className='w-5 h-5' />,
    description: 'إعدادات الشات بوت والأتمتة الذكية',
  },
  {
    id: 'security',
    label: 'الأمان',
    icon: <Shield className='w-5 h-5' />,
    description: 'إعدادات الأمان وصلاحيات الوصول',
    adminOnly: true,
  },
  {
    id: 'integrations',
    label: 'التكاملات',
    icon: <Zap className='w-5 h-5' />,
    description: 'ربط الخدمات الخارجية والتكاملات',
    adminOnly: true,
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    icon: <Bell className='w-5 h-5' />,
    description: 'قوالب الرسائل وإعدادات الإشعارات',
  },
];

function AdminSettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // TODO: Add user role check
  const userRole = 'admin'; // Will be replaced with actual user role

  const visibleTabs = settingsTabs.filter(tab => 
    !tab.adminOnly || userRole === 'admin'
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get the current settings component data
      // This would ideally be done through a ref or context, but for now we'll use a simpler approach
      const apiEndpoints: Record<SettingsTab, string> = {
        general: '/api/admin/settings/general',
        modules: '/api/admin/settings/modules',
        ai: '/api/admin/settings/ai',
        security: '/api/admin/settings/security',
        integrations: '/api/admin/settings/integrations',
        notifications: '/api/admin/settings/notifications'
      };

      // The actual save logic should be handled by each settings component
      // This is a placeholder that will be enhanced when we add state management
      const response = await fetch(apiEndpoints[activeTab], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Settings components will handle their own data
      });

      if (response.ok) {
        setHasChanges(false);
        setLastSaved(new Date());
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tab: SettingsTab) => {
    if (hasChanges) {
      const confirmLeave = confirm('لديك تغييرات غير محفوظة. هل تريد المتابعة بدون حفظ؟');
      if (!confirmLeave) return;
    }
    setActiveTab(tab);
    setHasChanges(false);
  };

  const renderTabContent = () => {
    const commonProps = {
      onChange: () => setHasChanges(true)
    };

    switch (activeTab) {
      case 'general':
        return <GeneralSettings {...commonProps} />;
      case 'modules':
        return <ModuleSettings {...commonProps} />;
      case 'ai':
        return <AISettings {...commonProps} />;
      case 'security':
        return <SecuritySettings {...commonProps} />;
      case 'integrations':
        return <IntegrationSettings {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      {/* Header with Save Actions */}
      <AdminHeader
        title="إعدادات النظام"
        description="إدارة وتخصيص إعدادات مركز الهمم"
      >
        {lastSaved && (
          <div className='text-sm text-[var(--text-secondary)] flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            آخر حفظ: {lastSaved.toLocaleTimeString('ar-SA')}
          </div>
        )}
        
        <Button 
          variant='outline' 
          className='border-[var(--brand-border)] hover:bg-[var(--brand-primary)]/5'
          disabled={isSaving}
        >
          <RefreshCw className='w-4 h-4 ml-2' />
          إعادة تعيين
        </Button>
        
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={cn(
            'transition-all duration-300',
            hasChanges 
              ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white animate-pulse' 
              : 'bg-[color-mix(in_srgb,var(--text-muted)_20%,transparent)] text-[var(--text-muted)] cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <RefreshCw className='w-4 h-4 ml-2 animate-spin' />
          ) : (
            <Save className='w-4 h-4 ml-2' />
          )}
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </AdminHeader>

      <main className='container-app py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Settings Navigation */}
          <div className='lg:col-span-1'>
            <AdminCard className='p-0 overflow-hidden'>
              <div className='p-6 bg-gradient-to-r from-[var(--brand-primary)]/5 to-transparent border-b border-[var(--brand-border)]'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center'>
                    <SettingsIcon className='w-5 h-5 text-[var(--brand-primary)]' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-[var(--text-primary)]'>أقسام الإعدادات</h3>
                    <p className='text-sm text-[var(--text-secondary)]'>اختر القسم للتعديل</p>
                  </div>
                </div>
              </div>
              
              <nav className='p-2'>
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'w-full text-right p-4 rounded-xl mb-2 transition-all duration-200 group',
                      'hover:bg-[var(--brand-primary)]/5 hover:border-[var(--brand-primary)]/20',
                      activeTab === tab.id
                        ? 'bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 shadow-sm'
                        : 'border border-transparent'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <div className={cn(
                        'transition-colors duration-200',
                        activeTab === tab.id 
                          ? 'text-[var(--brand-primary)]' 
                          : 'text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]'
                      )}>
                        {tab.icon}
                      </div>
                      <div className='text-right'>
                        <div className={cn(
                          'font-medium transition-colors duration-200',
                          activeTab === tab.id 
                            ? 'text-[var(--brand-primary)]' 
                            : 'text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]'
                        )}>
                          {tab.label}
                        </div>
                        <div className='text-sm text-[var(--text-secondary)] mt-1'>
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </AdminCard>
          </div>

          {/* Settings Content */}
          <div className='lg:col-span-3'>
            <AdminCard className='min-h-[600px]'>
              {/* Tab Content Header */}
              <div className='flex items-center gap-4 mb-8 pb-6 border-b border-[var(--brand-border)]'>
                <div className='w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center'>
                  {visibleTabs.find(tab => tab.id === activeTab)?.icon}
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
                    {visibleTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <p className='text-[var(--text-secondary)]'>
                    {visibleTabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
              </div>

              {/* Settings Content */}
              <div className='animate-fadeInUp'>
                {renderTabContent()}
              </div>

              {/* Save Banner */}
              {hasChanges && (
                <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
                  <div className='bg-[var(--panel)] border border-[var(--brand-border)] rounded-xl shadow-2xl p-4 flex items-center gap-4 animate-fadeInUp'>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full animate-pulse'></div>
                    <span className='text-[var(--text-primary)] font-medium'>
                      لديك تغييرات غير محفوظة
                    </span>
                    <div className='flex gap-2'>
                      <Button 
                        variant='outline' 
                        size='sm'
                        onClick={() => setHasChanges(false)}
                        className='border-[var(--brand-border)]'
                      >
                        تراجع
                      </Button>
                      <Button 
                        onClick={handleSave}
                        size='sm'
                        disabled={isSaving}
                        className='bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white'
                      >
                        {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </AdminCard>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <RouteGuard
      requiredRoles={['admin', 'manager']}
      requiredPermissions={['settings:view']}
    >
      <AdminSettingsPageContent />
    </RouteGuard>
  );
}
