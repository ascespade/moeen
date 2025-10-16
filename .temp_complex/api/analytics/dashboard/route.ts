import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";

const db = new DatabaseManager({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "hemam_center",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  ssl: process.env.NODE_ENV === "production",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const type = searchParams.get("type") || "overview";

    let data: any = {};

    switch (type) {
      case "overview":
        data = await getOverviewData(parseInt(period));
        break;
      case "patients":
        data = await getPatientAnalytics(parseInt(period));
        break;
      case "appointments":
        data = await getAppointmentAnalytics(parseInt(period));
        break;
      case "conversations":
        data = await getConversationAnalytics(parseInt(period));
        break;
      case "crisis":
        data = await getCrisisAnalytics(parseInt(period));
        break;
      default:
        data = await getOverviewData(parseInt(period));
    }

    return NextResponse.json({
      success: true,
      data,
      period: parseInt(period),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate analytics",
        code: "ANALYTICS_ERROR",
      },
      { status: 500 },
    );
  }
}

async function getOverviewData(period: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Get basic stats
  const patientStats = await db.getPatientStats();
  const conversationStats = await db.getConversationStats();

  // Get appointments for the period
  const appointments = await db.getAppointments();
  const recentAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= startDate,
  );

  // Get sessions for the period
  const sessions = await (db as any).pool.query(
    `
    SELECT COUNT(*) as total_sessions,
           COUNT(CASE WHEN completed = true THEN 1 END) as completed_sessions,
           COUNT(CASE WHEN created_at >= $1 THEN 1 END) as recent_sessions
    FROM sessions
  `,
    [startDate],
  );

  return {
    patients: {
      total: patientStats.total_patients,
      newLast30Days: patientStats.new_patients_30_days,
      newLast7Days: patientStats.new_patients_7_days,
    },
    appointments: {
      total: appointments.length,
      recent: recentAppointments.length,
      completed: recentAppointments.filter((apt) => apt.status === "completed")
        .length,
      cancelled: recentAppointments.filter((apt) => apt.status === "cancelled")
        .length,
    },
    sessions: sessions.rows[0],
    conversations: {
      total: conversationStats.total_conversations,
      crisis: conversationStats.crisis_conversations,
      recent: conversationStats.conversations_7_days,
    },
    systemHealth: await db.healthCheck(),
  };
}

async function getPatientAnalytics(period: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Patient demographics
  const demographics = await (db as any).pool.query(
    `
    SELECT 
      CASE 
        WHEN age < 18 THEN 'children'
        WHEN age BETWEEN 18 AND 35 THEN 'adults'
        WHEN age BETWEEN 36 AND 55 THEN 'middle_aged'
        ELSE 'seniors'
      END as age_group,
      COUNT(*) as count
    FROM patients
    WHERE created_at >= $1
    GROUP BY age_group
    ORDER BY count DESC
  `,
    [startDate],
  );

  // Patient growth over time
  const growthData = await (db as any).pool.query(
    `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as new_patients
    FROM patients
    WHERE created_at >= $1
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
    [startDate],
  );

  // Most active patients
  const activePatients = await (db as any).pool.query(
    `
    SELECT 
      p.name,
      p.phone,
      COUNT(a.id) as appointment_count,
      COUNT(s.id) as session_count
    FROM patients p
    LEFT JOIN appointments a ON p.id = a.patient_id
    LEFT JOIN sessions s ON p.id = s.patient_id
    WHERE p.created_at >= $1
    GROUP BY p.id, p.name, p.phone
    ORDER BY (appointment_count + session_count) DESC
    LIMIT 10
  `,
    [startDate],
  );

  return {
    demographics: demographics.rows,
    growthData: growthData.rows,
    activePatients: activePatients.rows,
  };
}

async function getAppointmentAnalytics(period: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Appointment statistics
  const appointmentStats = await (db as any).pool.query(
    `
    SELECT 
      status,
      COUNT(*) as count,
      AVG(EXTRACT(EPOCH FROM (appointment_date::timestamp - created_at::timestamp))/3600) as avg_booking_lead_time
    FROM appointments
    WHERE created_at >= $1
    GROUP BY status
  `,
    [startDate],
  );

  // Daily appointment trends
  const dailyTrends = await (db as any).pool.query(
    `
    SELECT 
      DATE(appointment_date) as date,
      COUNT(*) as total_appointments,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
    FROM appointments
    WHERE appointment_date >= $1
    GROUP BY DATE(appointment_date)
    ORDER BY date
  `,
    [startDate],
  );

  // Doctor workload
  const doctorWorkload = await (db as any).pool.query(
    `
    SELECT 
      d.name as doctor_name,
      d.specialty,
      COUNT(a.id) as appointment_count,
      COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments
    FROM doctors d
    LEFT JOIN appointments a ON d.id = a.doctor_id
    WHERE a.created_at >= $1 OR a.created_at IS NULL
    GROUP BY d.id, d.name, d.specialty
    ORDER BY appointment_count DESC
  `,
    [startDate],
  );

  return {
    stats: appointmentStats.rows,
    dailyTrends: dailyTrends.rows,
    doctorWorkload: doctorWorkload.rows,
  };
}

async function getConversationAnalytics(period: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Conversation statistics
  const conversationStats = await (db as any).pool.query(
    `
    SELECT 
      message_type,
      crisis_level,
      sentiment,
      COUNT(*) as count
    FROM conversations
    WHERE created_at >= $1
    GROUP BY message_type, crisis_level, sentiment
    ORDER BY count DESC
  `,
    [startDate],
  );

  // Hourly conversation patterns
  const hourlyPatterns = await (db as any).pool.query(
    `
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour,
      COUNT(*) as conversation_count
    FROM conversations
    WHERE created_at >= $1
    GROUP BY EXTRACT(HOUR FROM created_at)
    ORDER BY hour
  `,
    [startDate],
  );

  // Crisis intervention data
  const crisisData = await (db as any).pool.query(
    `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as crisis_count,
      COUNT(CASE WHEN crisis_level = 'crisis' THEN 1 END) as critical_crises
    FROM conversations
    WHERE created_at >= $1 AND crisis_level IN ('urgent', 'crisis')
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
    [startDate],
  );

  return {
    stats: conversationStats.rows,
    hourlyPatterns: hourlyPatterns.rows,
    crisisData: crisisData.rows,
  };
}

async function getCrisisAnalytics(period: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  // Crisis intervention statistics
  const crisisStats = await (db as any).pool.query(
    `
    SELECT 
      crisis_level,
      COUNT(*) as count,
      AVG(EXTRACT(EPOCH FROM (sent_at - created_at))/60) as avg_response_time_minutes
    FROM conversations
    WHERE created_at >= $1 AND crisis_level IN ('urgent', 'crisis')
    GROUP BY crisis_level
  `,
    [startDate],
  );

  // Crisis response times
  const responseTimes = await (db as any).pool.query(
    `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as crisis_count,
      AVG(EXTRACT(EPOCH FROM (sent_at - created_at))/60) as avg_response_time
    FROM conversations
    WHERE created_at >= $1 AND crisis_level IN ('urgent', 'crisis')
    GROUP BY DATE(created_at)
    ORDER BY date
  `,
    [startDate],
  );

  // Most common crisis triggers
  const crisisTriggers = await (db as any).pool.query(
    `
    SELECT 
      content,
      COUNT(*) as frequency
    FROM conversations
    WHERE created_at >= $1 AND crisis_level IN ('urgent', 'crisis')
    GROUP BY content
    ORDER BY frequency DESC
    LIMIT 10
  `,
    [startDate],
  );

  return {
    stats: crisisStats.rows,
    responseTimes: responseTimes.rows,
    triggers: crisisTriggers.rows,
  };
}
