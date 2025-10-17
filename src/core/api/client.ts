/**
 * API Client - عميل API الموحد
 * Centralized API client with error handling and interceptors
 */

import { API_ENDPOINTS, ERROR_CODES } from '../constants';
import { ErrorHandler, ExternalServiceError } from '../errors';
import { storageUtils } from '../utils/index';
import { ApiResponse } from '../types';

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}


class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private errorHandler: ErrorHandler;

  constructor(baseURL: string = '/api', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.errorHandler = ErrorHandler.getInstance();
  }

  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.defaultTimeout,
      retries = 3,
    } = config;

    const url = this.buildURL(endpoint, params);
    const requestHeaders = this.buildHeaders(headers);

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ExternalServiceError(
          `HTTP ${response.status}: ${response.statusText}`,
          'API',
          { status: response.status, url }
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(1000);
        return this.request(endpoint, { ...config, retries: retries - 1 });
      }

      const handledError = this.errorHandler.handle(error as Error);
      return {
        success: false,
        error: handledError.message,
      };
    }
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    
    return url.toString();
  }

  private buildHeaders(customHeaders: Record<string, string>): Record<string, string> {
    const token = storageUtils.get('auth_token');
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
  }

  private shouldRetry(error: any): boolean {
    if (error.name === 'AbortError') return false;
    if (error.status >= 500) return true;
    if (error.status === 429) return true;
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication Methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.AUTH.ME);
  }

  // User Methods
  async getUsers(params?: { page?: number; limit?: number; role?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.USERS.LIST, params);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.USERS.CREATE, userData);
  }

  async getUser(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.USERS.GET(id));
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    return this.patch(API_ENDPOINTS.USERS.UPDATE(id), userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.USERS.DELETE(id));
  }

  // Patient Methods
  async getPatients(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.PATIENTS.LIST, params);
  }

  async createPatient(patientData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.PATIENTS.CREATE, patientData);
  }

  async getPatient(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.PATIENTS.GET(id));
  }

  async updatePatient(id: string, patientData: any): Promise<ApiResponse<any>> {
    return this.patch(API_ENDPOINTS.PATIENTS.UPDATE(id), patientData);
  }

  async activatePatient(id: string, activationData?: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.PATIENTS.ACTIVATE(id), activationData);
  }

  // Doctor Methods
  async getDoctors(params?: { page?: number; limit?: number; speciality?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.DOCTORS.LIST, params);
  }

  async createDoctor(doctorData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.DOCTORS.CREATE, doctorData);
  }

  async getDoctor(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.DOCTORS.GET(id));
  }

  async updateDoctor(id: string, doctorData: any): Promise<ApiResponse<any>> {
    return this.patch(API_ENDPOINTS.DOCTORS.UPDATE(id), doctorData);
  }

  async getDoctorAvailability(params: { doctorId?: string; date: string; speciality?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.DOCTORS.AVAILABILITY, params);
  }

  // Appointment Methods
  async getAppointments(params?: { page?: number; limit?: number; patientId?: string; doctorId?: string; status?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.APPOINTMENTS.LIST, params);
  }

  async createAppointment(appointmentData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
  }

  async getAppointment(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.APPOINTMENTS.GET(id));
  }

  async updateAppointment(id: string, appointmentData: any): Promise<ApiResponse<any>> {
    return this.patch(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), appointmentData);
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
  }

  // Payment Methods
  async getPayments(params?: { page?: number; limit?: number; appointmentId?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.PAYMENTS.LIST, params);
  }

  async createPayment(paymentData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
  }

  async processPayment(paymentData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.PAYMENTS.PROCESS, paymentData);
  }

  // Insurance Methods
  async getInsuranceClaims(params?: { page?: number; limit?: number; patientId?: string; status?: string }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.INSURANCE.CLAIMS, params);
  }

  async createInsuranceClaim(claimData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.INSURANCE.CLAIMS, claimData);
  }

  async submitInsuranceClaim(id: string, submitData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.INSURANCE.SUBMIT(id), submitData);
  }

  // Notification Methods
  async getNotifications(params?: { page?: number; limit?: number; type?: string; isRead?: boolean }): Promise<ApiResponse<any[]>> {
    return this.get(API_ENDPOINTS.NOTIFICATIONS.LIST, params);
  }

  async sendNotification(notificationData: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.NOTIFICATIONS.SEND, notificationData);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  }

  // Report Methods
  async getDashboardMetrics(params?: { period?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.REPORTS.DASHBOARD_METRICS, params);
  }

  // File Upload Methods
  async uploadFile(file: File, type: string, metadata?: any): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return this.request(API_ENDPOINTS.UPLOAD.FILE, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types