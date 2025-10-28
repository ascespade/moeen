import { BaseEntity } from './common';
// Import canonical UserRole type from the single source of truth
import type { UserRole } from '@/constants/roles';

// Authentication types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  last_login?: string;
  login_count: number;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
