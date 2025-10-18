import { ApiResponse, PaginationParams, PaginatedResponse } from "./index";

// API-specific type definitions

// Auth API Types
  email: string;
  password: string;
  rememberMe?: boolean;
}

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

  name: string;
  email: string;
  password: string;
}

  refreshToken: string;
}

// Channels API Types
  name: string;
  description?: string;
  type: "public" | "private" | "direct";
  members?: string[];
}

  name?: string;
  description?: string;
  members?: string[];
}

  type?: "public" | "private" | "direct";
  search?: string;
}

  data: any[]; // Will be replaced with proper Channel type
}

// Messages API Types
  content: string;
  channelId: string;
  replyTo?: string;
}

  channelId: string;
  before?: string;
  after?: string;
}

  data: any[]; // Will be replaced with proper Message type
}

// Users API Types
  role?: string;
  search?: string;
  status?: "active" | "inactive" | "banned";
}

  data: any[]; // Will be replaced with proper User type
}

  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

// Settings API Types
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
  name: string;
  url: string;
  events: string[];
  secret?: string;
}

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
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

  data: {
    response: string;
    tokensUsed: number;
    model: string;
  };
}

// Logs API Types
  level?: "error" | "warn" | "info" | "debug";
  service?: string;
  startDate?: string;
  endDate?: string;
}

  id: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  service: string;
  timestamp: string;
  metadata?: any;
}

  data: LogEntry[];
}


// Exports
export interface LoginRequest {
export interface LoginResponse extends ApiResponse {
export interface RegisterRequest {
export interface RefreshTokenRequest {
export interface CreateChannelRequest {
export interface UpdateChannelRequest {
export interface ChannelListParams extends PaginationParams {
export interface ChannelListResponse extends PaginatedResponse<any> {
export interface SendMessageRequest {
export interface MessageListParams extends PaginationParams {
export interface MessageListResponse extends PaginatedResponse<any> {
export interface UserListParams extends PaginationParams {
export interface UserListResponse extends PaginatedResponse<any> {
export interface UpdateUserRequest {
export interface UpdateSettingsRequest {
export interface CreateWebhookRequest {
export interface WebhookResponse extends ApiResponse {
export interface AIRequest {
export interface AIResponse extends ApiResponse {
export interface LogListParams extends PaginationParams {
export interface LogEntry {
export interface LogListResponse extends PaginatedResponse<LogEntry> {