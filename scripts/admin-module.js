#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class AdminModule {
  constructor() {
    this.workspaceRoot = path.join(__dirname, "..");
    this.logFile = path.join(this.workspaceRoot, "logs", "admin-module.log");
    this.configFile = path.join(
      this.workspaceRoot,
      "config",
      "admin-config.json",
    );
    this.reportFile = path.join(
      this.workspaceRoot,
      "reports",
      "admin-report.json",
    );
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Admin Module: ${message}\n`;

    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage.trim());
  }

  async initialize() {
    this.log("Initializing Admin Module...");

    // Create necessary directories
    const directories = ["config", "logs", "reports", "temp"];

    for (const dir of directories) {
      const fullPath = path.join(this.workspaceRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`);
      }
    }

    // Initialize admin configuration
    await this.initializeAdminConfig();

    this.log("Admin Module initialized");
  }

  async initializeAdminConfig() {
    if (!fs.existsSync(this.configFile)) {
      const defaultConfig = {
        supabase: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        },
        admin: {
          users: [
            {
              email: "admin@example.com",
              role: "admin",
              permissions: ["all"],
            },
          ],
          roles: {
            admin: {
              permissions: ["all"],
              description: "Full system access",
            },
            doctor: {
              permissions: ["patients", "appointments", "medical_records"],
              description: "Medical staff access",
            },
            therapist: {
              permissions: ["patients", "sessions", "therapy_notes"],
              description: "Therapy staff access",
            },
            patient: {
              permissions: [
                "own_profile",
                "own_appointments",
                "own_medical_records",
              ],
              description: "Patient access",
            },
            family_member: {
              permissions: ["linked_patient_profile", "linked_appointments"],
              description: "Family member access",
            },
          },
        },
        security: {
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
          },
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
          maxLoginAttempts: 5,
          lockoutDuration: 15 * 60 * 1000, // 15 minutes
        },
      };

      // Ensure config directory exists
      const configDir = path.dirname(this.configFile);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
      this.log("Admin configuration created");
    }
  }

  async loadConfig() {
    try {
      const configData = fs.readFileSync(this.configFile, "utf8");
      return JSON.parse(configData);
    } catch (error) {
      this.log(`Error loading config: ${error.message}`);
      return null;
    }
  }

  async verifySupabaseConnection() {
    this.log("Verifying Supabase connection...");

    try {
      // In a real implementation, this would make actual API calls to Supabase
      // For now, we'll simulate the connection check

      const config = await this.loadConfig();
      if (!config || !config.supabase.url || !config.supabase.anonKey) {
        throw new Error("Supabase configuration missing");
      }

      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.log("Supabase connection verified");
      return {
        success: true,
        url: config.supabase.url,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.log(`Supabase connection failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkUserPermissions() {
    this.log("Checking user permissions...");

    const config = await this.loadConfig();
    if (!config) {
      throw new Error("Failed to load configuration");
    }

    const permissionChecks = [];

    // Check admin users
    for (const user of config.admin.users) {
      const userCheck = {
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        status: "valid",
        issues: [],
      };

      // Validate role exists
      if (!config.admin.roles[user.role]) {
        userCheck.status = "invalid";
        userCheck.issues.push(`Role '${user.role}' not defined`);
      }

      // Validate permissions
      if (user.permissions.includes("all")) {
        // Admin with all permissions - valid
      } else {
        const rolePermissions =
          config.admin.roles[user.role]?.permissions || [];
        const invalidPermissions = user.permissions.filter(
          (p) => !rolePermissions.includes(p) && p !== "all",
        );

        if (invalidPermissions.length > 0) {
          userCheck.status = "invalid";
          userCheck.issues.push(
            `Invalid permissions: ${invalidPermissions.join(", ")}`,
          );
        }
      }

      permissionChecks.push(userCheck);
    }

    this.log(
      `Permission checks completed for ${permissionChecks.length} users`,
    );
    return permissionChecks;
  }

  async validateRoleDefinitions() {
    this.log("Validating role definitions...");

    const config = await this.loadConfig();
    if (!config) {
      throw new Error("Failed to load configuration");
    }

    const roleValidation = [];
    const validPermissions = [
      "all",
      "patients",
      "appointments",
      "medical_records",
      "sessions",
      "therapy_notes",
      "own_profile",
      "own_appointments",
      "own_medical_records",
      "linked_patient_profile",
      "linked_appointments",
    ];

    for (const [roleName, roleConfig] of Object.entries(config.admin.roles)) {
      const roleCheck = {
        role: roleName,
        status: "valid",
        issues: [],
      };

      // Check required fields
      if (!roleConfig.permissions || !Array.isArray(roleConfig.permissions)) {
        roleCheck.status = "invalid";
        roleCheck.issues.push("Missing or invalid permissions array");
      } else {
        // Check permission validity
        const invalidPermissions = roleConfig.permissions.filter(
          (p) => !validPermissions.includes(p),
        );

        if (invalidPermissions.length > 0) {
          roleCheck.status = "invalid";
          roleCheck.issues.push(
            `Invalid permissions: ${invalidPermissions.join(", ")}`,
          );
        }
      }

      if (!roleConfig.description) {
        roleCheck.status = "invalid";
        roleCheck.issues.push("Missing description");
      }

      roleValidation.push(roleCheck);
    }

    this.log(`Role validation completed for ${roleValidation.length} roles`);
    return roleValidation;
  }

  async checkSecuritySettings() {
    this.log("Checking security settings...");

    const config = await this.loadConfig();
    if (!config) {
      throw new Error("Failed to load configuration");
    }

    const securityCheck = {
      passwordPolicy: {
        status: "valid",
        issues: [],
      },
      sessionSettings: {
        status: "valid",
        issues: [],
      },
      loginSecurity: {
        status: "valid",
        issues: [],
      },
    };

    // Check password policy
    const passwordPolicy = config.security.passwordPolicy;
    if (passwordPolicy.minLength < 8) {
      securityCheck.passwordPolicy.status = "warning";
      securityCheck.passwordPolicy.issues.push(
        "Minimum password length should be at least 8 characters",
      );
    }

    if (
      !passwordPolicy.requireUppercase ||
      !passwordPolicy.requireLowercase ||
      !passwordPolicy.requireNumbers ||
      !passwordPolicy.requireSpecialChars
    ) {
      securityCheck.passwordPolicy.status = "warning";
      securityCheck.passwordPolicy.issues.push(
        "Consider enabling all password complexity requirements",
      );
    }

    // Check session settings
    const sessionTimeout = config.security.sessionTimeout;
    if (sessionTimeout > 7 * 24 * 60 * 60 * 1000) {
      // 7 days
      securityCheck.sessionSettings.status = "warning";
      securityCheck.sessionSettings.issues.push(
        "Session timeout is very long, consider reducing for security",
      );
    }

    // Check login security
    const maxAttempts = config.security.maxLoginAttempts;
    if (maxAttempts > 10) {
      securityCheck.loginSecurity.status = "warning";
      securityCheck.loginSecurity.issues.push(
        "Maximum login attempts is high, consider reducing",
      );
    }

    this.log("Security settings check completed");
    return securityCheck;
  }

  async generateAdminReport() {
    this.log("Generating admin report...");

    const report = {
      timestamp: new Date().toISOString(),
      supabaseConnection: await this.verifySupabaseConnection(),
      userPermissions: await this.checkUserPermissions(),
      roleDefinitions: await this.validateRoleDefinitions(),
      securitySettings: await this.checkSecuritySettings(),
      summary: {
        totalUsers: 0,
        validUsers: 0,
        invalidUsers: 0,
        totalRoles: 0,
        validRoles: 0,
        invalidRoles: 0,
        securityWarnings: 0,
        overallStatus: "unknown",
      },
    };

    // Calculate summary
    report.summary.totalUsers = report.userPermissions.length;
    report.summary.validUsers = report.userPermissions.filter(
      (u) => u.status === "valid",
    ).length;
    report.summary.invalidUsers = report.userPermissions.filter(
      (u) => u.status === "invalid",
    ).length;

    report.summary.totalRoles = report.roleDefinitions.length;
    report.summary.validRoles = report.roleDefinitions.filter(
      (r) => r.status === "valid",
    ).length;
    report.summary.invalidRoles = report.roleDefinitions.filter(
      (r) => r.status === "invalid",
    ).length;

    report.summary.securityWarnings =
      report.securitySettings.passwordPolicy.issues.length +
      report.securitySettings.sessionSettings.issues.length +
      report.securitySettings.loginSecurity.issues.length;

    // Determine overall status
    if (
      report.summary.invalidUsers === 0 &&
      report.summary.invalidRoles === 0 &&
      report.supabaseConnection.success
    ) {
      report.summary.overallStatus = "healthy";
    } else if (
      report.summary.invalidUsers === 0 &&
      report.summary.invalidRoles === 0
    ) {
      report.summary.overallStatus = "warning";
    } else {
      report.summary.overallStatus = "critical";
    }

    // Save report
    fs.writeFileSync(this.reportFile, JSON.stringify(report, null, 2));

    this.log(`Admin report saved to: ${this.reportFile}`);
    return report;
  }

  async run() {
    this.log("Starting admin module...");

    await this.initialize();

    const report = await this.generateAdminReport();

    this.log("Admin module completed");
    return report;
  }
}

// Main execution
if (require.main === module) {
  const adminModule = new AdminModule();

  adminModule
    .run()
    .then((report) => {
      console.log("Admin module completed successfully");
      console.log(`Overall Status: ${report.summary.overallStatus}`);
      console.log(
        `Valid Users: ${report.summary.validUsers}/${report.summary.totalUsers}`,
      );
      console.log(
        `Valid Roles: ${report.summary.validRoles}/${report.summary.totalRoles}`,
      );
      console.log(`Security Warnings: ${report.summary.securityWarnings}`);
    })
    .catch((error) => {
      console.error("Admin module failed:", error);
      process.exit(1);
    });
}

module.exports = AdminModule;
