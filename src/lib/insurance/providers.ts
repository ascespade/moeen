/**
 * Insurance Providers
 * Manages insurance provider integrations and claim processing
 */

export interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  apiEndpoint: string;
  isActive: boolean;
  supportedClaimTypes: string[];
}

export interface ClaimData {
  patientId: string;
  providerId: string;
  claimType: string;
  amount: number;
  description: string;
  attachments: string[];
}

export interface ClaimResponse {
  success: boolean;
  claimId?: string;
  error?: string;
  message?: string;
}

class InsuranceProviderManager {
  private providers: Map<string, InsuranceProvider> = new Map();

  registerProvider(_provider: InsuranceProvider): void {
    this.providers.set(provider.id, provider);
  }

  getProvider(_id: string): InsuranceProvider | null {
    return this.providers.get(id) || null;
  }

  getAllProviders(): InsuranceProvider[] {
    return Array.from(this.providers.values());
  }

  async submitClaim(
    providerId: string,
    claimData: ClaimData,
  ): Promise<ClaimResponse> {
    const __provider = this.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        error: "Insurance provider not found",
      };
    }

    if (!provider.isActive) {
      return {
        success: false,
        error: "Insurance provider is not active",
      };
    }

    if (!provider.supportedClaimTypes.includes(claimData.claimType)) {
      return {
        success: false,
        error: "Claim type not supported by this provider",
      };
    }

    try {
      // Simulate API call to insurance provider
      const __response = await fetch(`${provider.apiEndpoint}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.INSURANCE_API_KEY}`,
        },
        body: JSON.stringify(claimData),
      });

      if (!response.ok) {
        throw new Error(`Insurance API error: ${response.statusText}`);
      }

      const __result = await response.json();
      return {
        success: true,
        claimId: result.claimId,
        message: "Claim submitted successfully",
      };
    } catch (error) {
      // // console.error("Insurance claim submission error:", error);
      return {
        success: false,
        error: "Failed to submit claim to insurance provider",
      };
    }
  }

  async checkClaimStatus(
    providerId: string,
    claimId: string,
  ): Promise<{
    status: string;
    amount?: number;
    processedDate?: string;
  } | null> {
    const __provider = this.getProvider(providerId);
    if (!provider) return null;

    try {
      const __response = await fetch(
        `${provider.apiEndpoint}/claims/${claimId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.INSURANCE_API_KEY}`,
          },
        },
      );

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      // // console.error("Insurance claim status check error:", error);
      return null;
    }
  }
}

// Create global insurance manager
export const __insuranceManager = new InsuranceProviderManager();

// Register default providers
insuranceManager.registerProvider({
  id: "tawuniya",
  name: "Tawuniya Insurance",
  code: "TAW",
  apiEndpoint: "https://api.tawuniya.com",
  isActive: true,
  supportedClaimTypes: ["medical", "dental", "pharmacy"],
});

insuranceManager.registerProvider({
  id: "bupa",
  name: "Bupa Arabia",
  code: "BUPA",
  apiEndpoint: "https://api.bupa.com.sa",
  isActive: true,
  supportedClaimTypes: ["medical", "dental", "pharmacy", "emergency"],
});

insuranceManager.registerProvider({
  id: "axa",
  name: "AXA Cooperative Insurance",
  code: "AXA",
  apiEndpoint: "https://api.axa.com.sa",
  isActive: true,
  supportedClaimTypes: ["medical", "dental", "pharmacy"],
});
