import { POST } from "@/app/api/auth/login/route";
import { NextRequest } from "next/server";

// Mock Supabase
jest.mock("@/lib/supabaseClient", () => ({
  getServiceSupabase: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
    auth: {
      signInWithPassword: jest.fn(),
    },
  })),
}));

describe("/api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for missing email", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password: "password123" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email and password are required");
  });

  it("returns 400 for missing password", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email and password are required");
  });

  it("handles test credentials successfully", async () => {
    const { getServiceSupabase } = require("@/lib/supabaseClient");
    const mockSupabase = getServiceSupabase();

    mockSupabase
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: {
          id: "test-user-id",
          email: "test@moeen.com",
          role: "user",
          name: "Test User",
        },
        error: null,
      });

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@moeen.com",
        password: "test123",
        rememberMe: true,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe("test@moeen.com");
    expect(data.data.token).toContain("mock-jwt-token-");
  });

  it("handles Supabase auth for real users", async () => {
    const { getServiceSupabase } = require("@/lib/supabaseClient");
    const mockSupabase = getServiceSupabase();

    mockSupabase
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {
          user: {
            id: "real-user-id",
            email: "real@example.com",
          },
        },
      },
      error: null,
    });

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "real@example.com",
        password: "realpassword",
        rememberMe: false,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe("real@example.com");
  });

  it("handles Supabase auth error", async () => {
    const { getServiceSupabase } = require("@/lib/supabaseClient");
    const mockSupabase = getServiceSupabase();

    mockSupabase
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "invalid@example.com",
        password: "wrongpassword",
        rememberMe: false,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid credentials");
  });

  it("handles general errors", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: "invalid json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Internal server error");
  });
});
