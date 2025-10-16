import { _NextRequest, NextResponse } from "next/server";

import { _realDB } from "@/lib/supabase-real";
import { _whatsappAPI } from "@/lib/whatsapp-business-api";

export async function __GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const __page = parseInt(searchParams.get("page") || "1");
    const __limit = parseInt(searchParams.get("limit") || "20");
    const __search = searchParams.get("search") || "";

    // Get patients from real database
    const __patients = await realDB.searchUsers(search, "patient");

    // Get additional patient data
    const __patientsWithDetails = await Promise.all(
      (patients as any[]).map(async (_patient: unknown) => {
        const __patientData = (await realDB.getPatient(patient.id)) as any;
        const __appointments = (await realDB.getAppointments({
          patientId: patient.id,
          limit: 1,
        })) as any[];

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
        };
      }),
    );

    // Pagination
    const __startIndex = (page - 1) * limit;
    const __endIndex = startIndex + limit;
    const __paginatedPatients = patientsWithDetails.slice(startIndex, endIndex);

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
    // // console.error("Get patients error:", error);

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

export async function __POST(_request: NextRequest) {
  try {
    const __body = await request.json();
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
    const __userData = {
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

    const __user = await realDB.createUser(userData);

    // Create patient record
    const __patientData = {
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
      // // console.error("WhatsApp message failed:", whatsappError);
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
    // // console.error("Create patient error:", error);

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
