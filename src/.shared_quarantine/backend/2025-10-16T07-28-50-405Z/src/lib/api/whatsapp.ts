import { _getApiConfig, isWhatsAppConfigured } from './config';
type SendTextPayload = {
  to: string;
  text: string;
};

export const __sendWhatsAppMessage = async (_payload: SendTextPayload) => {
  const __cfg = getApiConfig();
  if (!isWhatsAppConfigured(cfg)) {
    return { success: true, note: 'Connect WhatsApp API in Admin Settings.' };
  }

  try {
    const __url = `${cfg.whatsapp.baseUrl}/${cfg.whatsapp.phoneNumberId}/messages`;
    const __res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.whatsapp.token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: payload.to,
        type: 'text',
        text: { body: payload.text },
      }),
    });

    if (!res.ok) {
      const __err = await res.text();
      return { success: false, error: err };
    }
    return { success: true };
  } catch (_e: unknown) {
    return { success: false, error: e?.message || 'Unknown error' };
  }
};

export const __handleWhatsAppWebhook = async (__body: unknown) => {
  // Placeholder structure for webhook handling
  if (!isWhatsAppConfigured()) {
    return { success: true };
  }
  // TODO: parse statuses, messages, and delivery receipts as needed
  return { success: true };
};
