import { import { NextRequest } from "next/server"; } from 'next/server';
import { POST } from '@/app/api/auth/login/route';

// Mock Supabase
jest.mock('@/lib/supabaseClient', () => ({
  getServiceSupabase: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    })),
    auth: {
      signInWithPassword: jest.fn()
    }
  }))
}));

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for missing email', async() => {
    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'password123' })
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 for missing password', async() => {
    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Email and password are required');
  });

  it('handles test credentials successfully', async() => {
    const getServiceSupabase = require('@/lib/supabaseClient');
    let mockSupabase = getServiceSupabase();

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: {
        id: 'test-user-id',
        email: 'test@moeen.com',
        role: 'user',
        name: 'Test User'
      },
      error: null
    });

    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@moeen.com',
        password: 'test123',
        rememberMe: true
      })
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('test@moeen.com');
    expect(data.data.token).toContain('mock-jwt-token-');
  });

  it('handles Supabase auth for real users', async() => {
    const getServiceSupabase = require('@/lib/supabaseClient');
    let mockSupabase = getServiceSupabase();

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: { message: 'User not found' }
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'real-user-id',
            email: 'real@example.com'
          }
        }
      },
      error: null
    });

    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'real@example.com',
        password: 'realpassword',
        rememberMe: false
      })
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('real@example.com');
  });

  it('handles Supabase auth error', async() => {
    const getServiceSupabase = require('@/lib/supabaseClient');
    let mockSupabase = getServiceSupabase();

    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: { message: 'User not found' }
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    });

    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrongpassword',
        rememberMe: false
      })
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid credentials');
  });

  it('handles general errors', async() => {
    let request = new import { NextRequest } from "next/server";('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: 'invalid json'
    });

    let response = await POST(request);
    let data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Internal server error');
  });
});

