/**
 * System Configuration API - إعدادات النظام
 * Manage system-wide configuration and settings
 */

import { _NextRequest, NextResponse } from "next/server";
import { _z } from "zod";

import { _ErrorHandler } from "@/core/errors";
import { _ValidationHelper } from "@/core/validation";
import { _authorize, requireRole } from "@/lib/auth/authorize";
import { _createClient } from "@/lib/supabase/server";

const __configSchema = z.object({
  key: z.string().min(1, "Configuration key required"),
  value: z.any(),
  type: z.enum(["string", "number", "boolean", "object", "array"]),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  category: z.string().default("general"),
});

export async function __POST(_request: NextRequest) {
  try {
    // Authorize admin only
    const { user: authUser, error: authError } = await authorize(request);
    if (authError || !authUser || !requireRole(["admin"])(authUser)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const __supabase = createClient();
    const __body = await request.json();

    // Validate input
    const __validation = await ValidationHelper.validateAsync(
      configSchema,
      body,
    );
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 },
      );
    }

    const { key, value, type, description, isPublic, category } =
      validation.data;

    // Create or update configuration
    const { data: config, error } = await supabase
      .from("system_config")
      .upsert({
        key,
        value,
        type,
        description,
        isPublic,
        category,
        updatedBy: authUser.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save configuration" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
      message: "Configuration saved successfully",
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

export async function __GET(_request: NextRequest) {
  try {
    const __supabase = createClient();
    const { searchParams } = new URL(request.url);
    const __category = searchParams.get("category");
    const __isPublic = searchParams.get("isPublic") === "true";

    let query = supabase
      .from("system_config")
      .select("*")
      .order("category", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }
    if (isPublic) {
      query = query.eq("isPublic", true);
    }

    const { data: configs, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch configurations" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: configs,
      count: configs?.length || 0,
    });
  } catch (error) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}
