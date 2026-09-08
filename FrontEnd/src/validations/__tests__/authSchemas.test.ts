import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../authSchemas';

describe('loginSchema', () => {
  it('should pass with valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should fail with empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email is required');
    }
  });

  it('should fail with invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });

  it('should fail with empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password is required');
    }
  });

  it('should fail with password less than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
    }
  });
});

describe('registerSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
  };

  it('should pass with valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail with empty name', () => {
    const result = registerSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Full name is required');
    }
  });

  it('should fail with name less than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
    }
  });

  it('should fail with name exceeding 50 characters', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A'.repeat(51) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name cannot exceed 50 characters');
    }
  });

  it('should fail with invalid email', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });

  it('should fail with password less than 8 characters', () => {
    const result = registerSchema.safeParse({ 
      ...validData, 
      password: 'Pass1', 
      confirmPassword: 'Pass1' 
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
    }
  });

  it('should fail with password without uppercase letter', () => {
    const result = registerSchema.safeParse({ 
      ...validData, 
      password: 'password123', 
      confirmPassword: 'password123' 
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Include at least one uppercase letter');
    }
  });

  it('should fail with password without number', () => {
    const result = registerSchema.safeParse({ 
      ...validData, 
      password: 'PasswordABC', 
      confirmPassword: 'PasswordABC' 
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Include at least one number');
    }
  });

  it('should fail when passwords do not match', () => {
    const result = registerSchema.safeParse({ 
      ...validData, 
      confirmPassword: 'DifferentPassword123' 
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(i => i.path.includes('confirmPassword'));
      expect(confirmError?.message).toBe('Passwords do not match');
    }
  });

  it('should fail with empty confirmPassword', () => {
    const result = registerSchema.safeParse({ 
      ...validData, 
      confirmPassword: '' 
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(i => i.path.includes('confirmPassword'));
      expect(confirmError?.message).toBe('Please confirm your password');
    }
  });
});
