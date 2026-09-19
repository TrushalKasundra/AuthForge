# AuthForge

A full-stack authentication system built with the PERN stack (PostgreSQL, Express, React, Node.js) demonstrating modern security practices and clean architecture.

## Tech Stack

**Backend**
- Node.js + Express 5
- TypeScript
- PostgreSQL + Sequelize ORM
- JWT Authentication (Access + Refresh Tokens)
- Zod Validation

**Frontend**
- React 19 + TypeScript
- Vite
- Redux Toolkit + RTK Query
- React Router 7
- Tailwind CSS 4

## Features

> **Note:** Some UI elements such as **Social Login** (Google, GitHub), **Forgot Password**, and **Remember Me** are included as visual placeholders to showcase a realistic authentication interface. They are not functional in this implementation. Only **Register**, **Login**, and **Logout** are fully implemented end-to-end.

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Automatic token refresh (silent re-authentication)
- Protected routes with auth guards
- Persistent sessions across browser refreshes
- Multi-tab logout synchronization

### Security Implementation

| Feature | Description |
|---------|-------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Access Tokens** | Short-lived JWT (15 minutes) |
| **Refresh Tokens** | Long-lived JWT (7 days), stored in database |
| **Token Refresh** | Automatic silent refresh on 401 errors |
| **Token Revocation** | Refresh tokens deleted on logout |
| **Rate Limiting** | 100 requests per 30 minutes |
| **Security Headers** | Helmet.js middleware |
| **CORS** | Restricted to allowed origins |
| **Input Validation** | Zod schemas on both client and server |
| **Password Rules** | Min 8 chars, uppercase, number required |
| **SQL Injection** | Prevented via Sequelize ORM |
| **XSS Protection** | React's built-in escaping |

### Authentication Flow

```
┌─────────────┐     POST /login      ┌─────────────┐
│   Client    │ ──────────────────▶  │   Server    │
│             │                      │             │
│             │  ◀──────────────────  │             │
│             │  accessToken (15m)   │             │
│             │  refreshToken (7d)   │             │
└─────────────┘                      └─────────────┘

        │
        │ Store tokens
        ▼

┌─────────────┐   GET /profile       ┌─────────────┐
│   Client    │ ──────────────────▶  │   Server    │
│             │  Authorization:      │             │
│             │  Bearer <access>     │             │
└─────────────┘                      └─────────────┘

        │
        │ Access token expires (401)
        ▼

┌─────────────┐  POST /refresh-token ┌─────────────┐
│   Client    │ ──────────────────▶  │   Server    │
│             │  { refreshToken }    │             │
│             │                      │             │
│             │  ◀──────────────────  │             │
│             │  new accessToken     │             │
└─────────────┘                      └─────────────┘
```

## Project Structure

```
AuthForge/
├── BackEnd/
│   └── src/
│       ├── config/          # Database configuration
│       ├── constants/       # Environment variables
│       ├── controllers/     # Request handlers
│       ├── errors/          # Custom error classes
│       ├── middleware/      # Auth, validation, error handling
│       ├── models/          # Sequelize models (User, RefreshToken)
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       ├── utils/           # JWT utilities
│       └── index.ts         # Express server entry
│
├── FrontEnd/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── constants/       # App configuration
│       ├── hooks/           # Custom React hooks (useAuth)
│       ├── router/          # Route definitions
│       ├── store/           # Redux store, slices, RTK Query
│       ├── types/           # TypeScript interfaces
│       ├── utils/           # Storage utilities
│       └── view/            # Pages and layouts
│
└── packages/
    └── shared/              # Shared Zod schemas
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Create new account |
| POST | `/api/login` | No | Login, returns tokens |
| POST | `/api/refresh-token` | No | Get new access token |
| GET | `/api/profile` | Yes | Get user profile |
| POST | `/api/logout` | Yes | Revoke refresh token |
| GET | `/api/health` | No | Health check |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/authforge.git
cd authforge

# Install dependencies
npm install

# Set up environment variables
cp BackEnd/.env.example BackEnd/.env
# Edit BackEnd/.env with your database credentials
```

### Environment Variables

```env
# BackEnd/.env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/authforge
JWT_SECRET=your-secure-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CLIENT_URL=http://localhost:5173
```

### Running the App

```bash
# Development (runs both frontend and backend)
npm run dev

# Or run separately
npm run dev -w BackEnd    # Backend on port 5000
npm run dev -w FrontEnd   # Frontend on port 5173
```

### Building for Production

```bash
# Build all
npm run build

# Build individually
npm run build -w BackEnd
npm run build -w FrontEnd
```

## Testing

```bash
# Run all tests
npm test

# Run backend tests
npm test -w BackEnd

# Run frontend tests
npm test -w FrontEnd
```

## Security Best Practices Implemented

1. **Defense in Depth** - Multiple layers of security (validation, authentication, authorization)
2. **Principle of Least Privilege** - Tokens have minimal required permissions
3. **Secure by Default** - Passwords excluded from queries, CORS restricted
4. **Fail Securely** - Generic error messages prevent information leakage
5. **Input Validation** - All inputs validated on both client and server
6. **Token Rotation** - Short-lived access tokens with refresh mechanism

## License

MIT
