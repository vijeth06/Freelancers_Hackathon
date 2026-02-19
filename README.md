# MeetingAI — AI Meeting Notes & Action Item Intelligence Platform

A production-ready full-stack application for recording, analyzing, and managing meeting notes using AI-powered intelligence. Built with React, Node.js/Express, MongoDB, and OpenAI.

---

## Features

- **AI-Powered Analysis** — Automatically extract summaries, key points, and action items from raw meeting notes using OpenAI GPT (with regex fallback when no API key is configured)
- **Action Item Tracking** — Centralized dashboard to manage all action items across meetings with filtering, priority, status, and ownership
- **Version History** — Every AI analysis is versioned; edit analyses with tracked change history
- **Sharing** — Generate secure share links for read-only meeting views (no login required)
- **Export** — Export meetings and analyses as PDF or JSON
- **Authentication** — JWT-based auth with access + refresh token rotation
- **Role-Based Access** — User and admin roles with authorization middleware
- **Rate Limiting** — Configurable rate limiting for general, AI, and auth endpoints
---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Mongoose ODM |
| Database | MongoDB Atlas |
| AI | OpenAI GPT-4 (configurable model) |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Testing | Jest, Supertest, mongodb-memory-server |
| Logging | Winston (file + console transports) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key (optional — fallback analysis works without it)

### Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `MONGODB_URI` | No | MongoDB Atlas URI | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | **Yes** | — | Refresh token signing secret (min 32 chars) |
| `JWT_EXPIRE` | No | `15m` | Access token expiry |
| `JWT_REFRESH_EXPIRE` | No | `7d` | Refresh token expiry |
| `OPENAI_API_KEY` | No | — | OpenAI API key for AI analysis |
| `OPENAI_MODEL` | No | `gpt-4` | OpenAI model to use |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |
| `LOG_LEVEL` | No | `info` | Winston log level |

---

## Project Structure

```
AI meeting/
├── .env.example                # Environment template
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js           # Express app & startup
│   │   ├── config/             # env, database, cors
│   │   ├── models/             # Mongoose schemas (User, Meeting, Analysis)
│   │   ├── routes/             # Express route definitions
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic (auth, AI, meeting, export)
│   │   ├── middleware/         # auth, rateLimiter, validate, errorHandler
│   │   ├── validators/        # Joi validation schemas
│   │   └── utils/             # logger, apiError, schemaValidator
│   └── tests/
│       ├── setup.js            # Jest config with MongoMemoryServer
│       ├── unit/               # Unit tests
│       └── integration/        # API integration tests
├── frontend/
│   ├── package.json
│   └── src/
│       ├── App.jsx             # React Router setup
│       ├── index.js            # Entry point
│       ├── api/client.js       # Axios instance with interceptors
│       ├── context/            # AuthContext with token management
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route pages
│       └── utils/              # Constants and helpers
└── docs/
    ├── architecture.md
    ├── api-reference.md
    ├── database-schema.md
    └── setup-guide.md
```

---

## Testing

```bash
cd backend

# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

Tests use `mongodb-memory-server` for an isolated in-memory database — no external MongoDB required.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/profile` | Get current user |
| `GET` | `/api/meetings` | List meetings (paginated, filterable) |
| `POST` | `/api/meetings` | Create meeting |
| `GET` | `/api/meetings/:id` | Get meeting |
| `PUT` | `/api/meetings/:id` | Update meeting |
| `DELETE` | `/api/meetings/:id` | Delete meeting |
| `POST` | `/api/meetings/:id/share` | Toggle sharing |
| `POST` | `/api/meetings/:id/archive` | Toggle archive |
| `POST` | `/api/analyses/meetings/:meetingId/generate` | Generate AI analysis |
| `GET` | `/api/analyses/meetings/:meetingId/latest` | Get latest analysis |
| `GET` | `/api/analyses/meetings/:meetingId/versions` | List all versions |
| `PUT` | `/api/analyses/:id` | Update analysis |
| `POST` | `/api/analyses/:id/confirm` | Confirm analysis |
| `GET` | `/api/action-items` | List all action items |
| `GET` | `/api/action-items/stats` | Action item statistics |
| `PUT` | `/api/action-items/:analysisId/:actionItemId` | Update action item |
| `GET` | `/api/export/meetings/:id/json` | Export as JSON |
| `GET` | `/api/export/meetings/:id/pdf` | Export as PDF |
| `GET` | `/api/shared/:shareToken` | Get shared meeting (public) |

See [docs/api-reference.md](docs/api-reference.md) for complete API documentation.

---

## License

MIT
