import { _HemamAssistant } from "@/lib/ai-assistant";
describe("HemamAssistant", () => {
  let assistant: HemamAssistant;

  beforeEach(() => {
    assistant = new HemamAssistant();
  });

  describe("Crisis Detection", () => {
    test("should detect crisis keywords", () => {
      const __crisisMessage = "أريد أن أموت";
      const __crisisLevel = assistant.analyzeCrisisLevel(crisisMessage);
      expect(crisisLevel).toBe("crisis");
    });

    test("should detect urgent keywords", () => {
      const __urgentMessage = "هذا أمر طارئ";
      const __crisisLevel = assistant.analyzeCrisisLevel(urgentMessage);
      expect(crisisLevel).toBe("urgent");
    });

    test("should return normal for regular messages", () => {
      const __normalMessage = "مرحبا، كيف حالك؟";
      const __crisisLevel = assistant.analyzeCrisisLevel(normalMessage);
      expect(crisisLevel).toBe("normal");
    });
  });

  describe("Empathetic Responses", () => {
    test("should generate empathetic response for normal messages", () => {
      const __context = {
        userId: "test-user",
        sessionId: "test-session",
        userType: "new_beneficiary" as const,
        currentFlow: "general_inquiry",
        previousInteractions: [],
        emergencyLevel: "normal" as const,
      };

      const __response = assistant.generateEmpatheticResponse(
        context,
        "أحتاج مساعدة",
      );
      expect(response).toContain("نحن هنا لمساعدتك");
    });

    test("should generate crisis response for crisis messages", () => {
      const __context = {
        userId: "test-user",
        sessionId: "test-session",
        userType: "new_beneficiary" as const,
        currentFlow: "general_inquiry",
        previousInteractions: [],
        emergencyLevel: "crisis" as const,
      };

      const __response = assistant.generateEmpatheticResponse(
        context,
        "أريد أن أموت",
      );
      expect(response).toContain("997");
      expect(response).toContain("مساعدة عاجلة");
    });
  });

  describe("Motivational Messages", () => {
    test("should generate motivational message", () => {
      const __message = assistant.generateMotivationalMessage("أحمد");
      expect(message).toContain("أحمد");
      expect(message).toContain("مركز الهمم");
    });

    test("should generate milestone celebration", () => {
      const __message = assistant.generateMotivationalMessage(
        "فاطمة",
        "إكمال 10 جلسات",
      );
      expect(message).toContain("فاطمة");
      expect(message).toContain("إكمال 10 جلسات");
      expect(message).toContain("تهانينا");
    });
  });

  describe("Proactive Care", () => {
    test("should generate proactive care message", () => {
      const __message = assistant.generateProactiveCareMessage(
        "سارة",
        "تمارين التنفس",
      );
      expect(message).toContain("سارة");
      expect(message).toContain("تمارين التنفس");
      expect(message).toContain("👍");
    });
  });

  describe("Family Notifications", () => {
    test("should generate family notification", () => {
      const __message = assistant.generateFamilyNotification(
        "أحمد",
        "appointment",
        "10:00 صباحاً",
      );
      expect(message).toContain("أحمد");
      expect(message).toContain("موعد");
      expect(message).toContain("10:00 صباحاً");
    });
  });

  describe("Accessibility", () => {
    test("should generate accessible response", () => {
      const __options = ["حجز موعد", "معلومات", "دعم"];
      const __response = assistant.generateAccessibleResponse(options);
      expect(response).toContain("1️⃣");
      expect(response).toContain("2️⃣");
      expect(response).toContain("3️⃣");
      expect(response).toContain("رسالة صوتية");
    });
  });
});
