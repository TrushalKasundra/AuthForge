import { ValidationError, type FieldError } from '@/errors/index.js';
import type { NextFunction, Request, Response } from 'express';
import type { z, ZodError } from 'zod';

// Options for what parts of request to validate
interface ValidateOptions {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

// Transform Zod error to field errors
const formatZodErrors = (error: ZodError): FieldError[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};

// Validation middleware factory
export const validate = (schemaOrOptions: z.ZodType | ValidateOptions) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // If a single schema is passed, validate body
      if ('parse' in schemaOrOptions || 'parseAsync' in schemaOrOptions) {
        const schema = schemaOrOptions as z.ZodType;
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
          throw new ValidationError(
            'Validation failed',
            formatZodErrors(result.error)
          );
        }

        // Replace body with parsed/transformed data
        req.body = result.data;
      } else {
        // Multiple schemas for different parts of request
        const options = schemaOrOptions as ValidateOptions;
        const errors: FieldError[] = [];

        if (options.body) {
          const result = await options.body.safeParseAsync(req.body);
          if (!result.success) {
            errors.push(...formatZodErrors(result.error));
          } else {
            req.body = result.data;
          }
        }

        if (options.query) {
          const result = await options.query.safeParseAsync(req.query);
          if (!result.success) {
            errors.push(
              ...formatZodErrors(result.error).map((e) => ({
                ...e,
                field: `query.${e.field}`,
              }))
            );
          }
          // Note: We don't replace req.query to avoid type issues
        }

        if (options.params) {
          const result = await options.params.safeParseAsync(req.params);
          if (!result.success) {
            errors.push(
              ...formatZodErrors(result.error).map((e) => ({
                ...e,
                field: `params.${e.field}`,
              }))
            );
          }
          // Note: We don't replace req.params to avoid type issues
        }

        if (errors.length > 0) {
          throw new ValidationError('Validation failed', errors);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
