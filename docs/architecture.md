# Architecture Overview

## System Architecture

MeetingAI follows a three-tier architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│         React 18 + React Router + Tailwind          │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS / REST
                      ▼
┌─────────────────────────────────────────────────────┐
│                  Nginx Reverse Proxy                 │
│          Static files + API proxy + Gzip            │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP (internal)
                      ▼
┌─────────────────────────────────────────────────────┐
│                Express.js Backend                    │
│                                                     │
│  ┌─────────┐  ┌────────────┐  ┌──────────────┐    │
│  │ Routes  │→ │Controllers │→ │  Services    │    │
│  └─────────┘  └────────────┘  └──────┬───────┘    │
│       ↑                              │             │
│  ┌─────────┐                    ┌────┴────┐       │
│  │Middleware│                    │ Models  │       │
│  │(Auth,   │                    │(Mongoose)│       │
│  │ Rate,   │                    └────┬────┘       │
│  │Validate)│                         │             │
│  └─────────┘                         ▼             │
│                              ┌──────────────┐      │
│                              │   MongoDB    │      │
│                              └──────────────┘      │
│                                     ↑              │
│  ┌──────────────┐                   │              │
│  │  AI Service  │───── OpenAI API   │              │
│  └──────────────┘                   │              │
└─────────────────────────────────────────────────────┘
```

## Backend Architecture

### Request Pipeline

Every request flows through a consistent pipeline:

```
Incoming Request
    │
    ▼
Helmet (Security headers)
    │
    ▼
CORS (Origin validation)
    │
    ▼
Body Parser (JSON, 5MB limit)
    │
    ▼
Morgan (HTTP logging)
    │
    ▼
Rate Limiter (general/AI/auth)
    │
    ▼
Router Match
    │
    ▼
Auth Middleware (JWT verification)
    │
    ▼
Validation Middleware (Joi schema)
    │
    ▼
Controller (orchestration)
    │
    ▼
Service (business logic)
    │
    ▼
Model (database operations)
    │
    ▼
Response / Error Handler
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Routes** | HTTP method binding, middleware chaining, path definitions |
| **Middleware** | Cross-cutting concerns: auth, validation, rate limiting, error handling |
| **Controllers** | Request parsing, response formatting, error delegation |
| **Services** | Core business logic, data orchestration, external API calls |
| **Models** | Data schemas, validation, indexes, instance/static methods |
| **Utils** | Shared utilities: logging, error classes, schema validation |

### Service Layer Design

Services are implemented as singleton classes:

- **AuthService** — Registration, login, token management, refresh rotation
- **AIService** — OpenAI integration, prompt engineering, fallback analysis
- **MeetingService** — CRUD, search, pagination, sharing, archival
- **ExportService** — PDF generation (PDFKit), JSON export

### Error Handling Strategy

All errors flow through a centralized error handler:

1. Controllers catch errors and pass to `next(error)`
2. `errorHandler` middleware classifies the error:
   - `ApiError` → Known operational error, use its status/message
   - `ValidationError` (Mongoose) → 400 with field details
   - `CastError` → 400 "Invalid ID"
   - `11000` (duplicate key) → 409 "Already exists"
   - JWT errors → 401 "Invalid/expired token"
   - Unknown → 500 "Internal server error"
3. 4xx errors logged as warnings, 5xx as errors
4. Stack traces included only in development mode

### AI Analysis Pipeline

```
Raw Meeting Content
       │
       ▼
Build System Prompt (meeting-type-specific)
       │
       ▼
OpenAI Chat Completion (json_object mode, temp=0.1)
       │
       ├── Success → Validate with Joi schema
       │                  │
       │                  ├── Valid → Sanitize & return
       │                  │
       │                  └── Invalid → Sanitize with defaults
       │
       └── Failure → Fallback Regex Analyzer
                          │
                          ▼
                     Pattern-based extraction
                     (action items, owners, deadlines)
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Toaster (notifications)
├── GuestRoute
│   ├── Login
│   └── Register
├── SharedView (public, no auth)
└── ProtectedRoute
    └── Layout
        ├── Navbar
        ├── Dashboard
        │   ├── MeetingCard[]
        │   └── Pagination
        ├── MeetingCreate
        ├── MeetingDetail
        │   ├── AnalysisView
        │   ├── AnalysisEditor
        │   └── ExportMenu
        └── ActionItems
            ├── ActionItemFilters
            ├── ActionItemRow[]
            └── Pagination
```

### State Management

- **AuthContext** — Global auth state, user data, token storage
- **Component State** — Local state with `useState` for page data, forms, UI state
- **API Client** — Centralized Axios instance with automatic token injection and refresh

### Token Management

```
Login → Access Token (15m) + Refresh Token (7d)
                │
                ▼
        Stored in localStorage
                │
Request ───→ Axios Interceptor ───→ Inject Bearer token
                │
Response ←── 401 Error?
                │
                ├── Yes → Queue request, call /refresh
                │              │
                │              ├── New tokens → Retry queued requests
                │              │
                │              └── Refresh fails → Redirect to /login
                │
                └── No → Return response
```

## Database Design

Three primary collections with references:

- **Users** → Auth credentials, tokens, profile
- **Meetings** → Notes content, metadata, sharing
- **Analyses** → AI output, versions, edit history, action items (embedded)

See [database-schema.md](database-schema.md) for complete schema documentation.

## Security Measures

1. **Helmet** — Security headers (CSP, HSTS, X-Frame-Options)
2. **CORS** — Configurable origin whitelist
3. **Rate Limiting** — Three tiers (general, AI, auth)
4. **JWT** — Short-lived access tokens with secure refresh rotation
5. **Input Validation** — Joi schemas on all endpoints
6. **Password Hashing** — bcrypt with salt factor 12
7. **Query Injection Prevention** — Mongoose parameterized queries
8. **Error Sanitization** — No stack traces in production responses

## Deployment Architecture (Docker)

```
docker-compose.yml
    │
    ├── mongo (MongoDB 7)
    │   ├── Volume: mongo_data (persistent)
    │   ├── Health check: ping
    │   └── Init script: mongo-init.js
    │
    ├── backend (Node.js 18 Alpine)
    │   ├── Depends on: mongo (healthy)
    │   ├── Health check: /api/health
    │   └── Environment: from .env
    │
    └── frontend (Nginx Alpine)
        ├── Multi-stage build (React → Nginx)
        ├── Depends on: backend
        ├── Proxy: /api/ → backend:5000
        └── SPA routing: /* → index.html
```

All services communicate over an internal Docker bridge network (`meetingai-network`).
