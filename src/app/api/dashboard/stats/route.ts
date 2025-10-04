import { NextRequest, NextResponse } from "next/server";

// Mock database data - في التطبيق الحقيقي ستأتي من قاعدة البيانات
const mockStats = {
  totalUsers: 156,
  activeConversations: 23,
  messagesToday: 89,
  responseTime: 2.3,
};

const mockRecentActivity = [
  {
    id: "1",
    type: "message",
    message: "رسالة جديدة من العميل أحمد",
    time: "منذ 5 دقائق",
    status: "success",
  },
  {
    id: "2",
    type: "system",
    message: "تم تحديث النظام بنجاح",
    time: "منذ 15 دقيقة",
    status: "success",
  },
  {
    id: "3",
    type: "warning",
    message: "تحذير: استجابة بطيئة",
    time: "منذ 30 دقيقة",
    status: "warning",
  },
  {
    id: "4",
    type: "error",
    message: "خطأ في الاتصال",
    time: "منذ ساعة",
    status: "error",
  },
];

export async function GET(request: NextRequest) {
  try {
    // في التطبيق الحقيقي، ستتحقق من التوكن هنا
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "غير مصرح لك" },
        { status: 401 }
      );
    }

    // محاكاة استعلام قاعدة البيانات
    // في التطبيق الحقيقي، ستستخدم Supabase أو قاعدة بيانات أخرى
    const stats = await getDashboardStats();
    const recentActivity = await getRecentActivity();

    return NextResponse.json({
      success: true,
      stats,
      recentActivity,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "خطأ في جلب بيانات الداشبورد" },
      { status: 500 }
    );
  }
}

// محاكاة استعلام قاعدة البيانات
async function getDashboardStats() {
  // في التطبيق الحقيقي، ستستخدم Supabase client هنا
  // const { data, error } = await supabase
  //   .from('dashboard_stats')
  //   .select('*')
  //   .single();
  
  // محاكاة التأخير
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockStats;
}

async function getRecentActivity() {
  // في التطبيق الحقيقي، ستستخدم Supabase client هنا
  // const { data, error } = await supabase
  //   .from('activity_logs')
  //   .select('*')
  //   .order('created_at', { ascending: false })
  //   .limit(10);
  
  // محاكاة التأخير
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return mockRecentActivity;
}

