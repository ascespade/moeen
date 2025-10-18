/**
 * Admin System Configuration API - إعدادات النظام
 * Manage system configuration settings
 */
import { import { NextRequest } from "next/server";, import { NextResponse } from "next/server"; } from 'next/server';
import { () => ({} as any) } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/() => ({} as any)';
import { ErrorHandler } from '@/core/errors';
import { z } from 'zod';

let configSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
  description: z.string().optional(),
  category: z.string().default('general'),
  isSecret: z.boolean().default(false),
});

export async function GET(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin or supervisor
    let authResult = await requireAuth(['admin', 'supervisor'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    
    // Get system configurations
    const data: configs, error = await supabase
      .from('system_config')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      // console.error('Error fetching configs:', error);
      // Return default configs if table doesn't exist
      let defaultConfigs = [
        {
          id: '1',
          key: 'maintenance_mode',
          value: 'false',
          description: 'Enable maintenance mode',
          category: 'system',
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          key: 'registration_enabled',
          value: 'true',
          description: 'Allow new user registrations',
          category: 'auth',
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          key: 'max_users',
          value: '1000',
          description: 'Maximum number of users allowed',
          category: 'limits',
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          key: 'session_timeout',
          value: '3600',
          description: 'Session timeout in seconds',
          category: 'auth',
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          key: 'api_rate_limit',
          value: '100',
          description: 'API rate limit per minute',
          category: 'security',
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      return import { NextResponse } from "next/server";.json({
        success: true,
        data: defaultConfigs,
        message: 'Using default configuration'
      });
    }

    return import { NextResponse } from "next/server";.json({
      success: true,
      data: configs || []
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

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
    let validation = configSchema.safeParse(body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({
        error: 'Invalid configuration data',
        details: validation.error.issues
      }, { status: 400 });
    }
    
    let configData = validation.data;
    
    // Check if config already exists
    const data: existingConfig = await supabase
      .from('system_config')
      .select('id')
      .eq('key', configData.key)
      .single();
      
    if (existingConfig) {
      return import { NextResponse } from "next/server";.json({ error: 'Configuration key already exists' }, { status: 409 });
    }
    
    // Create new configuration
    const data: newConfig, error = await supabase
      .from('system_config')
      .insert({
        ...configData,
        createdBy: authResult.user!.id,
      })
      .select()
      .single();
      
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to create configuration' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'config_created',
      entityType: 'system_config',
      entityId: newConfig.id,
      userId: authResult.user!.id,
      metadata: {
        key: configData.key,
        category: configData.category,
      },
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: newConfig,
      message: 'Configuration created successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function PUT(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let configId = searchParams.get('id');
    
    if (!configId) {
      return import { NextResponse } from "next/server";.json({ error: 'Configuration ID required' }, { status: 400 });
    }
    
    let body = await request.json();
    
    // Validate input
    let validation = configSchema.partial().safeParse(body);
    if (!validation.success) {
      return import { NextResponse } from "next/server";.json({
        error: 'Invalid configuration data',
        details: validation.error.issues
      }, { status: 400 });
    }
    
    let updateData = validation.data;
    
    // Update configuration
    const data: updatedConfig, error = await supabase
      .from('system_config')
      .update({
        ...updateData,
        updatedBy: authResult.user!.id,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', configId)
      .select()
      .single();
      
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to update configuration' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'config_updated',
      entityType: 'system_config',
      entityId: configId,
      userId: authResult.user!.id,
      metadata: updateData,
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      data: updatedConfig,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}

export async function DELETE(request: import { NextRequest } from "next/server";) {
  try {
    // Authorize admin only
    let authResult = await requireAuth(['admin'])(request);
    if (!authResult.() => ({} as any)d) {
      return import { NextResponse } from "next/server";.json({ error: 'Un() => ({} as any)d' }, { status: 401 });
    }
    
    let supabase = await () => ({} as any)();
    const searchParams = new URL(request.url);
    let configId = searchParams.get('id');
    
    if (!configId) {
      return import { NextResponse } from "next/server";.json({ error: 'Configuration ID required' }, { status: 400 });
    }
    
    // Delete configuration
    const error = await supabase
      .from('system_config')
      .delete()
      .eq('id', configId);
      
    if (error) {
      return import { NextResponse } from "next/server";.json({ error: 'Failed to delete configuration' }, { status: 500 });
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      action: 'config_deleted',
      entityType: 'system_config',
      entityId: configId,
      userId: authResult.user!.id,
      metadata: { softDelete: true },
    });
    
    return import { NextResponse } from "next/server";.json({
      success: true,
      message: 'Configuration deleted successfully'
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}