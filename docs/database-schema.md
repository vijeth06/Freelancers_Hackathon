# Database Schema

MeetingAI uses MongoDB with Mongoose ODM. Three primary collections are defined.

---

## Users Collection

Stores user accounts, authentication credentials, and active refresh tokens.

```javascript
{
  _id: ObjectId,
  name: String,            // Required, 2-100 chars, trimmed
  email: String,           // Required, unique, lowercase, indexed
  password: String,        // Required, min 8 chars, bcrypt hashed (salt 12)
  role: String,            // Enum: 'user' | 'admin', default: 'user'
  isActive: Boolean,       // Default: true, for soft-disable
  refreshTokens: [         // Active refresh tokens (max stored)
    {
      token: String,       // JWT refresh token
      userAgent: String,   // Client user-agent
      expiresAt: Date      // Token expiration
    }
  ],
  createdAt: Date,         // Auto (timestamps)
  updatedAt: Date          // Auto (timestamps)
}
```

**Indexes:**
- `email`: unique
- `createdAt`: ascending

**Instance Methods:**
- `comparePassword(candidatePassword)` — Compare plaintext against hash
- `cleanExpiredTokens()` — Remove expired refresh tokens and save

**Middleware:**
- Pre-save hook hashes password (bcrypt, salt 12) if modified

**JSON Transform:**
- Excludes `password`, `refreshTokens`, `__v` from serialization

---

## Meetings Collection

Stores meeting metadata and raw content. Linked to analyses via virtual population.

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Ref: User, required, indexed
  title: String,           // Required, 1-200 chars, trimmed
  type: String,            // Enum: 'standup' | 'sprint-planning' | 'client-meeting' |
                           //       'academic' | 'leadership' | 'general'
                           // Default: 'general'
  rawContent: String,      // Required, 10-50000 chars, immutable after creation
  date: Date,              // Default: Date.now
  participants: [String],  // Trimmed, empty strings filtered
  tags: [String],          // Lowercase, trimmed, empty strings filtered
  shareToken: String,      // Unique (sparse), for public sharing
  isShared: Boolean,       // Default: false
  isArchived: Boolean,     // Default: false
  createdAt: Date,         // Auto (timestamps)
  updatedAt: Date          // Auto (timestamps)
}
```

**Indexes:**
- `userId`: ascending
- `userId` + `date`: compound descending
- `userId` + `type`: compound
- `shareToken`: unique sparse
- `tags`: ascending
- `title` + `rawContent`: text index (for search)

**Virtual Fields:**
- `analyses` — Populated from Analysis collection where `meetingId` matches
- `latestAnalysis` — Most recent analysis version

**Instance Methods:**
- `generateShareToken()` — Generate UUID v4 share token, set `isShared: true`
- `revokeShareToken()` — Remove share token, set `isShared: false`

---

## Analyses Collection

Stores AI-generated analysis results with versioning and edit history.

```javascript
{
  _id: ObjectId,
  meetingId: ObjectId,     // Ref: Meeting, required, indexed
  userId: ObjectId,        // Ref: User, required, indexed
  version: Number,         // Required, min 1
  summary: String,         // Required, trimmed
  keyPoints: [String],     // Required, each 1-1000 chars, min 1 item
  actionItems: [           // Embedded subdocuments
    {
      _id: ObjectId,       // Auto-generated
      task: String,        // Required, trimmed
      owner: String,       // Default: 'Unassigned', trimmed
      deadline: String,    // Default: 'Not specified', trimmed
      priority: String,    // Enum: 'low' | 'medium' | 'high' | 'critical'
                           // Default: 'medium'
      status: String,      // Enum: 'pending' | 'in-progress' | 'completed' | 'cancelled'
                           // Default: 'pending'
      createdAt: Date      // Default: Date.now
    }
  ],
  aiModel: String,         // Model used: 'gpt-4', 'fallback', etc.
  tokenUsage: {
    prompt: Number,        // Default: 0
    completion: Number,    // Default: 0
    total: Number          // Default: 0
  },
  editHistory: [           // Tracked changes
    {
      editedBy: ObjectId,  // Ref: User
      editedAt: Date,      // Default: Date.now
      previousData: {      // Snapshot before edit
        summary: String,
        keyPoints: [String],
        actionItems: Mixed
      },
      changeDescription: String  // User-provided reason
    }
  ],
  confirmedAt: Date,       // When human-confirmed
  confirmedBy: ObjectId,   // Ref: User who confirmed
  createdAt: Date,         // Auto (timestamps)
  updatedAt: Date          // Auto (timestamps)
}
```

**Indexes:**
- `meetingId`: ascending
- `userId`: ascending
- `meetingId` + `version`: compound, unique
- `actionItems.status`: ascending
- `actionItems.priority`: ascending
- `actionItems.owner`: ascending

---

## Entity Relationship Diagram

```
┌──────────┐       1:N       ┌───────────┐       1:N       ┌───────────┐
│  Users   │────────────────▶│ Meetings  │────────────────▶│ Analyses  │
│          │                 │           │                 │           │
│ _id      │                 │ _id       │                 │ _id       │
│ name     │                 │ userId ◀──│                 │ meetingId◀│
│ email    │                 │ title     │                 │ userId ◀──│
│ password │                 │ type      │                 │ version   │
│ role     │                 │ rawContent│                 │ summary   │
│ tokens[] │                 │ date      │                 │ keyPoints │
└──────────┘                 │ tags[]    │                 │ items[]   │
                             │ shareToken│                 │ editHist[]│
                             └───────────┘                 │ tokenUsage│
                                                           └───────────┘
                                                                │
                                                           Embedded:
                                                           ActionItems[]
                                                           ┌───────────┐
                                                           │ task      │
                                                           │ owner     │
                                                           │ deadline  │
                                                           │ priority  │
                                                           │ status    │
                                                           └───────────┘
```

## Design Decisions

### Action Items as Embedded Documents

Action items are embedded within Analyses rather than stored in a separate collection because:

1. **Atomic reads** — An analysis with its action items is always read together
2. **Versioning** — Each analysis version has its own snapshot of action items
3. **Consistency** — No risk of orphaned action items
4. **Performance** — Single document read for analysis + items

Cross-meeting action item queries use MongoDB aggregation (`$unwind` + `$match` + `$sort` + `$skip/$limit`).

### Analysis Versioning

Each AI generation creates a new Analysis document with an incremented version number. This allows:

- Comparing different AI outputs
- Rolling back to previous versions
- Tracking how analysis evolves with edits

### Edit History as Embedded Array

Edit history is embedded within the Analysis document because:

- History is always accessed in context of its analysis
- Typical edit count is small (< 50 per analysis)
- Prevents a proliferation of small collections

### Share Tokens

Share tokens use UUID v4 with a unique sparse index. The sparse index means:

- Only documents with a `shareToken` value are indexed
- Shared meetings can be looked up efficiently by token
- Non-shared meetings don't consume index space
