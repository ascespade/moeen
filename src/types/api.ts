import { ApiResponse, PaginationParams, PaginatedResponse } from "./index";

// API-specific type definitions

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Channels API Types
export interface CreateChannelRequest {
  name: string;
  description?: string;
  type: "public" | "private" | "direct";
  members?: string[];
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
  members?: string[];
}

export interface ChannelListParams extends PaginationParams {
  type?: "public" | "private" | "direct";
  search?: string;
}

export interface ChannelListResponse extends PaginatedResponse<any> {
  data: any[]; // Will be replaced with proper Channel type
}

// Messages API Types
export interface SendMessageRequest {
  content: string;
  channelId: string;
  replyTo?: string;
}

export interface MessageListParams extends PaginationParams {
  channelId: string;
  before?: string;
  after?: string;
}

export interface MessageListResponse extends PaginatedResponse<any> {
  data: any[]; // Will be replaced with proper Message type
}

// Users API Types
export interface UserListParams extends PaginationParams {
  role?: string;
  search?: string;
  status?: "active" | "inactive" | "banned";
}

export interface UserListResponse extends PaginatedResponse<any> {
  data: any[]; // Will be replaced with proper User type
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

// Settings API Types
export interface UpdateSettingsRequest {
  theme?: "light" | "dark" | "system";
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sound?: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    allowDirectMessages?: boolean;
  };
}

// Webhooks API Types
export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookResponse extends ApiResponse {
  data: {
    id: string;
    name: string;
    url: string;
    events: string[];
    secret?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// AI API Types
export interface AIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse extends ApiResponse {
  data: {
    response: string;
    tokensUsed: number;
    model: string;
  };
}

// Logs API Types
export interface LogListParams extends PaginationParams {
  level?: "error" | "warn" | "info" | "debug";
  service?: string;
  startDate?: string;
  endDate?: string;
}

export interface LogEntry {
  id: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  service: string;
  timestamp: string;
  metadata?: any;
}

export interface LogListResponse extends PaginatedResponse<LogEntry> {
  data: LogEntry[];
}
