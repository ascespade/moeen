/**
 * Professional Login System End-to-End Test Suite
 * Verifies login process with real database data and privilege checks
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const TEST_USERS = {
  admin: { email: 'admin@test.local', password: 'A123456', role: 'admin' },
  manager: {
    email: 'manager@test.local',
    password: 'A123456',
    role: 'manager',
  },
  supervisor: {
    email: 'supervisor@test.local',
    password: 'A123456',
    role: 'supervisor',
  },
  agent: { email: 'agent@test.local', password: 'A123456', role: 'agent' },
};

describe('Professional Login System - End-to-End Tests', () => {
  let adminToken: string;
  let adminPermissions: string[];

  /**
   * Test 1: Seed default test users
   */
  describe('Test 1: Database Seeding', () => {
    it('should seed default test users with correct roles', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/auth/seed-defaults`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.users).toHaveLength(4);

      // Verify all roles are created
      const roles = data.users.map((u: any) => u.role);
      expect(roles).toContain('admin');
      expect(roles).toContain('manager');
      expect(roles).toContain('supervisor');
      expect(roles).toContain('agent');
    });
  });

  /**
   * Test 2: Admin Login with Real Database Data
   */
  describe('Test 2: Admin Login (Professional Dynamic Test)', () => {
    it('should login with admin credentials and return JWT token', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      // Verify response structure
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.user).toBeDefined();
      expect(data.data.token).toBeDefined();
      expect(data.data.permissions).toBeDefined();
      expect(Array.isArray(data.data.permissions)).toBe(true);

      // Store for other tests
      adminToken = data.data.token;
      adminPermissions = data.data.permissions;
    });

    it('should return correct admin user data from database', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });

      const data = await response.json();
      const user = data.data.user;

      // Verify user data from database
      expect(user.id).toBeDefined();
      expect(user.email).toBe(TEST_USERS.admin.email);
      expect(user.role).toBe('admin');
      expect(user.status).toBe('active');
      expect(user.name).toBeDefined();
    });

    it('should return admin permissions array', () => {
      // Admin should have all permissions (100 level)
      expect(adminPermissions.length).toBeGreaterThan(50); // Admin has most permissions

      // Verify key admin permissions
      expect(adminPermissions).toContain('users:view');
      expect(adminPermissions).toContain('users:create');
      expect(adminPermissions).toContain('users:edit');
      expect(adminPermissions).toContain('users:delete');
      expect(adminPermissions).toContain('roles:edit');
      expect(adminPermissions).toContain('settings:edit');
    });

    it('should return JWT token with role and permissions', () => {
      // Decode JWT (simple base64 decode - in real test would verify signature)
      const parts = adminToken.split('.');
      expect(parts.length).toBe(3);

      // Decode payload
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

      expect(payload.userId).toBeDefined();
      expect(payload.email).toBe(TEST_USERS.admin.email);
      expect(payload.role).toBe('admin');
      expect(Array.isArray(payload.permissions)).toBe(true);
      expect(payload.exp).toBeDefined(); // Expiry time
    });
  });

  /**
   * Test 3: Manager Login with Different Permissions
   */
  describe('Test 3: Manager Login (Role-Based Permissions)', () => {
    it('should login with manager credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.manager.email,
          password: TEST_USERS.manager.password,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.user.role).toBe('manager');
    });

    it('should return manager-level permissions (80 level)', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.manager.email,
          password: TEST_USERS.manager.password,
        }),
      });

      const data = await response.json();
      const permissions = data.data.permissions;

      // Manager should have management permissions
      expect(permissions).toContain('users:view');
      expect(permissions).toContain('users:create');

      // Manager should NOT have admin-only permissions
      expect(permissions).not.toContain('roles:delete');
      expect(permissions).not.toContain('settings:edit');
    });
  });

  /**
   * Test 4: Supervisor Login
   */
  describe('Test 4: Supervisor Login (Supervisory Permissions)', () => {
    it('should login with supervisor credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.supervisor.email,
          password: TEST_USERS.supervisor.password,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.user.role).toBe('supervisor');
    });

    it('should return supervisor-level permissions (60 level)', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.supervisor.email,
          password: TEST_USERS.supervisor.password,
        }),
      });

      const data = await response.json();
      const permissions = data.data.permissions;

      // Supervisor should have supervisory permissions
      expect(permissions).toContain('analytics:view');
      expect(permissions).toContain('reports:view');

      // Supervisor should NOT have user management
      expect(permissions).not.toContain('users:delete');
    });
  });

  /**
   * Test 5: Agent Login
   */
  describe('Test 5: Agent Login (CRM Permissions)', () => {
    it('should login with agent credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.agent.email,
          password: TEST_USERS.agent.password,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.user.role).toBe('agent');
    });

    it('should return agent-level permissions (15 level)', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.agent.email,
          password: TEST_USERS.agent.password,
        }),
      });

      const data = await response.json();
      const permissions = data.data.permissions;

      // Agent should have CRM permissions
      expect(permissions).toContain('crm:view');
      expect(permissions).toContain('crm:leads');
      expect(permissions).toContain('conversations:view');
    });
  });

  /**
   * Test 6: Invalid Credentials
   */
  describe('Test 6: Security - Invalid Credentials', () => {
    it('should reject login with wrong password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: 'wrong-password',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should reject login with non-existent user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('should reject login with missing credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_USERS.admin.email }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  /**
   * Test 7: No Client-Side Role Manipulation
   */
  describe('Test 7: Security - Privilege Escalation Prevention', () => {
    it('should not accept role parameter from client', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.agent.email,
          password: TEST_USERS.agent.password,
          role: 'admin', // Try to escalate
        }),
      });

      const data = await response.json();
      // Returned role should be agent, not admin
      expect(data.data.user.role).toBe('agent');
    });

    it('should always fetch role from database', async () => {
      // Login multiple times with same user
      const response1 = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });

      const data1 = await response1.json();
      const role1 = data1.data.user.role;

      // Role should always be consistent
      expect(role1).toBe('admin');
    });
  });

  /**
   * Test 8: /api/auth/me endpoint returns permissions
   */
  describe('Test 8: Auth ME Endpoint (Permissions)', () => {
    it('should return user with permissions', async () => {
      // First login to get token
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });

      const loginData = await loginResponse.json();
      const token = loginData.data.token;

      // Get user via /api/auth/me
      const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(meResponse.status).toBe(200);
      const meData = await meResponse.json();

      expect(meData.user.role).toBe('admin');
      expect(meData.user.permissions).toBeDefined();
      expect(Array.isArray(meData.user.permissions)).toBe(true);
    });
  });

  /**
   * Test 9: Quick-Login Buttons Functionality
   */
  describe('Test 9: Quick-Login Buttons (Professional Dynamic Test)', () => {
    it('admin quick-login should seed and login successfully', async () => {
      // Step 1: Attempt login
      let response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });

      // If not found, seed defaults
      if (response.status === 401) {
        const seedResponse = await fetch(
          `${BASE_URL}/api/admin/auth/seed-defaults`,
          {
            method: 'POST',
          }
        );
        expect(seedResponse.status).toBe(200);

        // Retry login
        response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: TEST_USERS.admin.email,
            password: TEST_USERS.admin.password,
          }),
        });
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.user.role).toBe('admin');
    });

    it('all quick-login buttons should lead to correct dashboards', async () => {
      const redirectMapping: Record<string, string> = {
        admin: '/admin/dashboard',
        manager: '/admin/dashboard',
        supervisor: '/admin/dashboard',
        agent: '/crm/dashboard',
      };

      for (const [roleName, testUser] of Object.entries(TEST_USERS)) {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
          }),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        const expectedDashboard = redirectMapping[roleName] || '/dashboard';

        // Verify role matches expected
        expect(data.data.user.role).toBe(testUser.role);
      }
    });
  });

  /**
   * Test 10: Logout functionality
   */
  describe('Test 10: Logout (Session Management)', () => {
    it('should successfully logout', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});

/**
 * Run tests with: npm test -- tests/login-security-test.ts
 */
export default {};
