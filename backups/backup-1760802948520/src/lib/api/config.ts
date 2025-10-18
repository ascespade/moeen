// Centralized API configuration for Moeen (Hemam Center)
export type AIProvider = "gemini" | "openai";

export interface ApiConfig {
  whatsapp: {
    baseUrl: string;
    token?: string;
    phoneNumberId?: string;
    webhookUrl?: string;
  };
  supabase: {
    url?: string;
    anonKey?: string;
  };
  ai: {
    provider: AIProvider;
    geminiApiKey?: string;
    openaiApiKey?: string;
  };
}

export const getApiConfig = (): ApiConfig => {
  const whatsappToken =
    process.env.NEXT_PUBLIC_WHATSApp_TOKEN || process.env.WHATSAPP_TOKEN;
  const phoneNumberId =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID ||
    process.env.WHATSAPP_PHONE_NUMBER_ID;
  const webhookUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_WEBHOOK_URL ||
    process.env.WHATSAPP_WEBHOOK_URL;
  const geminiApiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const openaiApiKey =
    process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  return {
    whatsapp: {
      baseUrl:
        process.env.NEXT_PUBLIC_WHATSAPP_BASE_URL ||
        "https://graph.facebook.com/v19.0",
      ...(whatsappToken ? { token: whatsappToken } : {}),
      ...(phoneNumberId ? { phoneNumberId } : {}),
      ...(webhookUrl ? { webhookUrl } : {}),
    },
    supabase: {
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? { url: process.env.NEXT_PUBLIC_SUPABASE_URL }
        : {}),
      ...(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? { anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }
        : {}),
    },
    ai: {
      provider: (process.env.NEXT_PUBLIC_AI_PROVIDER as AIProvider) || "gemini",
      ...(geminiApiKey ? { geminiApiKey } : {}),
      ...(openaiApiKey ? { openaiApiKey } : {}),
    },
  };
};

export const isWhatsAppConfigured = (cfg: ApiConfig = getApiConfig()) =>
  Boolean(cfg.whatsapp.token && cfg.whatsapp.phoneNumberId);

export const isAIConfigured = (cfg: ApiConfig = getApiConfig()) =>
  cfg.ai.provider === "gemini"
    ? Boolean(cfg.ai.geminiApiKey)
    : Boolean(cfg.ai.openaiApiKey);
