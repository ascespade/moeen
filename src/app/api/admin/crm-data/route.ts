/**
 * Admin CRM Data API
 * بيانات CRM - بيانات حقيقية من قاعدة البيانات
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/authorize';
import { logger } from '@/lib/utils/logger';

export const revalidate = 60;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // leads, contacts, deals

    if (type === 'leads' || !type) {
      // Get leads from database (if table exists)
      const { data: leads, error: leadsError } = await supabase
        .from('crm_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (type === 'leads') {
        return NextResponse.json({
          success: true,
          data: leads || [],
          error: leadsError?.message,
        });
      }
    }

    if (type === 'contacts' || !type) {
      // Get contacts from database (if table exists)
      const { data: contacts, error: contactsError } = await supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (type === 'contacts') {
        return NextResponse.json({
          success: true,
          data: contacts || [],
          error: contactsError?.message,
        });
      }
    }

    if (type === 'deals' || !type) {
      // Get deals from database (if table exists)
      const { data: deals, error: dealsError } = await supabase
        .from('crm_deals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (type === 'deals') {
        return NextResponse.json({
          success: true,
          data: deals || [],
          error: dealsError?.message,
        });
      }
    }

    // Return all data if no type specified
    const [leads, contacts, deals] = await Promise.all([
      supabase.from('crm_leads').select('*').limit(100),
      supabase.from('crm_contacts').select('*').limit(100),
      supabase.from('crm_deals').select('*').limit(100),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leads: leads.data || [],
        contacts: contacts.data || [],
        deals: deals.data || [],
      },
      errors: {
        leads: leads.error?.message,
        contacts: contacts.error?.message,
        deals: deals.error?.message,
      },
    });
  } catch (error) {
    logger.error('Error fetching CRM data:', error, {});
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch CRM data',
        data: {
          leads: [],
          contacts: [],
          deals: [],
        },
      },
      { status: 500 }
    );
  }
}

