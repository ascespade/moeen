
export class APIError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any,
  ) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.code = code || "INTERNAL_ERROR";
    this.details = details;

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");

export class AuthorizationError extends APIError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");

export class NotFoundError extends APIError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");

export class ConflictError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 409, "CONFLICT_ERROR", details);

export class RateLimitError extends APIError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_ERROR");

export class ExternalServiceError extends APIError {
  constructor(service: string, message: string) {
    super(
      `External service error (${service}): ${message}`,
      502,
      "EXTERNAL_SERVICE_ERROR",
    );

export class DatabaseError extends APIError {
  constructor(message: string, details?: any) {
    super(`Database error: ${message}`, 500, "DATABASE_ERROR", details);

export class PaymentError extends APIError {
  constructor(message: string, details?: any) {
    super(`Payment error: ${message}`, 400, "PAYMENT_ERROR", details);

export class InsuranceError extends APIError {
  constructor(message: string, details?: any) {
    super(`Insurance error: ${message}`, 400, "INSURANCE_ERROR", details);

// Error response formatter
export function formatErrorResponse(error: unknown): {
  success: false;
  error: string;
  code?: string;
  details?: any;
  statusCode: number;
} {
  if (error instanceof APIError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      statusCode: error.statusCode,
    };

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    };

  return {
    success: false,
    error: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };

// Error logging
export function logError(error: unknown, context?: any) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
        : error,
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {

  // TODO: Send to external logging service in production
  // await sendToLoggingService(errorInfo);

// Error handler middleware
export function handleAPIError(error: unknown, context?: any) {
  logError(error, context);
  return formatErrorResponse(error);
}}}}}}}}}}}}}}}}}}
