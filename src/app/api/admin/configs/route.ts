import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/authorize";
import { ErrorHandler } from "@/core/errors";

/**
 * Admin System Configuration API - إعدادات النظام
 * Manage system configuration settings
 */

const configSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  description: z.string().optional(),
  category: z.string().default("general"),
  isSecret: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    // Authorize admin or supervisor
    const authResult = await requireAuth(["admin", "supervisor"])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

    // Get system configurations
    const { data: configs, error } = await supabase
      .from("system_config")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (error) {
      console.error("Error fetching configs:", error);
      // Return default configs if table doesn't exist
      const defaultConfigs = [
  {
    id: "1",
          key: "maintenance_mode",
          value: "false",
          description: "Enable maintenance mode",
          category: "system",
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
          id: "2",
          key: "registration_enabled",
          value: "true",
          description: "Allow new user registrations",
          category: "auth",
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
          id: "3",
          key: "max_users",
          value: "1000",
          description: "Maximum number of users allowed",
          category: "limits",
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
          id: "4",
          key: "session_timeout",
          value: "3600",
          description: "Session timeout in seconds",
          category: "auth",
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
          id: "5",
          key: "api_rate_limit",
          value: "100",
          description: "API rate limit per minute",
          category: "security",
          isSecret: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return NextResponse.json({
        success: true,
        data: defaultConfigs,
        message: "Using default configuration",
      });

    return NextResponse.json({
      success: true,
      data: configs || [],
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }

export async function POST(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = configSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
          error: "Invalid configuration data",
          details: validation.error.issues,
        },
        { status: 400 },
      );

    const configData = validation.data;

    // Check if config already exists
    const { data: existingConfig } = await supabase
      .from("system_config")
      .select("id")
      .eq("key", configData.key)
      .single();

    if (existingConfig) {
      return NextResponse.json(
        { error: "Configuration key already exists" },
        { status: 409 },
      );

    // Create new configuration
    const { data: newConfig, error } = await supabase
      .from("system_config")
      .insert({
        ...configData,
        createdBy: authResult.user!.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create configuration" },
        { status: 500 },
      );

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "config_created",
      entityType: "system_config",
      entityId: newConfig.id,
      userId: authResult.user!.id,
      metadata: {
        key: configData.key,
        category: configData.category,
      },
    });

    return NextResponse.json({
      success: true,
      data: newConfig,
      message: "Configuration created successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }

export async function PUT(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get("id");

    if (!configId) {
      return NextResponse.json(
        { error: "Configuration ID required" },
        { status: 400 },
      );

    const body = await request.json();

    // Validate input
    const validation = configSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
          error: "Invalid configuration data",
          details: validation.error.issues,
        },
        { status: 400 },
      );

    const updateData = validation.data;

    // Update configuration
    const { data: updatedConfig, error } = await supabase
      .from("system_config")
      .update({
        ...updateData,
        updatedBy: authResult.user!.id,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", configId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update configuration" },
        { status: 500 },
      );

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "config_updated",
      entityType: "system_config",
      entityId: configId,
      userId: authResult.user!.id,
      metadata: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedConfig,
      message: "Configuration updated successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }

export async function DELETE(request: NextRequest) {
  try {
    // Authorize admin only
    const authResult = await requireAuth(["admin"])(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get("id");

    if (!configId) {
      return NextResponse.json(
        { error: "Configuration ID required" },
        { status: 400 },
      );

    // Delete configuration
    const { error } = await supabase
      .from("system_config")
      .delete()
      .eq("id", configId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete configuration" },
        { status: 500 },
      );

    // Create audit log
    await supabase.from("audit_logs").insert({
      action: "config_deleted",
      entityType: "system_config",
      entityId: configId,
      userId: authResult.user!.id,
      metadata: { softDelete: true },
    });

    return NextResponse.json({
      success: true,
      message: "Configuration deleted successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error);
  }
}}}}}}}}}}
}
