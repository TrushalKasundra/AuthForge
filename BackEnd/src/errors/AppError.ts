// Base application error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: FieldError[];

  constructor(
    message: string,
    statusCode: number,
    errors?: FieldError[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Field-level error for validation
export interface FieldError {
  field: string;
  message: string;
}

// 400 - Validation Error
export class ValidationError extends AppError {
  constructor(message: string, errors?: FieldError[]) {
    super(message, 400, errors);
  }
}

// 401 - Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 401);
  }
}

// 403 - Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

// 404 - Not Found Error
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 - Conflict Error (e.g., duplicate resource)
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}
