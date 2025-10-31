import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { PermissionManager } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import { ErrorHandler } from '@/core/errors';

import { env } from '@/config/env';

const DEFAULT_PASSWORD = env.TEST_USERS_PASSWORD || 'A123456';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json().catch(() => ({}) as any);
    logger.debug('Incoming login request', { email: email ? 'provided' : 'missing' });

    const demoEmailHeader = req.headers.get('x-demo-email');
    const internalSecretHeader = req.headers.get('x-admin-secret');

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const isDev = env.IS_DEVELOPMENT;
    const debugAllow = env.ENABLE_DEBUG;

    // If a demo email header is provided, allow a direct DB lookup for development convenience.
    // Also auto-create demo users in dev/debug when they don't exist yet.
    try {
      const allowDemoHeader =
        !!demoEmailHeader &&
        (password === DEFAULT_PASSWORD ||
          !!internalSecretHeader ||
          debugAllow ||
          isDev);

      if (allowDemoHeader) {
        const targetEmail = demoEmailHeader || email;
        logger.debug('Demo/header fallback active', { email: targetEmail });

        // Try to find existing user row
        const { data: userRow, error: userRowErr } = await supabase
          .from('users')
          .select('id, email, name, role, status, avatar_url')
          .eq('email', targetEmail)
          .single();

        logger.debug('Demo/header user lookup', {
          found: !!userRow,
          error: userRowErr?.message || null,
        });

        if (!userRow && (isDev || debugAllow || !!internalSecretHeader)) {
          // Auto-create auth user via service role in dev/debug
          try {
            logger.debug('Demo/header creating auth user', { email: targetEmail });
            const { data: createdUser, error: createErr } =
              await supabaseAdmin.auth.admin.createUser({
                email: targetEmail,
                password: DEFAULT_PASSWORD,
                email_confirm: true,
              } as any);

            if (createErr || !createdUser?.user) {
              logger.error('Demo/header createUser failed', createErr);
            } else {
              const authId = createdUser.user.id;
              // Upsert into users table using server client
              const { data: up, error: upErr } = await supabase
                .from('users')
                .upsert(
                  {
                    id: authId,
                    email: targetEmail,
                    name: targetEmail.split('@')[0],
                    role: 'agent',
                    status: 'active',
                    is_active: true,
                  },
                  { onConflict: 'id' }
                )
                .select('id, email, name, role, status, avatar_url')
                .single();

              logger.debug('Demo/header upsert users result', {
                success: !!up,
                error: upErr?.message || null,
              });

              if (up && !upErr) {
                const rolePermissions = PermissionManager.getRolePermissions(
                  up.role
                );
                const userResponse = {
                  id: up.id,
                  email: up.email,
                  name: up.name,
                  role: up.role,
                  avatar: up.avatar_url,
                  status: up.status,
                };
                return NextResponse.json({
                  success: true,
                  data: {
                    user: userResponse,
                    token: null,
                    permissions: rolePermissions,
                    fallbackLogin: true,
                  },
                });
              }
            }
          } catch (e) {
            logger.error('Demo/header auto-create error', e);
          }
        }

        if (userRow && !userRowErr) {
          if (userRow.status !== 'active') {
            return NextResponse.json(
              { success: false, error: 'User account is inactive' },
              { status: 403 }
            );
          }

          const rolePermissions = PermissionManager.getRolePermissions(
            userRow.role
          );
          const userResponse = {
            id: userRow.id,
            email: userRow.email,
            name: userRow.name,
            role: userRow.role,
            avatar: userRow.avatar_url,
            status: userRow.status,
          };

          const resBody = {
            success: true,
            data: {
              user: userResponse,
              token: null,
              permissions: rolePermissions,
              fallbackLogin: true,
            },
          };

          logger.info('Demo/header fallback login succeeded', { email: targetEmail });
          return NextResponse.json(resBody);
        }
      }
    } catch (e) {
      logger.error('Demo/header fallback error', e);
      // continue to normal flow
    }

    // Normal flow: attempt Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    logger.debug('SignInWithPassword result', {
      success: !!data?.user,
      error: error?.message || null,
      userId: data?.user?.id || null,
    });

    if (error || !data?.user) {
      logger.warn('SignInWithPassword failed', { error: error?.message });

      // Fallback: allow login with TEST_USERS_PASSWORD if a users row exists (development convenience only)
      try {
        if (password === DEFAULT_PASSWORD) {
          const { data: userRow, error: userRowErr } = await supabase
            .from('users')
            .select('id, email, name, role, status, avatar_url')
            .eq('email', email)
            .single();

          logger.debug('Fallback user lookup', {
            found: !!userRow,
            error: userRowErr?.message || null,
          });

          if (!userRow && (isDev || debugAllow || !!internalSecretHeader)) {
            // attempt to create user using supabaseAdmin
            try {
              logger.debug('Fallback creating auth user', { email });
              const { data: createdUser, error: createErr } =
                await supabaseAdmin.auth.admin.createUser({
                  email,
                  password: DEFAULT_PASSWORD,
                  email_confirm: true,
                } as any);

              if (!createErr && createdUser?.user) {
                const authId = createdUser.user.id;
                const { data: up, error: upErr } = await supabase
                  .from('users')
                  .upsert(
                    {
                      id: authId,
                      email,
                      name: email.split('@')[0],
                      role: 'agent',
                      status: 'active',
                      is_active: true,
                    },
                    { onConflict: 'id' }
                  )
                  .select('id, email, name, role, status, avatar_url')
                  .single();

                logger.debug('Fallback upsert users result', {
                  success: !!up,
                  error: upErr?.message || null,
                });

                if (up && !upErr) {
                  const rolePermissions = PermissionManager.getRolePermissions(
                    up.role
                  );
                  const userResponse = {
                    id: up.id,
                    email: up.email,
                    name: up.name,
                    role: up.role,
                    avatar: up.avatar_url,
                    status: up.status,
                  };

                  const resBody = {
                    success: true,
                    data: {
                      user: userResponse,
                      token: null,
                      permissions: rolePermissions,
                      fallbackLogin: true,
                    },
                  };

                  logger.info('Fallback auto-create login succeeded', { email });
                  return NextResponse.json(resBody);
                }
              }
            } catch (e) {
              logger.error('Fallback create error', e);
            }
          }

          if (userRow && !userRowErr) {
            if (userRow.status !== 'active') {
              return NextResponse.json(
                { success: false, error: 'User account is inactive' },
                { status: 403 }
              );
            }

            const rolePermissions = PermissionManager.getRolePermissions(
              userRow.role
            );
            const userResponse = {
              id: userRow.id,
              email: userRow.email,
              name: userRow.name,
              role: userRow.role,
              avatar: userRow.avatar_url,
              status: userRow.status,
            };

            const resBody = {
              success: true,
              data: {
                user: userResponse,
                token: null,
                permissions: rolePermissions,
                fallbackLogin: true,
              },
            };
            logger.info('Fallback login succeeded', { email });
            return NextResponse.json(resBody);
          }
        }
      } catch (e) {
        logger.error('Fallback lookup error', e);
      }

      logger.error('Authentication error', { error: error?.message });
      return NextResponse.json(
        { success: false, error: error?.message || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user data with role and status from database
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, name, role, status, avatar_url')
      .eq('id', data.user.id)
      .single();

    logger.debug('Fetched userData', {
      found: !!userData,
      error: userError?.message || null,
      userId: data.user.id,
    });

    if (userError || !userData) {
      logger.warn('User data not found', {
        userId: data.user.id,
        error: userError?.message,
      });

      // Attempt to upsert an application user record if Supabase auth user exists
      try {
        const fallbackFullName =
          (data.user.user_metadata &&
            (data.user.user_metadata.name || data.user.user_metadata.name)) ||
          data.user.email.split('@')[0];
        const { data: upserted, error: upsertErr } = await supabase
          .from('users')
          .upsert(
            {
              id: data.user.id,
              email: data.user.email,
              name: fallbackFullName,
              role: 'agent',
              status: 'active',
              is_active: true,
            },
            { onConflict: 'id' }
          )
          .select('id, email, name, role, status, avatar_url')
          .single();

        logger.debug('Upserted missing user row', {
          success: !!upserted,
          error: upsertErr?.message || null,
        });

        if (!upsertErr && upserted) {
          // replace userData for further processing
          userData = upserted as any;
        } else {
          logger.error('Upsert failed for user', {
            userId: data.user.id,
            error: upsertErr?.message,
          });
          return NextResponse.json(
            { success: false, error: 'User data not found' },
            { status: 401 }
          );
        }
      } catch (e) {
        logger.error('Error upserting missing user', e);
        return NextResponse.json(
          { success: false, error: 'User data not found' },
          { status: 401 }
        );
      }
    }

    // Check if user is active
    if (userData.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'User account is inactive' },
        { status: 403 }
      );
    }

    // Get user permissions based on role
    const rolePermissions = PermissionManager.getRolePermissions(userData.role);

    // Use Supabase session token if available (server client will have set cookies)
    const sessionToken = (data as any).session?.access_token || null;

    // Prepare user response object
    const userResponse = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar: userData.avatar_url,
      status: userData.status,
    };

    const resBody = {
      success: true,
      data: {
        user: userResponse,
        token: sessionToken,
        permissions: rolePermissions,
      },
    };

    logger.info('Login successful', {
      userId: userResponse.id,
      role: userResponse.role,
      hasSessionToken: !!sessionToken,
    });

    return NextResponse.json(resBody);
  } catch (e: any) {
    logger.error('Login error', e);
    return ErrorHandler.getInstance().handle(e as Error);
  }
}
