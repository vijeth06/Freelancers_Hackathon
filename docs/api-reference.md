# API Reference

Base URL: `http://localhost:5000/api`

All responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // Optional validation details
}
```

---

## Authentication

### Register

```
POST /auth/register
```

**Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 8 chars, must contain uppercase, lowercase, and number |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Login

```
POST /auth/login
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Response (200):** Same structure as register.

### Refresh Token

```
POST /auth/refresh
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `refreshToken` | string | Yes |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Logout

```
POST /auth/logout
Authorization: Bearer <accessToken>
```

**Body:**

| Field | Type | Required |
|-------|------|----------|
| `refreshToken` | string | Yes |

**Response (200):**

```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

### Get Profile

```
GET /auth/profile
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Meetings

All meeting endpoints require `Authorization: Bearer <accessToken>`.

### List Meetings

```
GET /meetings
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `type` | string | — | Filter by meeting type |
| `search` | string | — | Search in title, content, tags |
| `isArchived` | boolean | false | Include archived meetings |
| `sortBy` | string | `date` | Sort field: `date`, `title`, `createdAt` |
| `sortOrder` | string | `desc` | Sort direction: `asc`, `desc` |
| `startDate` | date | — | Filter meetings from date |
| `endDate` | date | — | Filter meetings until date |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "meetings": [
      {
        "_id": "...",
        "title": "Sprint Planning Q1",
        "type": "sprint-planning",
        "date": "2024-01-15T10:00:00.000Z",
        "participants": ["Alice", "Bob"],
        "tags": ["sprint", "q1"],
        "isArchived": false,
        "isShared": false,
        "latestAnalysis": { ... },
        "actionItemCounts": {
          "total": 5,
          "pending": 3,
          "completed": 2
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

### Create Meeting

```
POST /meetings
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | 1-200 characters |
| `rawContent` | string | Yes | 10-50000 characters |
| `type` | string | No | One of: `standup`, `sprint-planning`, `client-meeting`, `academic`, `leadership`, `general` (default) |
| `date` | date | No | Meeting date (defaults to now) |
| `participants` | string[] | No | List of participant names |
| `tags` | string[] | No | List of tags |

**Response (201):**

```json
{
  "success": true,
  "data": {
    "meeting": { ... }
  }
}
```

### Get Meeting

```
GET /meetings/:id
```

**Response (200):** Meeting object with populated latest analysis.

### Update Meeting

```
PUT /meetings/:id
```

**Body:** Same as create except `rawContent` cannot be changed.

### Delete Meeting

```
DELETE /meetings/:id
```

**Response (200):**

```json
{
  "success": true,
  "data": { "message": "Meeting deleted successfully" }
}
```

### Toggle Share

```
POST /meetings/:id/share
```

Generates or revokes a share token.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "meeting": { ... },
    "shareUrl": "http://localhost:3000/shared/abc-123-def"
  }
}
```

### Toggle Archive

```
POST /meetings/:id/archive
```

**Response (200):** Updated meeting object.

---

## Analyses

All analysis endpoints require `Authorization: Bearer <accessToken>`.

### Generate Analysis

```
POST /analyses/meetings/:meetingId/generate
```

Triggers AI analysis of the meeting content. Creates a new version.

**Response (201):**

```json
{
  "success": true,
  "data": {
    "analysis": {
      "_id": "...",
      "meetingId": "...",
      "version": 1,
      "summary": "The team discussed...",
      "keyPoints": ["Point 1", "Point 2"],
      "actionItems": [
        {
          "_id": "...",
          "task": "Complete API integration",
          "owner": "Alice",
          "deadline": "2024-02-01",
          "priority": "high",
          "status": "pending"
        }
      ],
      "aiModel": "gpt-4",
      "tokenUsage": {
        "prompt": 500,
        "completion": 300,
        "total": 800
      }
    }
  }
}
```

### Get Latest Analysis

```
GET /analyses/meetings/:meetingId/latest
```

### Get All Versions

```
GET /analyses/meetings/:meetingId/versions
```

Returns all analysis versions for a meeting, sorted by version descending.

### Get Specific Version

```
GET /analyses/meetings/:meetingId/versions/:version
```

### Update Analysis

```
PUT /analyses/:id
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `summary` | string | No | Updated summary |
| `keyPoints` | string[] | No | Updated key points |
| `actionItems` | object[] | No | Updated action items |
| `changeDescription` | string | Yes | Description of what changed |

Creates an entry in `editHistory` with the previous data snapshot.

### Confirm Analysis

```
POST /analyses/:id/confirm
```

Marks the analysis as human-confirmed.

### Get Edit History

```
GET /analyses/:id/history
```

Returns the full edit history for an analysis.

---

## Action Items

All action item endpoints require `Authorization: Bearer <accessToken>`.

### List All Action Items

```
GET /action-items
```

Returns action items across all meetings using MongoDB aggregation.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Items per page (max 100) |
| `status` | string | — | Filter: `pending`, `in-progress`, `completed`, `cancelled` |
| `priority` | string | — | Filter: `low`, `medium`, `high`, `critical` |
| `owner` | string | — | Filter by owner name (partial match) |
| `sortBy` | string | `createdAt` | Sort field |
| `sortOrder` | string | `desc` | Sort direction |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "actionItems": [
      {
        "analysisId": "...",
        "meetingId": "...",
        "meetingTitle": "Sprint Planning Q1",
        "actionItem": {
          "_id": "...",
          "task": "Complete API integration",
          "owner": "Alice",
          "deadline": "2024-02-01",
          "priority": "high",
          "status": "pending"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 23,
      "pages": 1
    }
  }
}
```

### Get Dashboard Stats

```
GET /action-items/stats
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 50,
      "byStatus": {
        "pending": 20,
        "in-progress": 15,
        "completed": 10,
        "cancelled": 5
      },
      "byPriority": {
        "critical": 5,
        "high": 15,
        "medium": 20,
        "low": 10
      },
      "overdue": 3
    }
  }
}
```

### Update Action Item

```
PUT /action-items/:analysisId/:actionItemId
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task` | string | No | Updated task description |
| `owner` | string | No | Updated owner |
| `deadline` | string | No | Updated deadline |
| `priority` | string | No | `low`, `medium`, `high`, `critical` |
| `status` | string | No | `pending`, `in-progress`, `completed`, `cancelled` |

---

## Export

Requires `Authorization: Bearer <accessToken>`.

### Export as JSON

```
GET /export/meetings/:id/json
```

Returns a structured JSON document with meeting and analysis data.

### Export as PDF

```
GET /export/meetings/:id/pdf
```

Returns a PDF document (`application/pdf`).

---

## Shared (Public)

### Get Shared Meeting

```
GET /shared/:shareToken
```

No authentication required. Returns meeting data if sharing is enabled.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "title": "Sprint Planning Q1",
    "type": "sprint-planning",
    "date": "2024-01-15T10:00:00.000Z",
    "participants": ["Alice", "Bob"],
    "tags": ["sprint"],
    "rawContent": "...",
    "analysis": { ... }
  }
}
```

---

## Rate Limits

| Endpoint Group | Window | Max Requests |
|---------------|--------|-------------|
| General | 15 min | 100 (configurable) |
| Auth (`/auth/*`) | 15 min | 20 |
| AI (`/analyses/*/generate`) | 15 min | 10 |

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1705312800
```

---

## Health Check

```
GET /api/health
```

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```
