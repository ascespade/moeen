/**
 * Integration Test Helpers
 * Provides functions for testing various external integrations
 */

import { log } from '@/lib/monitoring/logger';
import { createClient } from '@/lib/supabase/client';

// ================================================================
// INTERFACE DEFINITIONS
// ================================================================

export interface WhatsAppConfig {
  api_url: string;
  access_token: string;
  phone_number_id: string;
  webhook_verify_token: string;
}

export interface SMSConfig {
  account_sid: string;
  auth_token: string;
  from_number: string;
  api_url?: string; // Optional for Twilio, required for other providers
}

export interface EmailConfig {
  api_key: string;
  from_email: string;
  from_name: string;
  provider?: string; // 'sendgrid', 'mailgun', 'ses', etc.
}

export interface GoogleCalendarConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  calendar_id: string;
}

export interface SlackConfig {
  webhook_url: string;
  channel: string;
  bot_token?: string;
}

export interface SehaConfig {
  api_url: string;
  api_key: string;
  facility_id: string;
}

export interface TatmanConfig {
  api_url: string;
  api_key: string;
  provider_id: string;
}

// ================================================================
// LOGGING FUNCTION
// ================================================================

/**
 * Logs an integration test result to the database
 */
export async function logIntegrationTest(
  integrationConfigId: string,
  integrationType: string,
  testType: string,
  status: 'success' | 'failed' | 'timeout',
  requestData: any = null,
  responseData: any = null,
  errorMessage: string | null = null,
  durationMs: number | null = null,
  testedBy: string | null = null
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('integration_test_logs').insert({
    integration_config_id: integrationConfigId,
    integration_type: integrationType,
    test_type: testType,
    status: status,
    request_data: requestData,
    response_data: responseData,
    error_message: errorMessage,
    duration_ms: durationMs,
    tested_by: testedBy,
  });

  if (error) {
    console.error('Error logging integration test:', error);
  }
}

// ================================================================
// WHATSAPP TESTING
// ================================================================

/**
 * Test WhatsApp Business API connection
 */
export async function testWhatsAppConnection(config: WhatsAppConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test WhatsApp API by fetching phone number details
    const response = await fetch(
      `${config.api_url}/${config.phone_number_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'WhatsApp connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// SMS TESTING (Twilio)
// ================================================================

/**
 * Test SMS Gateway connection (Twilio)
 */
export async function testSmsConnection(config: SMSConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test Twilio API by fetching account details
    const apiUrl = config.api_url || `https://api.twilio.com/2010-04-01/Accounts/${config.account_sid}.json`;
    const credentials = Buffer.from(`${config.account_sid}:${config.auth_token}`).toString('base64');

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'SMS connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// EMAIL TESTING (SendGrid)
// ================================================================

/**
 * Test Email Service connection (SendGrid)
 */
export async function testEmailConnection(config: EmailConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test SendGrid API by validating the API key
    const response = await fetch('https://api.sendgrid.com/v3/scopes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
      },
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.errors?.[0]?.message || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Email service connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// GOOGLE CALENDAR TESTING
// ================================================================

/**
 * Test Google Calendar API connection
 */
export async function testGoogleCalendarConnection(config: GoogleCalendarConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // First, exchange refresh token for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.client_id,
        client_secret: config.client_secret,
        refresh_token: config.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => null);
      const durationMs = Date.now() - startTime;
      return {
        success: false,
        error: errorData?.error_description || `HTTP ${tokenResponse.status}: ${tokenResponse.statusText}`,
        status_code: tokenResponse.status,
        duration_ms: durationMs,
      };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Test by fetching calendar list
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/users/me/calendarList/${config.calendar_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const durationMs = Date.now() - startTime;

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error?.message || `HTTP ${calendarResponse.status}: ${calendarResponse.statusText}`,
        status_code: calendarResponse.status,
        duration_ms: durationMs,
      };
    }

    const data = await calendarResponse.json();

    return {
      success: true,
      message: 'Google Calendar connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// SLACK TESTING
// ================================================================

/**
 * Test Slack Webhook connection
 */
export async function testSlackConnection(config: SlackConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test Slack webhook by sending a test message
    const response = await fetch(config.webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: config.channel,
        text: '✅ تم اختبار اتصال Slack بنجاح من نظام مُعين',
        username: 'مُعين - نظام الإدارة',
      }),
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      return {
        success: false,
        error: errorText || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    return {
      success: true,
      message: 'Slack connection successful',
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// SEHA PLATFORM TESTING
// ================================================================

/**
 * Test Seha Platform API connection
 */
export async function testSehaConnection(config: SehaConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test Seha API by making a health check or facility info request
    const response = await fetch(`${config.api_url}/facilities/${config.facility_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json',
      },
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Seha Platform connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}

// ================================================================
// TATMAN INSURANCE TESTING
// ================================================================

/**
 * Test Tatman Insurance API connection
 */
export async function testTatmanConnection(config: TatmanConfig): Promise<any> {
  const startTime = Date.now();

  try {
    // Test Tatman API by making a provider info request
    const response = await fetch(`${config.api_url}/providers/${config.provider_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json',
      },
    });

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
        duration_ms: durationMs,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'Tatman Insurance connection successful',
      data: data,
      duration_ms: durationMs,
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      success: false,
      error: error.message || 'Unknown error',
      duration_ms: durationMs,
    };
  }
}
