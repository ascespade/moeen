
// Global type definitions
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

  id: string;
  name: string;
  description?: string;
  type: "public" | "private" | "direct";
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

  id: string;
  content: string;
  channelId: string;
  userId: string;
  timestamp: Date;
  edited?: boolean;
  deleted?: boolean;
}

  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
  className?: string;
  children?: React.ReactNode;
}

  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Dashboard Types
  totalUsers: number;
  totalChannels: number;
  totalMessages: number;
  activeUsers: number;
}

  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// Settings Types
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
}

// Error Types
  code: string;
  message: string;
  details?: any;
}

// Form Types
  email: string;
  password: string;
  rememberMe?: boolean;
}

  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Webhook Types
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  processed: boolean;
}


// Exports
export interface User {
export interface Channel {
export interface Message {
export interface Conversation {
export interface ApiResponse<T = any> {
export interface PaginationParams {
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
export interface BaseComponentProps {
export interface ButtonProps extends BaseComponentProps {
export interface InputProps extends BaseComponentProps {
export interface DashboardStats {
export interface ChartData {
export interface AppSettings {
export interface AppError {
export interface LoginForm {
export interface RegisterForm {
export interface WebhookEvent {