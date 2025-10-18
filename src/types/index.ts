
// Global type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: "public" | "private" | "direct";
  members: string[];
  createdAt: Date;
  updatedAt: Date;

export interface Message {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  timestamp: Date;
  edited?: boolean;
  deleted?: boolean;

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;

export interface InputProps extends BaseComponentProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalChannels: number;
  totalMessages: number;
  activeUsers: number;

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];

// Settings Types
export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
  };

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  processed: boolean;
}}}}}}}}}}}}}}}}}
