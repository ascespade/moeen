import { NextRequest, NextResponse } from 'next/server';
import { realDB } from '@/lib/supabase-real';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(['patient', 'doctor', 'admin', 'staff']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login':
        return await handleLogin(request, body);
      case 'register':
        return await handleRegister(request, body);
      case 'logout':
        return await handleLogout(request);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function handleLogin(request: NextRequest, body: any) {
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid login data', details: validation.error.issues },
      { status: 400 }
    );
  }

  const { email, password } = validation.data;

  // In a real implementation, you would verify the password
  // For now, we'll just check if the user exists
  try {
    const user = await realDB.getUserByPhone(email); // Using email as phone for now
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Login successful',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }
}

async function handleRegister(request: NextRequest, body: any) {
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid registration data', details: validation.error.issues },
      { status: 400 }
    );
  }

  const userData = validation.data;

  try {
    const user = await realDB.createUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role === 'staff' ? 'therapist' : userData.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

async function handleLogout(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Logout successful',
  });
}
