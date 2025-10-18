
}
interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  apiEndpoint: string;
  apiKey: string;
  supportedOperations: string[];
  isActive: boolean;

}
interface ClaimData {
  patientId: string;
  appointmentId: string;
  provider: string;
  amount: number;
  description: string;
  diagnosis?: string;
  treatment?: string;
  attachments?: string[];

}
interface ClaimResult {
  success: boolean;
  claimId?: string;
  status?: string;
  error?: string;
  referenceNumber?: string;

}

export class InsuranceProviderService {
  private providers: Map<string, InsuranceProvider> = new Map();

  constructor() {
    this.initializeProviders();

  private initializeProviders() {
    const providers: InsuranceProvider[] = [
  {
    id: "seha",
        name: "SEHA",
        code: "SEHA",
        apiEndpoint: process.env.SEHA_API_ENDPOINT || "https://api.seha.sa/v1",
        apiKey: process.env.SEHA_API_KEY || "",
        supportedOperations: ["verify_member", "create_claim", "check_status"],
        isActive: true,
      },
        {
    id: "shoon",
        name: "SHOON",
        code: "SHOON",
        apiEndpoint:
          process.env.SHOON_API_ENDPOINT || "https://api.shoon.sa/v1",
        apiKey: process.env.SHOON_API_KEY || "",
        supportedOperations: ["verify_member", "create_claim", "check_status"],
        isActive: true,
      },
        {
    id: "tatman",
        name: "TATMAN",
        code: "TATMAN",
        apiEndpoint:
          process.env.TATMAN_API_ENDPOINT || "https://api.tatman.sa/v1",
        apiKey: process.env.TATMAN_API_KEY || "",
        supportedOperations: ["verify_member", "create_claim", "check_status"],
        isActive: true,
      },
    ];

    providers.forEach((provider) => {
      this.providers.set(provider.code, provider);
    });

  async verifyMember(
    providerCode: string,
    memberId: string,
    dateOfBirth: string,
  ): Promise<ClaimResult> {
    const provider = this.providers.get(providerCode);
    if (!provider || !provider.isActive) {
      return { success: false, error: "Provider not found or inactive" };

    try {
      const response = await fetch(`${provider.apiEndpoint}/members/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id: memberId,
          date_of_birth: dateOfBirth,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Member verification failed",
        };

      return {
        success: true,
        status: result.status,
        referenceNumber: result.member_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }

  async createClaim(
    providerCode: string,
    claimData: ClaimData,
  ): Promise<ClaimResult> {
    const provider = this.providers.get(providerCode);
    if (!provider || !provider.isActive) {
      return { success: false, error: "Provider not found or inactive" };

    try {
      const response = await fetch(`${provider.apiEndpoint}/claims`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: claimData.patientId,
          appointment_id: claimData.appointmentId,
          amount: claimData.amount,
          description: claimData.description,
          diagnosis: claimData.diagnosis,
          treatment: claimData.treatment,
          attachments: claimData.attachments,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Claim creation failed",
        };

      return {
        success: true,
        claimId: result.claim_id,
        status: result.status,
        referenceNumber: result.reference_number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Claim creation failed",
      };
    }

  async checkClaimStatus(
    providerCode: string,
    claimId: string,
  ): Promise<ClaimResult> {
    const provider = this.providers.get(providerCode);
    if (!provider || !provider.isActive) {
      return { success: false, error: "Provider not found or inactive" };

    try {
      const response = await fetch(
        `${provider.apiEndpoint}/claims/${claimId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
          },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Status check failed",
        };

      return {
        success: true,
        claimId: result.claim_id,
        status: result.status,
        referenceNumber: result.reference_number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      };
    }

  async submitClaim(
    providerCode: string,
    claimId: string,
  ): Promise<ClaimResult> {
    const provider = this.providers.get(providerCode);
    if (!provider || !provider.isActive) {
      return { success: false, error: "Provider not found or inactive" };

    try {
      const response = await fetch(
        `${provider.apiEndpoint}/claims/${claimId}/submit`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Claim submission failed",
        };

      return {
        success: true,
        claimId: result.claim_id,
        status: result.status,
        referenceNumber: result.reference_number,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Claim submission failed",
      };
    }

  getProviders(): InsuranceProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.isActive);

  getProvider(code: string): InsuranceProvider | undefined {
    return this.providers.get(code);
  }

export const insuranceService = new InsuranceProviderService();
}}}}}}}}}}}}}}}
}}
}
