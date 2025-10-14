import { NextRequest, NextResponse } from "next/server";
import { realDB } from "@/lib/supabase-real";
import { whatsappAPI } from "@/lib/whatsapp-business-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Get patients from real database
    const patients = await realDB.searchUsers(search, "patient");

    // Get additional patient data
    const patientsWithDetails = await Promise.all(
      (patients as any[]).map(async (patient: any) => {
        const patientData = (await realDB.getPatient(patient.id)) as any;
        const appointments = (await realDB.getAppointments({
          patientId: patient.id,
          limit: 1,
        })) as any[];
      patients.map(async (patient) => {
        const patientData = await realDB.getPatient(patient.id);
        const appointments = await realDB.getAppointments({
          patientId: patient.id,
          limit: 1,
        });

        return {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          contactInfo: {
            phone: patient.phone,
            email: patient.email,
          },
          lastVisit:
            (appointments as any[]).length > 0
              ? new Date((appointments as any[])[0].appointment_date as string)
              : null,
          nextAppointment:
            (appointments as any[]).length > 0
              ? new Date((appointments as any[])[0].appointment_date as string)
              : null,
          status: (patientData as any)?.status || "active",
            appointments.length > 0
              ? new Date(appointments[0].appointment_date)
              : null,
          nextAppointment:
            appointments.length > 0
              ? new Date(appointments[0].appointment_date)
              : null,
          status: patientData?.status || "active",
        };
      }),
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPatients = patientsWithDetails.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedPatients,
      pagination: {
        page,
        limit,
        total: patientsWithDetails.length,
        totalPages: Math.ceil(patientsWithDetails.length / limit),
      },
    });
  } catch (error) {
    console.error("Get patients error:", error);

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
      name,
      age,
      phone,
      email,
      national_id,
      gender,
      address,
      city,
      emergency_contact,
      emergency_contact_relation,
      insurance_provider,
      insurance_number,
      medical_history,
      current_conditions,
      medications,
      allergies,
      guardian_name,
      guardian_relation,
      guardian_phone,
      medical_conditions,
      treatment_goals,
      assigned_doctor_id,
    } = body;

    if (!name || !age || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, age, and phone are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Create user first
    const userData = {
      national_id,
      name,
      age,
      gender,
      phone,
      email,
      role: "patient" as const,
      address,
      city,
      emergency_contact,
      emergency_contact_relation,
      insurance_provider,
      insurance_number,
      medical_history,
      current_conditions,
      medications,
      allergies,
    };

    const user = await realDB.createUser(userData);

    // Create patient record
    const patientData = {
      id: user.id,
      guardian_name,
      guardian_relation,
      guardian_phone,
      medical_conditions,
      treatment_goals,
      assigned_doctor_id,
      status: "active",
    };

    await realDB.createPatient(patientData);

    // Send welcome WhatsApp message
    try {
      await whatsappAPI.sendTextMessage(
        phone,
        `مرحباً ${name}، أهلاً بك في مركز الهمم! تم إنشاء حسابك بنجاح. نحن هنا لمساعدتك في رحلة العلاج والشفاء.`,
      );
    } catch (whatsappError) {
      console.error("WhatsApp message failed:", whatsappError);
      // Don't fail the entire request if WhatsApp fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        message: "Patient created successfully",
        whatsappSent: true,
      },
    });
  } catch (error) {
    console.error("Create patient error:", error);

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
