import { WhatsAppIntegration } from "@/lib/whatsapp-integration";
describe("WhatsAppIntegration", () => {
  let whatsapp: WhatsAppIntegration;

  beforeEach(() => {
    whatsapp = new WhatsAppIntegration();
  });

  describe("Contact Management", () => {
    test("should add contact", () => {
      const contact = {
        phone: "+966501234567",
        name: "أحمد محمد",
        isPatient: true,
        isFamilyMember: false,
        patientId: "patient-1",
        lastInteraction: new Date(),
        preferredLanguage: "ar" as const,
      };

      whatsapp.addContact(contact);
      const retrievedContact = whatsapp.getContact("+966501234567");

      expect(retrievedContact).toBeDefined();
      expect(retrievedContact?.name).toBe("أحمد محمد");
      expect(retrievedContact?.isPatient).toBe(true);
    });

    test("should update contact", () => {
      const contact = {
        phone: "+966501234567",
        name: "أحمد محمد",
        isPatient: true,
        isFamilyMember: false,
        patientId: "patient-1",
        lastInteraction: new Date(),
        preferredLanguage: "ar" as const,
      };

      whatsapp.addContact(contact);
      const updated = whatsapp.updateContact("+966501234567", {
        name: "أحمد محمد الأحمد",
      });

      expect(updated).toBe(true);

      const retrievedContact = whatsapp.getContact("+966501234567");
      expect(retrievedContact?.name).toBe("أحمد محمد الأحمد");
    });
  });

  describe("Message Processing", () => {
    test("should process text message", async () => {
      const response = await whatsapp.processIncomingMessage(
        "+966501234567",
        "مرحبا",
        "text",
      );
      expect(response).toContain("شكراً لك");
    });

    test("should process audio message", async () => {
      const response = await whatsapp.processIncomingMessage(
        "+966501234567",
        "",
        "audio",
      );
      expect(response).toContain("رسالة صوتية");
    });

    test("should process image message", async () => {
      const response = await whatsapp.processIncomingMessage(
        "+966501234567",
        "",
        "image",
      );
      expect(response).toContain("الصورة");
    });
  });

  describe("Template Messages", () => {
    test("should send appointment confirmation", async () => {
      const result = await whatsapp.sendTemplateMessage(
        "appointment_confirmation",
        "+966501234567",
        { name: "أحمد", date: "2024-01-20", time: "10:00" },
      );
      expect(result).toBeDefined();
    });

    test("should send motivational message", async () => {
      const result = await whatsapp.sendMotivationalMessage(
        "+966501234567",
        "أحمد",
      );
      expect(result).toBeDefined();
    });

    test("should send milestone celebration", async () => {
      const result = await whatsapp.sendMilestoneCelebration(
        "+966501234567",
        "أحمد",
        "إكمال 10 جلسات",
      );
      expect(result).toBeDefined();
    });

    test("should send exercise reminder", async () => {
      const result = await whatsapp.sendExerciseReminder(
        "+966501234567",
        "أحمد",
        "تمارين التنفس",
      );
      expect(result).toBeDefined();
    });

    test("should send crisis support", async () => {
      const result = await whatsapp.sendCrisisSupport("+966501234567");
      expect(result).toBeDefined();
    });
  });

  describe("Family Notifications", () => {
    test("should notify family member", async () => {
      const result = await whatsapp.notifyFamilyMember(
        "+966501234568",
        "أحمد",
        "appointment",
        "10:00 صباحاً",
      );
      expect(result).toBeDefined();
    });
  });

  describe("Message Statistics", () => {
    test("should get message stats", () => {
      const stats = whatsapp.getMessageStats();
      expect(stats).toHaveProperty("totalMessages");
      expect(stats).toHaveProperty("sentMessages");
      expect(stats).toHaveProperty("deliveredMessages");
      expect(stats).toHaveProperty("readMessages");
      expect(stats).toHaveProperty("failedMessages");
    });
  });

  describe("Accessibility Features", () => {
    test("should generate accessible response", () => {
      const options = ["حجز موعد", "معلومات", "دعم"];
      const response = whatsapp.generateAccessibleResponse(options);
      expect(response).toContain("1️⃣");
      expect(response).toContain("2️⃣");
      expect(response).toContain("3️⃣");
    });

    test("should generate multilingual response", () => {
      const arabicText = "مرحبا";
      const englishText = "Hello";
      const response = whatsapp.generateMultilingualResponse(
        arabicText,
        englishText,
        "ar",
      );
      expect(response).toBe(arabicText);
    });
  });
});
