import { _createClient } from "@supabase/supabase-js";
import { _NextRequest, NextResponse } from "next/server";

const __supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET /api/crm/leads - جلب العملاء المحتملين
export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __status = searchParams.get("status");
    const __owner_id = searchParams.get("owner_id");
    const __page = parseInt(searchParams.get("page") || "1");
    const __limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("crm_leads")
      .select(
        `
        *,
        users!crm_leads_owner_id_fkey (
          name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (owner_id) {
      query = query.eq("owner_id", owner_id);
    }

    // تطبيق الصفحات
    const __from = (page - 1) * limit;
    const __to = from + limit - 1;
    query = query.range(from, to);

    const { data: leads, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      leads,
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

// POST /api/crm/leads - إنشاء عميل محتمل جديد
export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      source,
      status = "new",
      score = 0,
      notes,
      owner_id,
    } = body;

    const { data: lead, error } = await supabase
      .from("crm_leads")
      .insert({
        public_id: `LEAD-${Date.now()}`,
        name,
        email,
        phone,
        company,
        source,
        status,
        score,
        notes,
        owner_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
