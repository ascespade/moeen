import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with your actual database
let userPreferences: { [key: string]: string } = {
  theme: 'light',
  language: 'ar'
};

export async function GET() {
  try {
    // In a real app, you would fetch from your database
    // const userId = getUserIdFromSession(); // Get user ID from session/auth
    // const preferences = await db.userPreferences.findUnique({ where: { userId } });
    
    return NextResponse.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // In a real app, you would save to your database
    // const userId = getUserIdFromSession(); // Get user ID from session/auth
    // await db.userPreferences.upsert({
    //   where: { userId },
    //   update: { [key]: value },
    //   create: { userId, [key]: value }
    // });
    
    // Mock database update
    userPreferences[key] = value;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving user preference:', error);
    return NextResponse.json(
      { error: 'Failed to save preference' },
      { status: 500 }
    );
  }
}
