import { BaseEntity } from './common';
// Authentication types
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  last_login?: string;
  login_count: number;
}
  email: string;
  password: string;
  rememberMe?: boolean;
}
  user: User;
  token: string;
  refreshToken: string;
}
// Exports
export interface User extends BaseEntity {
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff' | 'supervisor' | 'patient' | 'agent' | 'manager' | 'demo';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export interface LoginRequest {
export interface LoginResponse {