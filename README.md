# MeetingAI — AI Meeting Notes & Action Item Intelligence Platform

A production-ready full-stack application for recording, analyzing, and managing meeting notes using AI-powered intelligence. Built with React, Node.js/Express, MongoDB, Claude API, and OpenAI.

---

## Features

- **AI-Powered Analysis** — Automatically extract summaries, key points, and action items from meeting notes using Claude API or OpenAI GPT (with intelligent fallback)
- **Dual AI Support** — Primary support for Claude API with automatic fallback to OpenAI if Claude is unavailable
- **Action Item Tracking** — Centralized dashboard to manage all action items across meetings with filtering, priority, status, and ownership
- **Advanced Search** — Full-text search across meeting titles, content, summaries, and action items
- **Version History** — Every AI analysis is versioned; edit analyses with tracked change history
- **Sharing** — Generate secure share links for read-only meeting views (no login required)
- **Multiple Export Formats** — Export meetings and analyses as:
  - JSON (structured data export)
  - PDF (professional reports)
  - Trello (sync action items to Trello boards)
  - Notion (sync action items to Notion databases)
- **Authentication** — JWT-based auth with access + refresh token rotation
- **Rate Limiting** — Configurable rate limiting for general, AI, and auth endpoints
- **Meeting Organization** — Tags, types (standup, sprint-planning, client, academic, leadership), archiving

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Mongoose ODM |
| Database | MongoDB Atlas |
| AI | Claude API (primary), OpenAI GPT-4 (fallback) |
| Integrations | Trello API, Notion API |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Testing | Jest, Supertest, mongodb-memory-server |
| Logging | Winston (file + console transports) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Claude API key (recommended) or OpenAI API key for AI features

### Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration (see SETUP_GUIDE.md for details)
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

**For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## Environment Variables

### Backend Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | **Yes** | Refresh token signing secret (min 32 chars) |
| `CLAUDE_API_KEY` | Recommended | Claude API key (primary AI provider) |
| `OPENAI_API_KEY` | No | OpenAI API key (fallback AI provider) |
| `TRELLO_API_KEY` | No | Trello integration API key |
| `TRELLO_API_TOKEN` | No | Trello integration token |
| `NOTION_API_KEY` | No | Notion integration API key |
| `CORS_ORIGIN` | No | Allowed CORS origins (comma-separated) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Rate limit threshold (default: 100) |
| `LOG_LEVEL` | No | Log level: `info`, `warn`, `error`, `debug` |

---

## API Overview

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | `POST` | Register new user |
| `/api/auth/login` | `POST` | Login with email/password |
| `/api/auth/refresh` | `POST` | Refresh access token |
| `/api/auth/logout` | `POST` | Logout |
| `/api/auth/profile` | `GET` | Get current user profile |

### Meetings Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/meetings` | `GET` | List meetings (paginated, filterable) |
| `/api/meetings/search` | `GET` | Advanced search across meetings |
| `/api/meetings` | `POST` | Create new meeting |
| `/api/meetings/:id` | `GET` | Get meeting details |
| `/api/meetings/:id` | `PUT` | Update meeting |
| `/api/meetings/:id` | `DELETE` | Delete meeting |
| `/api/meetings/:id/archive` | `PATCH` | Toggle archive status |
| `/api/meetings/:id/share` | `PATCH` | Generate/revoke share link |

### Analysis & AI
| Endpoint | Method | Description |
| | `POST` | Generate AI analysis for meeting |
| `/api/analyses/meetings/:meetingId/latest` | `GET` | Get latest analysis |
| `/api/analyses/meetings/:meetingId/versions` | `GET` | List all analysis versions |
| `/api/analyses/:id` | `PUT` | Update analysis |
| `/api/analyses/:id/confirm` | `PATCH` | Confirm analysis changes |

### Action Items
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/action-items` | `GET` | List all action items |
| `/api/action-items/stats` | `GET` | Get action item statistics |
| `/api/action-items/:analysisId/:actionItemId` | `PATCH` | Update action item |

### Exports & Integrations
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/export/meetings/:id/json` | `GET` | Export as JSON |
| `/api/export/meetings/:id/pdf` | `GET` | Export as PDF |
| `/api/export/meetings/:id/trello` | `POST` | Export to Trello board |
| `/api/export/meetings/:id/notion` | `POST` | Export to Notion database |

### Public Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/shared/:shareToken` | `GET` | Get shared meeting (no auth required) |
| `/api/health` | `GET` | Health check endpoint |

---

## Advanced Features

### Meeting Search
Search across all meetings with a single query:
```bash
GET /api/meetings/search?q=budget&page=1&limit=20&archived=false
```

Searches in:
- Meeting titles
- Meeting content
- Analysis summaries
- Key points
- Action item descriptions and owners

### Export to Trello
Send action items directly to Trello:
```bash
POST /api/export/meetings/:id/trello
{
  "boardId": "trello-board-id",
  "listId": "trello-list-id"
}
```

### Export to Notion
Sync action items to Notion databases:
```bash
POST /api/export/meetings/:id/notion
{
  "databaseId": "notion-database-id"
}
```

---

## Project Structure

```
ai-meeting-platform/
├── README.md                   # This file
├── SETUP_GUIDE.md             # Detailed setup instructions
├── .env.example               # Environment template
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js          # Express app & startup
│   │   ├── config/            # env, database, cors
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic & AI
│   │   ├── middleware/        # Auth, rate limiting, error handling
│   │   ├── validators/        # Input validation schemas
│   │   └── utils/             # Utilities & helpers
│   └── tests/
│       ├── unit/              # Unit tests
│       └── integration/       # API integration tests
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route pages
│       ├── api/client.js      # API client with interceptors
│       ├── context/           # React context (Auth)
│       └── utils/             # Constants & helpers
├── claude-api-service/        # Options Python wrapper
│   ├── main.py
│   ├── ai_service.py
│   ├── schemas.py
│   └── requirements.txt
└── docs/
    ├── api-reference.md       # Complete API docs
    ├── architecture.md        # System architecture
    ├── database-schema.md     # MongoDB schema
    └── setup-guide.md         # Deployment guide
```

---

## Testing

```bash
cd backend

# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration

# Run with coverage report
npm test -- --coverage
```

---

## Troubleshooting

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for detailed troubleshooting steps.

**Common issues:**
- Missing API keys → Check `.env` file setup
- MongoDB connection errors → Verify `MONGODB_URI` format
- CORS errors → Ensure `CORS_ORIGIN` includes your frontend URL
- Port already in use → Change `PORT` or kill existing process

---

## Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** — Complete setup and deployment guide
- **[docs/api-reference.md](docs/api-reference.md)** — Full API documentation
- **[docs/architecture.md](docs/architecture.md)** — System architecture
- **[docs/database-schema.md](docs/database-schema.md)** — Database schema
- **[PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)** — Project analysis and fixes applied

---

## Key Improvements

This version includes the following enhancements:

✅ **Integrated Claude API** - Automatic Claude API support with OpenAI fallback  
✅ **Removed hardcoded credentials** - All sensitive data moved to environment variables  
✅ **Advanced search** - Full-text search across meetings and analyses  
✅ **Trello integration** - Export action items to Trello boards  
✅ **Notion integration** - Export action items to Notion databases  
✅ **Improved error handling** - Better error messages and API responses  
✅ **Enhanced frontend client** - Support for new export endpoints

---

## Support

For issues, questions, or feature requests, please check the documentation or open an issue.

---

## License

MIT License - See LICENSE file for details
