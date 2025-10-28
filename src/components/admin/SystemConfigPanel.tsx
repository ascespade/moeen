'use client';
import { useSystemConfig } from '@/lib/config/system-config';
import { useT } from '@/components/providers/I18nProvider';
import { useState } from 'react';

export default function SystemConfigPanel() {
  const { config, toggleModule, toggleAIFeature } = useSystemConfig();
  const { t } = useT();
  const [activeTab, setActiveTab] = useState<'modules' | 'ai' | 'security' | 'automation'>('modules');

  const tabs = [
    { id: 'modules', label: t('admin.modules'), icon: '📋' },
    { id: 'ai', label: t('admin.aiFeatures'), icon: '🤖' },
    { id: 'security', label: t('admin.security'), icon: '🔒' },
    { id: 'automation', label: t('admin.automation'), icon: '⚙️' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.systemConfiguration')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('admin.systemConfigurationDescription')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.healthcareModules')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(config.modules).map(([moduleName, moduleConfig]) => (
              <div
                key={moduleName}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {t(`modules.${moduleName}`)}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={moduleConfig.enabled}
                      onChange={(e) => toggleModule(moduleName, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  {moduleConfig.features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Features Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.aiFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(config.ai_features).map(([featureName, featureConfig]) => (
              <div
                key={featureName}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {featureName === 'chatbot' && '💬'}
                      {featureName === 'ai_agent' && '🤖'}
                      {featureName === 'flow_studio' && '🎨'}
                      {featureName === 'voice_bot' && '🎤'}
                      {featureName === 'emotion_analytics' && '📊'}
                      {featureName === 'early_diagnosis' && '🔍'}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                      {t(`ai.${featureName}`)}
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featureConfig.enabled}
                      onChange={(e) => toggleAIFeature(featureName, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {featureConfig.purpose && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {featureConfig.purpose}
                  </p>
                )}

                {featureConfig.capabilities && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('admin.capabilities')}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {featureConfig.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {featureConfig.integrations && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('admin.integrations')}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {featureConfig.integrations.map((integration, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.securitySettings')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              {Object.entries(config.security).map(([setting, enabled]) => (
                <div key={setting} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                      {t(`security.${setting}`)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t(`security.${setting}Description`)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {enabled ? t('common.enabled') : t('common.disabled')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.automationSettings')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              {t('admin.scheduledJobs')}
            </h3>
            <div className="space-y-3">
              {config.automation.cron_jobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <span className="text-gray-900 dark:text-white">{job}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.active')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
