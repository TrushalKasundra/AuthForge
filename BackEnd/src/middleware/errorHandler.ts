import { IS_DEVELOPMENT } from '@/constants/env.js';
import { AppError, type FieldError } from '@/errors/index.js';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';
import { ZodError } from 'zod';

// Error response structure
interface ErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
  stack?: string;
}

// Transform Zod errors to field errors
const formatZodError = (error: ZodError): FieldError[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};

// Transform Sequelize validation errors to field errors
const formatSequelizeValidationError = (
  error: SequelizeValidationError
): FieldError[] => {
  return error.errors.map((err) => ({
    field: err.path || 'unknown',
    message: err.message,
  }));
};

// Centralized error handler middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Default error response
  const response: ErrorResponse = {
    success: false,
    message: 'Internal server error',
  };

  let statusCode = 500;

  // Handle known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.message = err.message;
    if (err.errors) {
      response.errors = err.errors;
    }
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    response.message = 'Validation failed';
    response.errors = formatZodError(err);
  }
  // Handle Sequelize unique constraint errors
  else if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    response.message = 'Resource already exists';
    response.errors = err.errors.map((e) => ({
      field: e.path || 'unknown',
      message: e.message,
    }));
  }
  // Handle Sequelize validation errors
  else if (err instanceof SequelizeValidationError) {
    statusCode = 400;
    response.message = 'Validation failed';
    response.errors = formatSequelizeValidationError(err);
  }
  // Unknown errors
  else {
    console.error('Unhandled error:', err);
  }

  // Include stack trace in development
  if (IS_DEVELOPMENT && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Async handler wrapper to catch promise rejections
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
