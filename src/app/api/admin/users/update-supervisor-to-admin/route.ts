import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Quick endpoint to update supervisor@test.local to admin with full permissions
 * This is a one-time utility endpoint
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const email = 'supervisor@test.local';

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update role to admin
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        role: 'admin',
        status: 'active',
        is_active: true,
        metadata: { permissions: ['*'] }, // Full permissions
      })
      .eq('id', userData.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Update user_roles table - remove old role, add admin role
    const { data: adminRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (adminRole?.id) {
      // Remove all existing role assignments
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userData.id);

      // Add admin role
      await supabase
        .from('user_roles')
        .upsert({
          user_id: userData.id,
          role_id: adminRole.id,
          is_active: true,
        }, { onConflict: 'user_id,role_id' });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated to admin successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('Error updating user to admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

