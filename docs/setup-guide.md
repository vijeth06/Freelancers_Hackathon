# Setup Guide

Complete guide for setting up MeetingAI locally and in production.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Backend runtime & frontend build |
| npm | 9+ | Package management |


---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "AI meeting"
```

### 2. Backend Setup

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://SubashP:subash25@cluster0.ib61c1f.mongodb.net/ai-meeting-platform
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_REFRESH_SECRET=another-secret-key-at-least-32-characters-long
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
OPENAI_API_KEY=sk-your-api-key    # Optional
OPENAI_MODEL=gpt-4               # Or gpt-3.5-turbo for lower cost
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

> **Generating secure secrets:**
> ```bash
> # Using Node.js
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
>
> # Using OpenSSL
> openssl rand -hex 64
> ```

#### Start MongoDB

This project uses **MongoDB Atlas** (cloud). The connection string is already configured in your `.env` file. No local MongoDB installation is needed.

#### Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`.

Verify: `curl http://localhost:5000/api/health`

### 3. Frontend Setup

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## Running Tests

```bash
cd backend

# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage
npx jest --coverage
```

Tests use `mongodb-memory-server` which automatically downloads and runs a temporary MongoDB instance. No external database is needed.

---

## Without OpenAI API Key

The application works without an OpenAI API key. When no key is configured:

1. The AI service automatically uses a **fallback regex-based analyzer**
2. The fallback extracts:
   - Action items from patterns like "Action:", "TODO:", "- [ ]"
   - Owners from "@mentions" and "assigned to" patterns
   - Deadlines from "by [date]", "deadline:", "due:" patterns
   - Basic summary from content length
3. Results will be less sophisticated than GPT output but still functional
4. The `aiModel` field will show `"fallback"` instead of `"gpt-4"`

---

## Common Issues

### MongoDB Connection Issues

Ensure your MongoDB Atlas connection string is correct in `.env` and that your IP is whitelisted in the Atlas dashboard.

### JWT Secret Required

```
FATAL: JWT_SECRET environment variable is required
```

**Solution:** Set `JWT_SECRET` and `JWT_REFRESH_SECRET` in your `.env` file.

### CORS Errors in Browser

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** Ensure `CORS_ORIGIN` in `.env` matches your frontend URL (including port).

### OpenAI Rate Limit (429)

```
OpenAI API rate limit exceeded
```

**Solution:** The app has built-in rate limiting. Wait and retry. Consider upgrading your OpenAI plan or reducing concurrent requests.

---

## Production Checklist

- [ ] Generate strong, unique JWT secrets (64+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure a strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Set appropriate rate limits
- [ ] Configure CORS to only allow your domain
- [ ] Set up SSL/TLS termination (use a reverse proxy like Nginx or Cloudflare)
- [ ] Enable MongoDB backups
- [ ] Set up log aggregation (Winston outputs to files in production)
- [ ] Configure monitoring and alerting
- [ ] Review and adjust rate limit settings
- [ ] Set `LOG_LEVEL=warn` or `error` for production
