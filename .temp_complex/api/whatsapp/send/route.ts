import { NextRequest, NextResponse } from "next/server";
import { whatsappAPI } from "@/lib/whatsapp-business-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, type, content, templateName, parameters } = body;

    if (!to || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipient and message type are required",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    let result;

    switch (type) {
      case "text":
        if (!content) {
          return NextResponse.json(
            {
              success: false,
              error: "Text content is required for text messages",
              code: "MISSING_CONTENT",
            },
            { status: 400 },
          );
        }
        result = await whatsappAPI.sendTextMessage(to, content);
        break;

      case "template":
        if (!templateName) {
          return NextResponse.json(
            {
              success: false,
              error: "Template name is required for template messages",
              code: "MISSING_TEMPLATE_NAME",
            },
            { status: 400 },
          );
        }
        result = await whatsappAPI.sendTemplateMessage(
          to,
          templateName,
          "ar",
          parameters || [],
        );
        break;

      case "image":
        if (!content.imageUrl) {
          return NextResponse.json(
            {
              success: false,
              error: "Image URL is required for image messages",
              code: "MISSING_IMAGE_URL",
            },
            { status: 400 },
          );
        }
        result = await whatsappAPI.sendImageMessage(
          to,
          content.imageUrl,
          content.caption,
        );
        break;

      case "document":
        if (!content.documentUrl || !content.filename) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Document URL and filename are required for document messages",
              code: "MISSING_DOCUMENT_DATA",
            },
            { status: 400 },
          );
        }
        result = await whatsappAPI.sendDocumentMessage(
          to,
          content.documentUrl,
          content.filename,
          content.caption,
        );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unsupported message type",
            code: "UNSUPPORTED_MESSAGE_TYPE",
          },
          { status: 400 },
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          messageId: result.messageId,
          type,
          sentAt: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to send message",
          code: "MESSAGE_SEND_FAILED",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("WhatsApp send API error:", error);

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
