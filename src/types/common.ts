
// Common types
  id: string;
  created_at: string;
  updated_at: string;
}

  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


// Exports
export interface BaseEntity {
export interface ApiResponse<T = any> {
export interface PaginationParams {
export interface PaginatedResponse<T> extends ApiResponse<T[]> {