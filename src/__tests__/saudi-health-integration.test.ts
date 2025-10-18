import { saudiHealthSystem } from "@/lib/saudi-health-integration";

describe("SaudiHealthSystemIntegration", () => {
  describe("Data Validation", () => {
    test("should validate Saudi National ID", () => {
      const validNationalId = "1234567890";
      const invalidNationalId = "123456789";

      // This would test the private method through public interface
      const validPatient = {
        nationalId: validNationalId,
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: "+966501234567",
        email: "ahmed@example.com",
      };

      const invalidPatient = {
        nationalId: invalidNationalId,
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: "+966501234567",
        email: "ahmed@example.com",
      };

      // Test validation through the validatePatientData method
      const validResult = saudiHealthSystem.validatePatientData(validPatient);
      const invalidResult =
        saudiHealthSystem.validatePatientData(invalidPatient);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
    });

    test("should validate Saudi phone number", () => {
      const validPhone = "+966501234567";
      const invalidPhone = "+1234567890";

      const validPatient = {
        nationalId: "1234567890",
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: validPhone,
        email: "ahmed@example.com",
      };

      const invalidPatient = {
        nationalId: "1234567890",
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: invalidPhone,
        email: "ahmed@example.com",
      };

      const validResult = saudiHealthSystem.validatePatientData(validPatient);
      const invalidResult =
        saudiHealthSystem.validatePatientData(invalidPatient);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
    });

    test("should validate email", () => {
      const validEmail = "ahmed@example.com";
      const invalidEmail = "invalid-email";

      const validPatient = {
        nationalId: "1234567890",
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: "+966501234567",
        email: validEmail,
      };

      const invalidPatient = {
        nationalId: "1234567890",
        fullName: "أحمد محمد",
        dateOfBirth: "1990-01-01",
        phone: "+966501234567",
        email: invalidEmail,
      };

      const validResult = saudiHealthSystem.validatePatientData(validPatient);
      const invalidResult =
        saudiHealthSystem.validatePatientData(invalidPatient);

      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
    });
  });

  describe("Insurance Integration", () => {
    test("should get insurance providers", () => {
      const providers = saudiHealthSystem.getInsuranceProviders();
      expect(providers.length).toBeGreaterThan(0);
      expect(providers[0]).toHaveProperty("id");
      expect(providers[0]).toHaveProperty("name");
      expect(providers[0]).toHaveProperty("code");
    });

    test("should get insurance provider by code", () => {
      const provider = saudiHealthSystem.getInsuranceProvider("tawuniya");
      expect(provider).toBeDefined();
      expect(provider?.name).toBe("التعاونية");
    });

    test("should verify insurance coverage", async () => {
      const coverage = await saudiHealthSystem.verifyInsuranceCoverage(
        "1234567890",
        "tawuniya"
      );
      expect(coverage).toHaveProperty("covered");
      expect(coverage).toHaveProperty("coverageType");
      expect(coverage).toHaveProperty("expiryDate");
      expect(coverage).toHaveProperty("remainingAmount");
    });

    test("should submit insurance claim", async () => {
      const claim = await saudiHealthSystem.submitInsuranceClaim({
        patientId: "patient-1",
        nationalId: "1234567890",
        providerCode: "tawuniya",
        serviceCode: "PT001",
        diagnosisCode: "F84.0",
        amount: 500,
        serviceDate: "2024-01-20",
        notes: "Physical therapy session",
      });

      expect(claim).toHaveProperty("id");
      expect(claim).toHaveProperty("patientId");
      expect(claim).toHaveProperty("providerId");
      expect(claim).toHaveProperty("claimNumber");
      expect(claim).toHaveProperty("status");
    });

    test("should check claim status", async () => {
      const status = await saudiHealthSystem.checkClaimStatus(
        "CL123456",
        "tawuniya"
      );
      expect(status).toHaveProperty("status");
    });
  });

  describe("Seha Integration", () => {
    test("should sync with Seha", async () => {
      const integration = await saudiHealthSystem.syncWithSeha(
        "patient-1",
        "1234567890"
      );
      expect(integration).toHaveProperty("patientId");
      expect(integration).toHaveProperty("sehaId");
      expect(integration).toHaveProperty("lastSync");
      expect(integration).toHaveProperty("status");
    });

    test("should get Seha health record", async () => {
      const healthRecord =
        await saudiHealthSystem.getSehaHealthRecord("1234567890");
      expect(healthRecord).toBeDefined();
      if (healthRecord) {
        expect(healthRecord).toHaveProperty("nationalId");
        expect(healthRecord).toHaveProperty("fullName");
        expect(healthRecord).toHaveProperty("dateOfBirth");
        expect(healthRecord).toHaveProperty("gender");
        expect(healthRecord).toHaveProperty("phone");
        expect(healthRecord).toHaveProperty("address");
        expect(healthRecord).toHaveProperty("insurance");
        expect(healthRecord).toHaveProperty("medicalHistory");
        expect(healthRecord).toHaveProperty("emergencyContact");
      }
    });
  });
});
