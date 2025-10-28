import { useState, useEffect, useCallback } from 'react';

// System configuration types and utilities
export interface SystemConfig {
  modules: {
    [key: string]: {
      enabled: boolean;
      features: string[];
    };
  };
  ai_features: {
    chatbot: {
      enabled: boolean;
      integrations: string[];
      capabilities: string[];
      dynamic_flows: boolean;
      learns_from_interactions: boolean;
      purpose?: string;
    };
    ai_agent: {
      enabled: boolean;
      per_user_role: boolean;
      scope_restriction: string;
      capabilities: string[];
      purpose?: string;
    };
    flow_studio: {
      enabled: boolean;
      purpose: string;
      access: string;
      features: string[];
      capabilities?: string[];
    };
    voice_bot: {
      enabled: boolean;
      purpose: string;
      integrations: string[];
      features: string[];
      capabilities?: string[];
    };
    emotion_analytics: {
      enabled: boolean;
      purpose: string;
      dashboard_access: string[];
      metrics: string[];
      capabilities?: string[];
    };
    early_diagnosis: {
      enabled: boolean;
      purpose: string;
      capabilities?: string[];
    };
  };
  security: {
    encryption: boolean;
    audit_logs: boolean;
    role_based_access: boolean;
  };
  automation: {
    cron_jobs: string[];
  };
  translation: {
    enabled: boolean;
    dynamic_update: boolean;
    no_hardcoded_text: boolean;
  };
  reports: {
    weekly_learning_report_to_admin: boolean;
  };
}

// Default system configuration
export const defaultSystemConfig: SystemConfig = {
  modules: {
    reception: { 
      enabled: true, 
      features: ["Patient check-in", "Appointment scheduling", "Visitor tracking"] 
    },
    doctor: { 
      enabled: true, 
      features: ["View patient list", "Manage schedule", "Prescribe treatments", "Add notes"] 
    },
    patient: { 
      enabled: true, 
      features: ["Profile management", "Appointment requests", "Medical history view", "Receive reminders"] 
    },
    therapy: { 
      enabled: true, 
      features: ["Treatment plans", "Progress tracking"] 
    },
    emr: { 
      enabled: true, 
      features: ["Medical records", "Lab results", "Imaging reports"] 
    },
    finance: { 
      enabled: true, 
      features: ["Payments", "Insurance claims", "Billing"] 
    },
    admin: { 
      enabled: true, 
      features: ["User management", "Audit logs", "Reports"] 
    },
    settings: { 
      enabled: true, 
      features: ["Theme switcher", "Language switcher", "RTL/LTR toggle", "System cleaning"] 
    }
  },
  ai_features: {
    chatbot: {
      enabled: true,
      integrations: ["WhatsApp", "System notifications"],
      capabilities: ["Create appointments", "Send reminders", "Answer queries", "Suggest actions", "Track emotional state"],
      dynamic_flows: true,
      learns_from_interactions: true,
      purpose: "AI-powered patient assistance and appointment management"
    },
    ai_agent: {
      enabled: true,
      per_user_role: true,
      scope_restriction: "Center operations only",
      capabilities: ["Assist patients", "Assist staff", "Assist admin"],
      purpose: "Intelligent assistant for healthcare operations"
    },
    flow_studio: {
      enabled: true,
      purpose: "Create/modify chatbot and AI agent flows without code",
      access: "Admin panel",
      features: ["Visual editor", "Trigger-action mapping", "Scenario simulation"],
      capabilities: ["Visual flow design", "Logic configuration", "Testing environment"]
    },
    voice_bot: {
      enabled: true,
      purpose: "Assist patients via voice interaction",
      integrations: ["WhatsApp voice", "Web microphone"],
      features: ["Speech-to-text", "Text-to-speech", "Tone adjustment", "Real-time language detection"],
      capabilities: ["Voice recognition", "Natural language processing", "Multi-language support"]
    },
    emotion_analytics: {
      enabled: true,
      purpose: "Monitor emotional/behavioral signals for specialists",
      dashboard_access: ["doctor", "psychologist", "admin"],
      metrics: ["Emotional stability", "Interaction sentiment", "Response changes", "AI intervention alerts"],
      capabilities: ["Sentiment analysis", "Behavioral tracking", "Alert generation"]
    },
    early_diagnosis: { 
      enabled: true, 
      purpose: "Assist in early detection of medical conditions",
      capabilities: ["Symptom analysis", "Risk assessment", "Recommendation engine"]
    }
  },
  security: {
    encryption: true,
    audit_logs: true,
    role_based_access: true
  },
  automation: {
    cron_jobs: ["Reminders", "Data sync", "Translation updates", "Reports generation"]
  },
  translation: {
    enabled: true,
    dynamic_update: true,
    no_hardcoded_text: true
  },
  reports: {
    weekly_learning_report_to_admin: true
  }
};

// Configuration management utilities
export class SystemConfigManager {
  private static readonly STORAGE_KEY = 'healthcare_system_config';
  
  static loadConfig(): SystemConfig {
    if (typeof window === 'undefined') {
      return defaultSystemConfig;
    }
    
    try {
      const savedConfig = localStorage.getItem(this.STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('Failed to load system config:', error);
    }
    
    return defaultSystemConfig;
  }
  
  static saveConfig(config: SystemConfig): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save system config:', error);
    }
  }
  
  static updateModule(moduleName: string, enabled: boolean): SystemConfig {
    const config = this.loadConfig();
    if (config.modules[moduleName]) {
      config.modules[moduleName].enabled = enabled;
      this.saveConfig(config);
    }
    return config;
  }
  
  static updateAIFeature(featureName: string, enabled: boolean): SystemConfig {
    const config = this.loadConfig();
    if (config.ai_features[featureName as keyof typeof config.ai_features]) {
      (config.ai_features[featureName as keyof typeof config.ai_features] as any).enabled = enabled;
      this.saveConfig(config);
    }
    return config;
  }
  
  private static mergeWithDefaults(savedConfig: any): SystemConfig {
    return {
      ...defaultSystemConfig,
      ...savedConfig,
      modules: {
        ...defaultSystemConfig.modules,
        ...savedConfig.modules
      },
      ai_features: {
        ...defaultSystemConfig.ai_features,
        ...savedConfig.ai_features
      }
    };
  }
}

// Hook for using system configuration
export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(defaultSystemConfig);
  
  useEffect(() => {
    setConfig(SystemConfigManager.loadConfig());
  }, []);
  
  const updateConfig = useCallback((newConfig: SystemConfig) => {
    setConfig(newConfig);
    SystemConfigManager.saveConfig(newConfig);
  }, []);
  
  const toggleModule = useCallback((moduleName: string, enabled: boolean) => {
    const newConfig = SystemConfigManager.updateModule(moduleName, enabled);
    setConfig(newConfig);
  }, []);
  
  const toggleAIFeature = useCallback((featureName: string, enabled: boolean) => {
    const newConfig = SystemConfigManager.updateAIFeature(featureName, enabled);
    setConfig(newConfig);
  }, []);
  
  return {
    config,
    updateConfig,
    toggleModule,
    toggleAIFeature
  };
}
