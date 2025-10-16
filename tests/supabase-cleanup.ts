/**
 * Supabase Database Cleanup Utility
 * This utility ensures clean test data for each test run
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseCleanup {
  /**
   * Clean all test data from the database
   */
  static async cleanTestData() {
    console.log("🧹 Cleaning test data from Supabase...");

    try {
      // Delete in order to respect foreign key constraints
      const tablesToClean = [
        "chatbot_appointments",
        "appointments",
        "sessions",
        "patients",
        "doctors",
        "conversations",
        "messages",
        "crm_leads",
        "crm_deals",
        "crm_activities",
        "notifications",
        "audit_logs",
        "users",
      ];

      for (const table of tablesToClean) {
        try {
          const { error } = await supabase
            .from(table)
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all except dummy record

          if (error) {
            console.warn(`⚠️ Warning cleaning ${table}:`, error.message);
          } else {
            console.log(`✅ Cleaned ${table}`);
          }
        } catch (err) {
          console.warn(`⚠️ Error cleaning ${table}:`, err);
        }
      }

      console.log("✅ Test data cleanup completed");
    } catch (error) {
      console.error("❌ Error during cleanup:", error);
      throw error;
    }
  }

  /**
   * Create test fixtures (test users and data)
   */
  static async createTestFixtures() {
    console.log("🔧 Creating test fixtures...");

    try {
      // Create test users
      const testUsers = [
        {
          id: "test-patient-a-id",
          email: "patient-a@test.com",
          name: "Patient A",
          role: "patient" as const,
          phone: "+966501234567",
          is_active: true,
          status: "active" as const,
        },
        {
          id: "test-patient-b-id",
          email: "patient-b@test.com",
          name: "Patient B",
          role: "patient" as const,
          phone: "+966501234568",
          is_active: true,
          status: "active" as const,
        },
        {
          id: "test-doctor-a-id",
          email: "doctor-a@test.com",
          name: "Doctor A",
          role: "doctor" as const,
          phone: "+966501234569",
          is_active: true,
          status: "active" as const,
        },
        {
          id: "test-admin-id",
          email: "admin@test.com",
          name: "Test Admin",
          role: "admin" as const,
          phone: "+966501234570",
          is_active: true,
          status: "active" as const,
        },
      ];

      // Insert test users
      for (const user of testUsers) {
        const { error } = await supabase
          .from("users")
          .upsert(user, { onConflict: "id" });

        if (error) {
          console.warn(
            `⚠️ Warning creating user ${user.email}:`,
            error.message,
          );
        } else {
          console.log(`✅ Created user: ${user.email}`);
        }
      }

      // Create test patients
      const testPatients = [
        {
          id: "test-patient-a-record-id",
          user_id: "test-patient-a-id",
          first_name: "أحمد",
          last_name: "محمد",
          phone: "+966501234567",
          email: "patient-a@test.com",
          date_of_birth: "1990-01-01",
          gender: "male" as const,
          medical_record_number: "MR001",
          insurance_number: "INS001",
        },
        {
          id: "test-patient-b-record-id",
          user_id: "test-patient-b-id",
          first_name: "فاطمة",
          last_name: "علي",
          phone: "+966501234568",
          email: "patient-b@test.com",
          date_of_birth: "1985-05-15",
          gender: "female" as const,
          medical_record_number: "MR002",
          insurance_number: "INS002",
        },
      ];

      for (const patient of testPatients) {
        const { error } = await supabase
          .from("patients")
          .upsert(patient, { onConflict: "id" });

        if (error) {
          console.warn(
            `⚠️ Warning creating patient ${patient.first_name}:`,
            error.message,
          );
        } else {
          console.log(
            `✅ Created patient: ${patient.first_name} ${patient.last_name}`,
          );
        }
      }

      // Create test doctors
      const testDoctors = [
        {
          id: "test-doctor-a-record-id",
          user_id: "test-doctor-a-id",
          first_name: "د. سعد",
          last_name: "العتيبي",
          phone: "+966501234569",
          email: "doctor-a@test.com",
          specialty: "أمراض القلب",
          license_number: "DOC001",
          experience_years: 10,
          consultation_fee: 200,
        },
      ];

      for (const doctor of testDoctors) {
        const { error } = await supabase
          .from("doctors")
          .upsert(doctor, { onConflict: "id" });

        if (error) {
          console.warn(
            `⚠️ Warning creating doctor ${doctor.first_name}:`,
            error.message,
          );
        } else {
          console.log(
            `✅ Created doctor: ${doctor.first_name} ${doctor.last_name}`,
          );
        }
      }

      console.log("✅ Test fixtures created successfully");
    } catch (error) {
      console.error("❌ Error creating test fixtures:", error);
      throw error;
    }
  }

  /**
   * Reset database to clean state for testing
   */
  static async resetForTesting() {
    console.log("🔄 Resetting database for testing...");
    await this.cleanTestData();
    await this.createTestFixtures();
    console.log("✅ Database reset completed");
  }
}

export default SupabaseCleanup;
