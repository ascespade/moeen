/**
 * Notification Templates API - قوالب الإشعارات
 * Manage notification templates and content
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ValidationHelper } from '@/core/validation';
import { ErrorHandler } from '@/core/errors';
import { authorize } from '@/middleware/authorize';

const templateSchema = z.object({
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
  language: z.enum(['ar', 'en']).default('ar'),
});

export async function POST(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await authorize(['admin'])(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    const body = await request.json();

    // Validate input
    const validation = await ValidationHelper.validateAsync(templateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.message }, { status: 400 });
    }

    const { name, type, subject, content, variables, isActive, language } = validation.data;

    // Create template
    const { data: template, error } = await supabase
      .from('notification_templates')
      .insert({
        name,
        type,
        subject,
        content,
        variables: variables || [],
        isActive,
        language,
        createdBy: authResult.user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const language = searchParams.get('language') || 'ar';

    let query = supabase
      .from('notification_templates')
      .select('*')
      .eq('isActive', true)
      .eq('language', language)
      .order('createdAt', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: templates, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates?.length || 0
    });

  } catch (error) {
    return ErrorHandler.handle(error);
  }
}