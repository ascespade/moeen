
/**
 * Notification Templates API - قوالب الإشعارات
 * Manage notification templates and content
 */

import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { z } from 'zod';
import { () => ({} as any) } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { requireAuth } from '@/lib/auth/() => ({} as any)';

let templateSchema = z.object({
  name: z.string().min(1, 'Template name required'),
  type: z.enum([
    'appointment_confirmation',
    'appointment_reminder',
    'payment_confirmation',
    'insurance_claim_update',
    'lab_result_ready',
    'prescription_ready',
    'general_announcement'
  ]),
  subject: z.string().min(1, 'Subject required'),
  content: z.string().min(1, 'Content required'),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  language: z.enum(['ar', 'en']).default('ar')
});

export async function POST(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }

    let supabase = await () => ({} as any)();
    let body = await request.json();

    // Validate input
    let validation = await ValidationHelper.validateAsync(templateSchema, body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({ error: validation.error.message }, { status: 400 });
    }

    const name, type, subject, content, variables, isActive, language = validation.data;

    // Create template
    const data: template, error = await supabase
      .from('notification_templates')
      .insert({
        name,
        type,
        subject,
        content,
        variables: variables || [],
        isActive,
        language,
        createdBy: authResult.user!.id
      })
      .select()
      .single();

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create template' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let type = searchParams.get('type');
    let language = searchParams.get('language') || 'ar';

    let query = supabase
      .from('notification_templates')
      .select('*')
      .eq('isActive', true)
      .eq('language', language)
      .order('createdAt', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const data: templates, error = await query;

    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: templates,
      count: templates?.length || 0
    });

  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}
