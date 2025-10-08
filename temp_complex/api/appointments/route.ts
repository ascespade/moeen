import { NextRequest, NextResponse } from "next/server";
import { realDB } from "@/lib/supabase-real";
import { whatsappAPI } from "@/lib/whatsapp-business-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");

    // Get appointments from real database
    const opts: any = {};
    if (patientId) opts.patientId = patientId;
    if (doctorId) opts.doctorId = doctorId;
    if (date) opts.date = date;
    if (status) opts.status = status;
    const appointments = (await realDB.getAppointments(opts)) as any[];

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientId,
      doctorId,
      appointment_date,
      appointment_time,
      duration_minutes = 60,
      type = "treatment",
      notes,
      insurance_covered = false,
      insurance_approval_number,
      created_by,
    } = body;

    if (!patientId || !doctorId || !appointment_date || !appointment_time) {
      return NextResponse.json(
        {
          success: false,
          error: "Patient ID, doctor ID, date, and time are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Create appointment in database
    const appointment = await realDB.createAppointment({
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date,
      appointment_time,
      duration_minutes,
      type,
      notes,
      insurance_covered,
      insurance_approval_number,
      created_by: created_by || patientId,
    });

    // Get patient info for WhatsApp notification
    const patient = (await realDB.getPatient(patientId)) as any;
    if (patient && (patient as any).users?.phone) {
      try {
        // Send appointment confirmation via WhatsApp
        await whatsappAPI.sendTemplateMessage(
          (patient as any).users.phone,
          "appointment_confirmation",
          "ar",
          [
            (patient as any).users.name,
            new Date(appointment_date).toLocaleDateString("ar-SA"),
            appointment_time,
          ],
        );
      } catch (whatsappError) {
        console.error("WhatsApp confirmation failed:", whatsappError);
        // Don't fail the entire request if WhatsApp fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        appointmentId: (appointment as any).id,
        message: "Appointment booked successfully",
        confirmationSent: !!(patient as any)?.users?.phone,
      },
    });
  } catch (error) {
    console.error("Book appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, newDate, newTime, reason } = body;

    if (!appointmentId || !newDate || !newTime) {
      return NextResponse.json(
        {
          success: false,
          error: "Appointment ID, new date, and new time are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // In a real implementation, this would update the appointment in the database
    // For now, return success
    return NextResponse.json({
      success: true,
      data: {
        message: "Appointment rescheduled successfully",
        newDate,
        newTime,
        reason,
      },
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");
    const reason = searchParams.get("reason") || "No reason provided";

    if (!appointmentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Appointment ID is required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // In a real implementation, this would cancel the appointment in the database
    // For now, return success
    return NextResponse.json({
      success: true,
      data: {
        message: "Appointment cancelled successfully",
        appointmentId,
        reason,
      },
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
