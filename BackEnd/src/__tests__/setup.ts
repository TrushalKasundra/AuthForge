import { vi } from 'vitest';

// Mock environment variables
vi.stubEnv('JWT_SECRET', 'test-secret-key-for-testing');
vi.stubEnv('DATABASE_URL', 'postgres://localhost:5432/authforge_test');
vi.stubEnv('PORT', '5001');
vi.stubEnv('CLIENT_URL', 'http://localhost:5173');
vi.stubEnv('NODE_ENV', 'test');

// Silence console during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});
