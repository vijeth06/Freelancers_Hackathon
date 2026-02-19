# AI Meeting Platform - Complete Setup & Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- Python 3.8+ (optional, for Claude API service)
- MongoDB Atlas account or local MongoDB
- Claude API key (recommended) or OpenAI API key

### Step 1: Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Python Service (optional)
cd ../claude-api-service
pip install -r requirements.txt
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# At minimum, you need:
# - MONGODB_URI (database connection)
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - JWT_REFRESH_SECRET (generate similar to above)
# - CLAUDE_API_KEY or OPENAI_API_KEY (for AI features)
```

**Generate secure JWT secrets (recommended for production):**

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Start Development Servers

```bash
# Terminal 1 - Backend (from backend/)
npm run dev

# Terminal 2 - Frontend (from frontend/)
npm start

# Terminal 3 (Optional) - Python Service (from claude-api-service/)
python main.py
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api
- **Python Service**: http://localhost:8000 (if enabled)

---

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Meetings Endpoints

**POST /api/meetings** - Create meeting
```json
{
  "title": "Sprint Planning",
  "type": "sprint-planning",
  "rawContent": "Meeting discussion notes...",
  "participants": ["John", "Jane"],
  "tags": ["sprint", "planning"]
}
```

**GET /api/meetings** - List meetings (with filters)
```
GET /api/meetings?page=1&limit=20&search=sprint&type=sprint-planning&archived=false
```

**GET /api/meetings/search** - Advanced search
```
GET /api/meetings/search?q=budget&page=1&limit=20&archived=false
```

**GET /api/meetings/:id** - Get single meeting

### Analysis Endpoints

**POST /api/analyses/meetings/:meetingId/generate** - Generate AI analysis

**GET /api/analyses/meetings/:meetingId/latest** - Get latest analysis

**GET /api/analyses/meetings/:meetingId/versions** - Get all versions

### Export Endpoints

**GET /api/export/meetings/:meetingId/json** - Export as JSON

**GET /api/export/meetings/:meetingId/pdf** - Export as PDF

**POST /api/export/meetings/:meetingId/trello** - Export to Trello
```json
{
  "boardId": "trello-board-id",
  "listId": "trello-list-id"
}
```

**POST /api/export/meetings/:meetingId/notion** - Export to Notion
```json
{
  "databaseId": "notion-database-id"
}
```

---

## Production Deployment

### Using Docker

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - CORS_ORIGIN=${CORS_ORIGIN}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_BASE_URL=/api

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

### Deploy to Heroku (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create ai-meeting-platform-api

# Set environment variables
heroku config:set MONGODB_URI="..." --app ai-meeting-platform-api
heroku config:set JWT_SECRET="..." --app ai-meeting-platform-api
heroku config:set CLAUDE_API_KEY="..." --app ai-meeting-platform-api

# Deploy
git push heroku main
```

---

## Configuration Reference

### Backend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `CLAUDE_API_KEY` | No | Claude API key (recommended) |
| `OPENAI_API_KEY` | No | OpenAI API key (fallback) |
| `TRELLO_API_KEY` | No | Trello integration key |
| `TRELLO_API_TOKEN` | No | Trello integration token |
| `NOTION_API_KEY` | No | Notion integration key |
| `CORS_ORIGIN` | No | Allowed CORS origins |
| `RATE_LIMIT_MAX_REQUESTS` | No | Rate limit threshold |

### Frontend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_BASE_URL` | Yes | Backend API base URL |

### Python Service Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLAUDE_API_KEY` | Yes | Claude API key |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |
| `PORT` | No | Service port (default: 8000) |

---

## Getting API Keys

### Claude API Key
1. Visit https://console.anthropic.com
2. Create account or sign in
3. Create an API key in the settings
4. Add to `.env` as `CLAUDE_API_KEY`

### OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create an API key
3. Add to `.env` as `OPENAI_API_KEY`

### Trello Integration
1. Visit https://trello.com/app/keys
2. Generate API Key and Token
3. Add to `.env` as `TRELLO_API_KEY` and `TRELLO_API_TOKEN`

### Notion Integration
1. Visit https://www.notion.so/my-integrations
2. Create a new integration
3. Get the API key and add to `.env` as `NOTION_API_KEY`

### MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string and add to `.env` as `MONGODB_URI`
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

---

## Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration

# Run with coverage
npm test -- --coverage
```

### Frontend Tests (if configured)
```bash
cd frontend
npm test
```

---

## Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"
```bash
cd backend
npm install @anthropic-ai/sdk
```

### "MONGODB ERROR: Authentication failed"
- Check `MONGODB_URI` format
- Verify username/password are URL-encoded
- Ensure IP whitelist includes your server IP (MongoDB Atlas)

### "CLAUDE_API_KEY is not configured"
- Verify `.env` file exists in project root
- Check `CLAUDE_API_KEY` is set correctly
- Restart server after setting environment variables

### "CORS error when calling backend from frontend"
- Verify Backend `CORS_ORIGIN` includes frontend URL
- Check format: `http://localhost:3000` (with http://)
- In production, use full domain URL

### "Port already in use"
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## Support & Documentation

- **API Documentation**: See `docs/api-reference.md`
- **Architecture**: See `docs/architecture.md`
- **Database Schema**: See `docs/database-schema.md`

---

## License

MIT License - See LICENSE file for details
