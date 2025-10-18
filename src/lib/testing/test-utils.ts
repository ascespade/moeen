import { createClient } from "@/lib/supabase/server";

import { logger } from "../monitoring/logger";

/**
 * Test Utilities - أدوات الاختبار
 * Comprehensive testing utilities and helpers
 */

interface TestUser {
  id: string;
  email: string;
  role: string;
  profile: Record<string, any>;

interface TestData {
  users: TestUser[];
  patients: any[];
  doctors: any[];
  appointments: any[];
  payments: any[];

class TestUtils {
  private supabase: any;
  private testData: TestData = {
    users: [],
    patients: [],
    doctors: [],
    appointments: [],
    payments: [],
  };

  constructor() {
    this.supabase = createClient();

  // Create test user
  async createTestUser(
    role: string = "patient",
    overrides: Partial<TestUser> = {},
  ): Promise<TestUser> {
    const testUser: TestUser = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: `test_${Date.now()}@example.com`,
      role,
      profile: {
        fullName: `Test User ${Date.now()}`,
        phone: "+966501234567",
        ...overrides.profile,
      },
      ...overrides,
    };

    // Create user in database
    const { error } = await this.supabase.from("users").insert({
      id: testUser.id,
      email: testUser.email,
      role: testUser.role,
      profile: testUser.profile,
      isActive: true,
    });

    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`);

    this.testData.users.push(testUser);
    return testUser;

  // Create test patient
  async createTestPatient(userId?: string): Promise<any> {
    const user = userId
      ? this.testData.users.find((u) => u.id === userId)
      : await this.createTestUser("patient");

    if (!user) throw new Error("User not found for patient creation");

    const patient = {
      id: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      fullName: user.profile.fullName,
      email: user.email,
      phone: user.profile.phone,
      medicalRecordNumber: `MR${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
      isActivated: true,
      insuranceProvider: "tawuniya",
      insuranceNumber: `INS${Date.now()}`,
    };

    const { error } = await this.supabase.from("patients").insert(patient);

    if (error) {
      throw new Error(`Failed to create test patient: ${error.message}`);

    this.testData.patients.push(patient);
    return patient;

  // Create test doctor
  async createTestDoctor(userId?: string): Promise<any> {
    const user = userId
      ? this.testData.users.find((u) => u.id === userId)
      : await this.createTestUser("doctor");

    if (!user) throw new Error("User not found for doctor creation");

    const doctor = {
      id: `doctor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      fullName: user.profile.fullName,
      email: user.email,
      phone: user.profile.phone,
      speciality: "General Practice",
      licenseNumber: `DR${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
      schedule: {
        0: { isWorking: false, startTime: "09:00", endTime: "17:00" },
        1: { isWorking: true, startTime: "09:00", endTime: "17:00" },
        2: { isWorking: true, startTime: "09:00", endTime: "17:00" },
        3: { isWorking: true, startTime: "09:00", endTime: "17:00" },
        4: { isWorking: true, startTime: "09:00", endTime: "17:00" },
        5: { isWorking: true, startTime: "09:00", endTime: "17:00" },
        6: { isWorking: false, startTime: "09:00", endTime: "17:00" },
    };

    const { error } = await this.supabase.from("doctors").insert(doctor);

    if (error) {
      throw new Error(`Failed to create test doctor: ${error.message}`);

    this.testData.doctors.push(doctor);
    return doctor;

  // Create test appointment
  async createTestAppointment(
    patientId?: string,
    doctorId?: string,
  ): Promise<any> {
    const patient = patientId
      ? this.testData.patients.find((p) => p.id === patientId)
      : await this.createTestPatient();

    const doctor = doctorId
      ? this.testData.doctors.find((d) => d.id === doctorId)
      : await this.createTestDoctor();

    const appointment = {
      id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      type: "consultation",
      status: "pending",
      paymentStatus: "unpaid",
      duration: 30,
      notes: "Test appointment",
    };

    const { error } = await this.supabase
      .from("appointments")
      .insert(appointment);

    if (error) {
      throw new Error(`Failed to create test appointment: ${error.message}`);

    this.testData.appointments.push(appointment);
    return appointment;

  // Create test payment
  async createTestPayment(appointmentId?: string): Promise<any> {
    const appointment = appointmentId
      ? this.testData.appointments.find((a) => a.id === appointmentId)
      : await this.createTestAppointment();

    const payment = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      appointmentId: appointment.id,
      amount: 200,
      currency: "SAR",
      method: "cash",
      status: "paid",
      transactionId: `TXN${Date.now()}`,
      description: "Test payment",
    };

    const { error } = await this.supabase.from("payments").insert(payment);

    if (error) {
      throw new Error(`Failed to create test payment: ${error.message}`);

    this.testData.payments.push(payment);
    return payment;

  // Clean up test data
  async cleanup(): Promise<void> {
    try {
      // Delete in reverse order to respect foreign key constraints
      if (this.testData.payments.length > 0) {
        await this.supabase
          .from("payments")
          .delete()
          .in(
            "id",
            this.testData.payments.map((p) => p.id),
          );

      if (this.testData.appointments.length > 0) {
        await this.supabase
          .from("appointments")
          .delete()
          .in(
            "id",
            this.testData.appointments.map((a) => a.id),
          );

      if (this.testData.patients.length > 0) {
        await this.supabase
          .from("patients")
          .delete()
          .in(
            "id",
            this.testData.patients.map((p) => p.id),
          );

      if (this.testData.doctors.length > 0) {
        await this.supabase
          .from("doctors")
          .delete()
          .in(
            "id",
            this.testData.doctors.map((d) => d.id),
          );

      if (this.testData.users.length > 0) {
        await this.supabase
          .from("users")
          .delete()
          .in(
            "id",
            this.testData.users.map((u) => u.id),
          );

      // Clear test data
      this.testData = {
        users: [],
        patients: [],
        doctors: [],
        appointments: [],
        payments: [],
      };

      logger.info("Test data cleaned up successfully");
    } catch (error) {
      logger.error("Failed to cleanup test data", error);
      throw error;
    }

  // Get test data
  getTestData(): TestData {
    return this.testData;

  // Mock API request
  mockRequest(
    method: string,
    url: string,
    body?: any,
    headers?: Record<string, string>,
  ): Request {
    return new Request(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  // Mock NextRequest
  mockNextRequest(
    method: string,
    url: string,
    body?: any,
    headers?: Record<string, string>,
  ): any {
    const request = this.mockRequest(method, url, body, headers);
    return {
      ...request,
      nextUrl: new URL(url),
      headers: new Headers(headers),
      json: async () => body || {},
    };

  // Wait for async operations
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));

  // Retry function
  async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxAttempts) {
          throw lastError;

        await this.wait(delay * attempt);
      }

    throw lastError!;
  }

// Export singleton instance
export const testUtils = new TestUtils();

// Export test data factory
export function createTestData() {
  return new TestUtils();

// Export cleanup function
export async function cleanupTestData(): Promise<void> {
  await testUtils.cleanup();
}}}}}}}}}}}}}}}}}}}}}}}}}}}}
}
