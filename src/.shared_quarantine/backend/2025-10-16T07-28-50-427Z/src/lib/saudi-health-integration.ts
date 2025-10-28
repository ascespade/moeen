// Saudi Health System Integration
export interface SaudiHealthRecord {
  nationalId: string;
  fullName: string;
  fullNameEn: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  phone: string;
  email?: string;
  address: {
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverageType: 'basic' | 'premium' | 'comprehensive';
  };
  medicalHistory: {
    chronicConditions: string[];
    allergies: string[];
    medications: string[];
    previousSurgeries: string[];
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface SehaIntegration {
  patientId: string;
  sehaId: string;
  lastSync: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  apiEndpoint: string;
  requiresApproval: boolean;
  coverageTypes: string[];
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  providerId: string;
  claimNumber: string;
  serviceCode: string;
  diagnosisCode: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export class SaudiHealthSystemIntegration {
  private sehaApiEndpoint: string;
  private insuranceProviders: Map<string, InsuranceProvider> = new Map();

  constructor() {
    this.sehaApiEndpoint =
      process.env.SEHA_API_ENDPOINT || 'https://api.seha.sa';
    this.initializeInsuranceProviders();
  }

  private initializeInsuranceProviders() {
    // Saudi insurance providers
    this.insuranceProviders.set('tawuniya', {
      id: 'tawuniya',
      name: 'التعاونية',
      code: 'TAW',
      apiEndpoint: 'https://api.tawuniya.com.sa',
      requiresApproval: true,
      coverageTypes: ['basic', 'premium', 'comprehensive'],
    });

    this.insuranceProviders.set('bupa', {
      id: 'bupa',
      name: 'بوبا العربية',
      code: 'BUPA',
      apiEndpoint: 'https://api.bupa.com.sa',
      requiresApproval: true,
      coverageTypes: ['premium', 'comprehensive'],
    });

    this.insuranceProviders.set('medgulf', {
      id: 'medgulf',
      name: 'ميدغلف',
      code: 'MED',
      apiEndpoint: 'https://api.medgulf.com.sa',
      requiresApproval: false,
      coverageTypes: ['basic', 'premium'],
    });

    this.insuranceProviders.set('axa', {
      id: 'axa',
      name: 'أكسا',
      code: 'AXA',
      apiEndpoint: 'https://api.axa.com.sa',
      requiresApproval: true,
      coverageTypes: ['basic', 'premium', 'comprehensive'],
    });
  }

  // Seha Platform Integration
  async syncWithSeha(
    patientId: string,
    nationalId: string
  ): Promise<SehaIntegration> {
    try {
      // In real implementation, this would call Seha API
      const __sehaResponse = await this.callSehaAPI(
        'GET',
        `/patients/${nationalId}`
      );

      if (sehaResponse.success) {
        return {
          patientId,
          sehaId: sehaResponse.data.sehaId,
          lastSync: new Date().toISOString(),
          status: 'active',
        };
      } else {
        throw new Error('Failed to sync with Seha platform');
      }
    } catch (error) {
      return {
        patientId,
        sehaId: '',
        lastSync: new Date().toISOString(),
        status: 'inactive',
      };
    }
  }

  async getSehaHealthRecord(
    nationalId: string
  ): Promise<SaudiHealthRecord | null> {
    try {
      const __response = await this.callSehaAPI(
        'GET',
        `/health-records/${nationalId}`
      );

      if (response.success) {
        return this.mapSehaToHealthRecord(response.data);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private mapSehaToHealthRecord(_sehaData: unknown): SaudiHealthRecord {
    return {
      nationalId: sehaData.nationalId,
      fullName: sehaData.fullName,
      fullNameEn: sehaData.fullNameEn,
      dateOfBirth: sehaData.dateOfBirth,
      gender: sehaData.gender,
      nationality: sehaData.nationality,
      phone: sehaData.phone,
      email: sehaData.email,
      address: {
        city: sehaData.address.city,
        district: sehaData.address.district,
        street: sehaData.address.street,
        postalCode: sehaData.address.postalCode,
      },
      insurance: {
        provider: sehaData.insurance.provider,
        policyNumber: sehaData.insurance.policyNumber,
        expiryDate: sehaData.insurance.expiryDate,
        coverageType: sehaData.insurance.coverageType,
      },
      medicalHistory: {
        chronicConditions: sehaData.medicalHistory.chronicConditions || [],
        allergies: sehaData.medicalHistory.allergies || [],
        medications: sehaData.medicalHistory.medications || [],
        previousSurgeries: sehaData.medicalHistory.previousSurgeries || [],
      },
      emergencyContact: {
        name: sehaData.emergencyContact.name,
        relationship: sehaData.emergencyContact.relationship,
        phone: sehaData.emergencyContact.phone,
      },
    };
  }

  // Insurance Integration
  async verifyInsuranceCoverage(
    nationalId: string,
    providerCode: string
  ): Promise<{
    covered: boolean;
    coverageType: string;
    expiryDate: string;
    remainingAmount: number;
  }> {
    try {
      const __provider = this.insuranceProviders.get(providerCode);
      if (!provider) {
        throw new Error('Insurance provider not found');
      }

      const __response = await this.callInsuranceAPI(
        provider,
        'POST',
        '/verify-coverage',
        {
          nationalId,
          serviceDate: new Date().toISOString(),
        }
      );

      if (response.success) {
        return {
          covered: response.data.covered,
          coverageType: response.data.coverageType,
          expiryDate: response.data.expiryDate,
          remainingAmount: response.data.remainingAmount,
        };
      }

      return {
        covered: false,
        coverageType: 'none',
        expiryDate: '',
        remainingAmount: 0,
      };
    } catch (error) {
      return {
        covered: false,
        coverageType: 'none',
        expiryDate: '',
        remainingAmount: 0,
      };
    }
  }

  async submitInsuranceClaim(_claimData: {
    patientId: string;
    nationalId: string;
    providerCode: string;
    serviceCode: string;
    diagnosisCode: string;
    amount: number;
    serviceDate: string;
    notes?: string;
  }): Promise<InsuranceClaim> {
    try {
      const __provider = this.insuranceProviders.get(claimData.providerCode);
      if (!provider) {
        throw new Error('Insurance provider not found');
      }

      const __response = await this.callInsuranceAPI(
        provider,
        'POST',
        '/submit-claim',
        {
          nationalId: claimData.nationalId,
          serviceCode: claimData.serviceCode,
          diagnosisCode: claimData.diagnosisCode,
          amount: claimData.amount,
          serviceDate: claimData.serviceDate,
          notes: claimData.notes,
        }
      );

      if (response.success) {
        return {
          id: response.data.claimId,
          patientId: claimData.patientId,
          providerId: claimData.providerCode,
          claimNumber: response.data.claimNumber,
          serviceCode: claimData.serviceCode,
          diagnosisCode: claimData.diagnosisCode,
          amount: claimData.amount,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
      }

      throw new Error('Failed to submit insurance claim');
    } catch (error) {
      throw error;
    }
  }

  async checkClaimStatus(
    claimNumber: string,
    providerCode: string
  ): Promise<{
    status: string;
    processedAt?: string;
    rejectionReason?: string;
  }> {
    try {
      const __provider = this.insuranceProviders.get(providerCode);
      if (!provider) {
        throw new Error('Insurance provider not found');
      }

      const __response = await this.callInsuranceAPI(
        provider,
        'GET',
        `/claims/${claimNumber}/status`
      );

      if (response.success) {
        return {
          status: response.data.status,
          processedAt: response.data.processedAt,
          rejectionReason: response.data.rejectionReason,
        };
      }

      const result: {
        status: string;
        processedAt?: string;
        rejectionReason?: string;
      } = {
        status: 'unknown',
      };
      return result;
    } catch (error) {
      const result: {
        status: string;
        processedAt?: string;
        rejectionReason?: string;
      } = {
        status: 'error',
        rejectionReason: 'System error',
      };
      return result;
    }
  }

  // Saudi Health Regulations Compliance
  validatePatientData(_patientData: Partial<SaudiHealthRecord>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // National ID validation (Saudi format)
    if (patientData.nationalId) {
      if (!this.isValidSaudiNationalId(patientData.nationalId)) {
        errors.push('رقم الهوية الوطنية غير صحيح');
      }
    }

    // Phone number validation (Saudi format)
    if (patientData.phone) {
      if (!this.isValidSaudiPhoneNumber(patientData.phone)) {
        errors.push('رقم الهاتف غير صحيح (يجب أن يبدأ بـ +966 أو 966)');
      }
    }

    // Email validation
    if (patientData.email) {
      if (!this.isValidEmail(patientData.email)) {
        errors.push('البريد الإلكتروني غير صحيح');
      }
    }

    // Age validation (must be between 0 and 120)
    if (patientData.dateOfBirth) {
      const __age = this.calculateAge(patientData.dateOfBirth);
      if (age < 0 || age > 120) {
        errors.push('العمر غير صحيح');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Utility Functions
  private isValidSaudiNationalId(_nationalId: string): boolean {
    // Saudi National ID format: 10 digits
    const __saudiIdRegex = /^[0-9]{10}$/;
    return saudiIdRegex.test(nationalId);
  }

  private isValidSaudiPhoneNumber(_phone: string): boolean {
    // Saudi phone number formats: +966xxxxxxxxx or 966xxxxxxxxx
    const __saudiPhoneRegex = /^(\+966|966)[0-9]{9}$/;
    return saudiPhoneRegex.test(phone);
  }

  private isValidEmail(_email: string): boolean {
    const __emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private calculateAge(_dateOfBirth: string): number {
    const __birthDate = new Date(dateOfBirth);
    const __today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const __monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  // API Call Methods
  private async callSehaAPI(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<any> {
    // In real implementation, this would make actual API calls
    // Mock response for development
    return {
      success: true,
      data: {
        sehaId: 'SEHA_' + Math.random().toString(36).substr(2, 9),
        nationalId: data?.nationalId || '1234567890',
        fullName: 'أحمد محمد الأحمد',
        fullNameEn: 'Ahmed Mohammed Al-Ahmad',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        nationality: 'Saudi',
        phone: '+966501234567',
        email: 'ahmed@example.com',
        address: {
          city: 'جدة',
          district: 'حي الصفا',
          street: 'شارع الأمير محمد بن عبدالعزيز',
          postalCode: '12345',
        },
        insurance: {
          provider: 'التعاونية',
          policyNumber: 'POL123456789',
          expiryDate: '2025-12-31',
          coverageType: 'comprehensive',
        },
        medicalHistory: {
          chronicConditions: ['السكري', 'ارتفاع ضغط الدم'],
          allergies: ['البنسلين'],
          medications: ['ميتفورمين', 'أملوديبين'],
          previousSurgeries: ['استئصال الزائدة الدودية'],
        },
        emergencyContact: {
          name: 'فاطمة الأحمد',
          relationship: 'زوجة',
          phone: '+966501234568',
        },
      },
    };
  }

  private async callInsuranceAPI(
    provider: InsuranceProvider,
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<any> {
    // In real implementation, this would make actual API calls to insurance providers
    // Mock response for development
    return {
      success: true,
      data: {
        claimId: 'CLAIM_' + Math.random().toString(36).substr(2, 9),
        claimNumber:
          'CL' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        status: 'pending',
        covered: true,
        coverageType: 'comprehensive',
        expiryDate: '2025-12-31',
        remainingAmount: 50000,
      },
    };
  }

  // Get available insurance providers
  getInsuranceProviders(): InsuranceProvider[] {
    return Array.from(this.insuranceProviders.values());
  }

  // Get insurance provider by code
  getInsuranceProvider(_code: string): InsuranceProvider | undefined {
    return this.insuranceProviders.get(code);
  }
}

export const __saudiHealthSystem = new SaudiHealthSystemIntegration();
