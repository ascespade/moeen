import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ErrorHandler } from '@/core/errors';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Note: Contact form is intentionally public (no auth required)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'جميع الحقول المطلوبة يجب ملؤها',
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    // Save to database
    try {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new',
          created_at: new Date().toISOString(),
        });

      if (dbError) {
        logger.error('Failed to save contact submission', dbError);
        // Continue - don't fail the request if DB save fails
      } else {
        logger.info('Contact form submission received', { email, subject });
      }
    } catch (e) {
      logger.error('Error saving contact submission', e);
      // Continue - don't fail the request
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنرد عليك قريباً.',
    });
  } catch (error) {
    logger.error('Contact form error', error);
    return ErrorHandler.getInstance().handle(error as Error);
  }
}


