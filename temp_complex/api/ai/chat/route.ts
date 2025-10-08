import { NextRequest, NextResponse } from "next/server";
import { HemamAssistant } from "@/lib/ai-assistant";
import { FlowManager } from "@/lib/conversation-flows";
import { WhatsAppIntegration } from "@/lib/whatsapp-integration";

const assistant = new HemamAssistant();
const flowManager = new FlowManager();
const whatsapp = new WhatsAppIntegration();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, sessionId, userType = "new_beneficiary" } = body;

    if (!message || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Message and userId are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Create conversation context
    const context = {
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      userType,
      currentFlow: "general_inquiry",
      previousInteractions: [],
      emergencyLevel: "normal" as const,
    };

    // Analyze crisis level
    const crisisLevel = assistant.analyzeCrisisLevel(message);

    if (crisisLevel === "crisis") {
      // Handle crisis immediately
      const crisisResponse = assistant.generateEmpatheticResponse(
        context,
        message,
      );

      // Send crisis support via WhatsApp if phone number available
      if (body.phoneNumber) {
        await whatsapp.sendCrisisSupport(body.phoneNumber);
      }

      return NextResponse.json({
        success: true,
        data: {
          response: crisisResponse,
          crisisLevel: "crisis",
          emergencyContacts: {
            crisis: "997",
            medical: "+966501234567",
            admin: "+966501234568",
          },
          requiresImmediateAction: true,
        },
      });
    }

    // Generate empathetic response
    const response = assistant.generateEmpatheticResponse(context, message);

    // Determine next conversation flow
    let nextFlow = "general_inquiry";
    if (message.includes("موعد") || message.includes("حجز")) {
      nextFlow = "appointment_management";
    } else if (message.includes("عائلة") || message.includes("ولي أمر")) {
      nextFlow = "family_support";
    } else if (message.includes("دعم") || message.includes("مساعدة")) {
      nextFlow = "continuous_support";
    }

    // Get flow steps
    const flow = flowManager.getFlow(nextFlow);
    const nextStep = flowManager.getNextStep(nextFlow, "welcome", message);

    return NextResponse.json({
      success: true,
      data: {
        response,
        crisisLevel,
        nextFlow,
        nextStep: nextStep
          ? {
              id: nextStep.id,
              type: nextStep.type,
              content: nextStep.content,
              options: nextStep.options,
            }
          : null,
        suggestions: [
          "حجز موعد",
          "معلومات عن المركز",
          "التواصل مع الطبيب",
          "الدعم النفسي",
        ],
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

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
