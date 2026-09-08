// Re-export schemas and types from shared package
// This ensures frontend uses the same validation rules as backend
export {
  loginSchema,
  registerSchema,
  type LoginInput as LoginFormValues,
  type RegisterInput as RegisterFormValues,
} from '@authforge/shared';
