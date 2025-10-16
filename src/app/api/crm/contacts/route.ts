import { _createClient } from "@supabase/supabase-js";
import { _NextRequest, NextResponse } from "next/server";

const __supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/crm/contacts - جلب جهات الاتصال
export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __search = searchParams.get("search");
    const __status = searchParams.get("status");
    const __source = searchParams.get("source");
    const __page = parseInt(searchParams.get("page") || "1");
    const __limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    // تطبيق الفلاتر
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      );
    }

    if (status) {
      query = query.eq("customer_type", status);
    }

    if (source) {
      query = query.eq("preferred_channel", source);
    }

    // تطبيق الصفحات
    const __from = (page - 1) * limit;
    const __to = from + limit - 1;
    query = query.range(from, to);

    const { data: contacts, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / (limit || 20)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/crm/contacts - إنشاء جهة اتصال جديدة
export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.json();
    const {
      name,
      email,
      phone,
      whatsapp,
      date_of_birth,
      gender,
      nationality,
      city,
      preferred_language = "ar",
      preferred_channel,
      customer_type = "individual",
      organization_name,
      notes,
      tags = [],
    } = body;

    const { data: contact, error } = await supabase
      .from("customers")
      .insert({
        name,
        email,
        phone,
        whatsapp,
        date_of_birth,
        gender,
        nationality,
        city,
        preferred_language,
        preferred_channel,
        customer_type,
        organization_name,
        notes,
        tags,
        is_active: true,
        total_conversations: 0,
        total_messages: 0,
        satisfaction_avg: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
