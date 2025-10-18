import { BaseEntity } from "./common";

// Authentication types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  last_login?: string;
  login_count: number;

export type UserRole =
  | "admin"
  | "doctor"
  | "nurse"
  | "staff"
  | "supervisor"
  | "patient"
  | "agent"
  | "manager"
  | "demo";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
