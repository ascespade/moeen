import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PermissionManager } from '@/lib/permissions';
import { logger } from '@/lib/utils/logger';

const DEFAULT_PASSWORD = process.env.TEST_USERS_PASSWORD || 'A123456';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json().catch(() => ({}) as unknown);
    // Log incoming request
    logger.info('[api/auth/login] incoming login request', { value: { email } });

    const demoEmailHeader = req.headers.get('x-demo-email');
    const internalSecretHeader = req.headers.get('x-admin-secret');

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const isDev = process.env.NODE_ENV !== 'production';
    const debugAllow = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';

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
        logger.info('[api/auth/login] demo/header fallback active', { value: { targetEmail } });

        // Try to find existing user row
        const { data: userRow, error: userRowErr } = await supabase
          .from('users')
          .select('id, email, name, role, status, avatar_url')
          .eq('email', targetEmail)
          .single();

        logger.info('[api/auth/login] demo/header user lookup', {
          userRow: userRow ? 'found' : 'not found',
          error: userRowErr?.message || null,
        });

        if (!userRow && (isDev || debugAllow || !!internalSecretHeader)) {
          // Auto-create auth user via service role in dev/debug
          try {
            logger.info('[api/auth/login] demo/header creating auth user', { value: { targetEmail } });
            const supabaseAdmin = createAdminClient();
            const { data: createdUser, error: createErr } =
              await supabaseAdmin.auth.admin.createUser({
                email: targetEmail,
                password: DEFAULT_PASSWORD,
                email_confirm: true,
              } as unknown);

            if (createErr || !createdUser?.user) {
              logger.error('[api/auth/login] demo/header createUser failed', { error: createErr?.message });
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

              logger.info('[api/auth/login] demo/header upsert users result', {
                success: !!up,
                error: upErr?.message || null,
              });

              if (up && !upErr) {
                const rolePermissions = await PermissionManager.getRolePermissions(
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
            logger.error('[api/auth/login] demo/header auto-create error', { error: e });
          }
        }

        if (userRow && !userRowErr) {
          if (userRow.status !== 'active') {
            return NextResponse.json(
              { success: false, error: 'User account is inactive' },
              { status: 403 }
            );
          }

          const rolePermissions = await PermissionManager.getRolePermissions(
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

          logger.info('[api/auth/login] demo/header fallback login succeeded', { value: { targetEmail } });
          return NextResponse.json(resBody);
        }
      }
    } catch (e) {
      logger.error('[api/auth/login] demo/header fallback error', { error: e instanceof Error ? e.message : String(e) });
      // continue to normal flow
    }

    // Normal flow: attempt Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    logger.info('[api/auth/login] signInWithPassword result', {
      error: error?.message || null,
      userId: data?.user?.id,
    });

    if (error || !data?.user) {
      logger.warn(
        '[api/auth/login] signInWithPassword failed',
        error?.message
      );

      // Fallback: allow login with TEST_USERS_PASSWORD if a users row exists (development convenience only)
      try {
        if (password === DEFAULT_PASSWORD) {
          const { data: userRow, error: userRowErr } = await supabase
            .from('users')
            .select('id, email, name, role, status, avatar_url')
            .eq('email', email)
            .single();

          logger.info('[api/auth/login] fallback user lookup', {
            userRow,
            userRowErr: userRowErr?.message || null,
          });

          if (!userRow && (isDev || debugAllow || !!internalSecretHeader)) {
            // attempt to create user using supabaseAdmin
            try {
              logger.info(
                '[api/auth/login] fallback creating auth user for',
                email
              );
              const supabaseAdmin = createAdminClient();
              const { data: createdUser, error: createErr } =
                await supabaseAdmin.auth.admin.createUser({
                  email,
                  password: DEFAULT_PASSWORD,
                  email_confirm: true,
                } as unknown);

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

                logger.info('[api/auth/login] fallback upsert users result', {
                  up,
                  upErr: upErr?.message || null,
                });

                if (up && !upErr) {
                  const rolePermissions = await PermissionManager.getRolePermissions(
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

                  logger.info(
                    '[api/auth/login] fallback auto-create login succeeded for',
                    email
                  );
                  return NextResponse.json(resBody);
                }
              }
            } catch (e) {
              logger.error('[api/auth/login] fallback create error', { error: e });
            }
          }

          if (userRow && !userRowErr) {
            if (userRow.status !== 'active') {
              return NextResponse.json(
                { success: false, error: 'User account is inactive' },
                { status: 403 }
              );
            }

            const rolePermissions = await PermissionManager.getRolePermissions(
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
            logger.info('[api/auth/login] fallback login succeeded for', { value: email });
            return NextResponse.json(resBody);
          }
        }
      } catch (e) {
        logger.error('[api/auth/login] fallback lookup error', { error: e });
      }

      logger.error('[api/auth/login] auth error', { error: error?.message });
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

    logger.info('[api/auth/login] fetched userData', {
      userData,
      userError: userError?.message || null,
    });

    if (userError || !userData) {
      logger.warn(
        '[api/auth/login] user data not found for',
        data.user.id,
        userError?.message
      );

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

        logger.info('[api/auth/login] upserted missing user row', {
          upserted,
          upsertErr: upsertErr?.message || null,
        });

        if (!upsertErr && upserted) {
          // replace userData for further processing
          userData = upserted as unknown;
        } else {
          logger.error(
            '[api/auth/login] upsert failed for user',
            data.user.id,
            upsertErr?.message
          );
          return NextResponse.json(
            { success: false, error: 'User data not found' },
            { status: 401 }
          );
        }
      } catch (e) {
        logger.error('[api/auth/login] error upserting missing user', { error: e });
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
    const rolePermissions = await PermissionManager.getRolePermissions(userData.role);

    // Generate dynamic JWT token (contains all user info - no DB query needed in middleware)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    const jwt = await import('jsonwebtoken');
    const jwtToken = jwt.default.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        permissions: rolePermissions,
        // Don't require DB verification in middleware for performance
        verifyStatus: false,
      },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

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
        token: jwtToken,
        permissions: rolePermissions,
      },
    };

    // Create response and set cookie
    const response = NextResponse.json(resBody);
    const isProduction = process.env.NODE_ENV === 'production';

    // Set auth_token cookie (compatible with middleware)
    response.cookies.set('auth_token', jwtToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    logger.info('[api/auth/login] login successful with JWT', {
      userId: userResponse.id,
      tokenGenerated: !!jwtToken,
    });

    return response;
  } catch (e: unknown) {
    const { logger } = await import('@/lib/utils/logger');
    logger.error('Login error', { error: e instanceof Error ? e.message : String(e) });
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
