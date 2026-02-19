# 🚀 MeetingAI — AI Meeting Notes & Action Item Intelligence Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)

**Transform meeting transcripts into actionable intelligence with AI-powered analysis**

[Quick Start](#-quick-start) • [Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**MeetingAI** is a production-ready, full-stack SaaS platform that transforms raw meeting transcripts into structured intelligence. Using advanced AI (Claude API with OpenAI fallback), the platform automatically:

✨ **Generates structured summaries** from unstructured meeting notes  
✨ **Extracts key points** and discussion highlights  
✨ **Identifies action items** with owners, deadlines, and priorities  
✨ **Integrates with existing tools** (Trello, Notion)  
✨ **Provides secure sharing** for stakeholder collaboration  

**Perfect for:** Product teams, engineering organizations, consulting firms, academic institutions, and leadership teams managing multiple meetings per week.

---

## ✨ Features

### 🤖 AI-Powered Intelligence
- **Claude API Integration** — Primary AI engine for superior analysis quality
- **OpenAI Fallback** — Automatic fallback to GPT-4 if Claude unavailable
- **Intelligent Parsing** — Regex-based parsing for offline mode
- **Real-time Analysis** — Generate summaries within seconds
- **Version Tracking** — Save and compare multiple analysis versions

### 📊 Meeting Management
- **Flexible Upload Methods** — Drag-and-drop, file picker, direct text paste
- **Support Multiple Formats** — TXT, PDF, DOC, DOCX, CSV transcripts
- **Meeting Organization** — Tags, types (standup, sprint, client, academic, leadership)
- **Advanced Search** — Full-text search across titles, content, summaries
- **Meeting Archive** — Keep history organized with archive status

### ✅ Action Item Tracking
- **Automatic Extraction** — AI extracts tasks with owners and deadlines
- **Central Dashboard** — View all action items across meetings
- **Smart Filtering** — Filter by status, priority, owner, due date
- **Priority Levels** — High, Medium, Low priority indicators
- **Status Tracking** — Pending → In Progress → Completed

### 📤 Export & Integration
- **JSON Export** — Structured data export for integrations
- **PDF Report** — Professional PDF generation
- **Trello Sync** — Create cards directly in Trello boards
- **Notion Sync** — Add pages to Notion databases
- **Secure Sharing** — Generate share links for read-only access

### 🔐 Security & Performance
- **JWT Authentication** — Access + refresh token rotation
- **Password Hashing** — bcrypt with configurable rounds
- **Rate Limiting** — Protect against abuse on auth, general, and AI endpoints
- **CORS Protection** — Configurable cross-origin access
- **Error Handling** — Comprehensive error messages with proper HTTP status

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, React Router 6, Tailwind CSS, Axios, React Hot Toast |
| **Backend** | Node.js 18+, Express.js, Mongoose ODM |
| **Database** | MongoDB (Atlas or local) |
| **AI Engines** | Claude API, OpenAI GPT-4, Regex parser |
| **Integrations** | Trello API, Notion API |
| **Authentication** | JWT, bcryptjs |
| **Export** | PDFKit, jsPDF |
| **Logging** | Winston (file + console) |
| **Testing** | Jest, Supertest, mongodb-memory-server |
| **Development** | nodemon, Webpack, Babel |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas account)
- **Claude API key** (recommended) — Get it free at https://console.anthropic.com

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/vijeth06/Freelancers_Hackathon.git
cd Freelancers_Hackathon

# 2. Install backend dependencies
cd backend
npm install

# 3. Create and configure .env
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-meeting-platform
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters
CLAUDE_API_KEY=sk-ant-your-key-here
LOG_LEVEL=info
EOF

# 4. Start backend server
npm run dev

# 5. In another terminal, start frontend
cd ../frontend
npm install
npm start
```

✅ **Backend running:** http://localhost:5000  
✅ **Frontend running:** http://localhost:3001

**[See detailed setup guide →](SETUP_GUIDE.md)**


---

## 🔧 Installation

### Detailed Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env
```

### Detailed Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. (Optional) Create .env if using custom API endpoint
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Output: ✅ Server running on port 5000
# Output: ✅ MongoDB connected successfully
# Output: ✅ Claude API client initialized
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Output: ✅ Compiled successfully!
# Opens: http://localhost:3001
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-meeting-platform
# Or use MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/database

# JWT Secrets (use strong, random values - minimum 32 characters)
JWT_SECRET=your-super-secret-access-token-key-min-32-chars-long
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-chars

# AI Providers
CLAUDE_API_KEY=sk-ant-...  # Get from https://console.anthropic.com
OPENAI_API_KEY=sk-...      # Optional fallback

# Optional: Third-party Integrations
TRELLO_API_KEY=your-trello-key
TRELLO_API_TOKEN=your-trello-token
NOTION_API_KEY=ntn_...

# CORS & Security
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Configuration Details

| Variable | Required | Type | Example | Notes |
|----------|----------|------|---------|-------|
| `NODE_ENV` | No | enum | `development` | Set to `production` for deploy |
| `PORT` | No | number | `5000` | Change if port is in use |
| `MONGODB_URI` | **Yes** | string | `mongodb://localhost/db` | Local or Atlas |
| `JWT_SECRET` | **Yes** | string | Min 32 chars | Use `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | **Yes** | string | Min 32 chars | Should differ from JWT_SECRET |
| `CLAUDE_API_KEY` | Recommended | string | `sk-ant-...` | Free tier available |
| `OPENAI_API_KEY` | No | string | `sk-...` | Fallback AI engine |
| `LOG_LEVEL` | No | enum | `info` | Options: `debug`, `info`, `warn`, `error` |

---

## 💻 Usage

### Create Your First Meeting

1. **Register Account**
   - Go to http://localhost:3001
   - Click "Get Started"
   - Create account with email and password

2. **Create a Meeting**
   - Click "New Meeting" button
   - Fill in meeting details:
     - Title: "Q1 Planning Session"
     - Type: "Sprint Planning"
     - Date: Today
     - Participants: Alice, Bob, Charlie

3. **Upload Meeting Transcript**
   - Choose upload method:
     - **Drag & Drop** — Drop transcript file
     - **File Picker** — Browse for file
     - **Text Paste** — Paste meeting notes directly
   - Supported formats: TXT, PDF, DOC, DOCX, CSV

4. **View AI Analysis**
   - Automatically generates:
     - **Summary** — Main discussion points
     - **Key Points** — Highlighted discussions
     - **Action Items** — Tasks with owners, deadlines, priorities

5. **Manage Action Items**
   - View in Dashboard or Meeting Detail
   - Update status: Pending → In Progress → Completed
   - Filter by priority, owner, status
   - Mark important items as high priority

6. **Export Results**
   - Click "Export" button
   - Choose format:
     - **JSON** — For integrations
     - **PDF** — Professional report
     - **Trello** — Create board cards
     - **Notion** — Add to database

### Example Meeting Transcript

```
Meeting: Product Planning Meeting
Date: Feb 19, 2026
Attendees: Sarah (PM), Mike (Dev Lead), Lisa (Designer)

Sarah: We need to launch the new dashboard by March 15th. This is critical for our customers.
Mike: I can allocate 2 team members. We'll need 3 weeks. Design needs to be finalized by next week.
Lisa: I'll have mockups ready by Friday. Need feedback ASAP.
Sarah: Lisa, can you prioritize dashboard over other design work?
Lisa: Yes, that's my top priority now.
Mike: We'll also need to update documentation. That's lower priority.
Sarah: Alice will handle documentation. Mike, can you lead the implementation?
Mike: Absolutely. Let's sync on technical requirements tomorrow.
```

**AI Generated Output:**
- **Summary:** Team planning dashboard launch for March 15 deadline
- **Key Points:**
  - Dashboard launch critical for customers
  - 3-week timeline needed from development
  - Design mockups due Friday
- **Action Items:**
  - Finalize dashboard design (Owner: Lisa, Due: Feb 23, Priority: High)
  - Implement dashboard features (Owner: Mike, Due: Mar 15, Priority: High)
  - Update documentation (Owner: Alice, Due: Mar 20, Priority: Medium)
  - Technical requirements sync (Owner: Mike, Due: Feb 20, Priority: High)

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/refresh` | Refresh access token | ❌ |
| `POST` | `/api/auth/logout` | Logout (clear tokens) | ✅ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |

**Register Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
# Returns: { accessToken, refreshToken, user }
```

### Meetings Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/meetings` | List all meetings (paginated) | ✅ |
| `GET` | `/api/meetings/search?q=query` | Advanced full-text search | ✅ |
| `POST` | `/api/meetings` | Create new meeting | ✅ |
| `GET` | `/api/meetings/:id` | Get meeting details | ✅ |
| `PUT` | `/api/meetings/:id` | Update meeting | ✅ |
| `DELETE` | `/api/meetings/:id` | Delete meeting | ✅ |
| `PATCH` | `/api/meetings/:id/archive` | Toggle archive status | ✅ |
| `PATCH` | `/api/meetings/:id/share` | Generate share link | ✅ |

**Create Meeting Example:**
```bash
curl -X POST http://localhost:5000/api/meetings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q1 Planning",
    "type": "Sprint Planning",
    "date": "2026-02-19",
    "participants": ["Alice", "Bob"],
    "tags": ["planning", "q1"],
    "content": "Full meeting transcript here..."
  }'
```

### Analysis & AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/analyses` | Generate AI analysis | ✅ |
| `GET` | `/api/analyses/meetings/:meetingId/latest` | Get latest analysis | ✅ |
| `GET` | `/api/analyses/meetings/:meetingId/versions` | List all versions | ✅ |
| `PUT` | `/api/analyses/:id` | Edit analysis | ✅ |
| `PATCH` | `/api/analyses/:id/confirm` | Confirm changes | ✅ |

### Action Items Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/action-items` | List all action items | ✅ |
| `GET` | `/api/action-items/stats` | Get statistics | ✅ |
| `PATCH` | `/api/action-items/:analysisId/:itemId` | Update action item | ✅ |

**Update Action Item Example:**
```bash
curl -X PATCH http://localhost:5000/api/action-items/analysisId/itemId \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "priority": "high"
  }'
```

### Export Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/export/meetings/:id/json` | Export as JSON | ✅ |
| `GET` | `/api/export/meetings/:id/pdf` | Export as PDF | ✅ |
| `POST` | `/api/export/meetings/:id/trello` | Export to Trello | ✅ |
| `POST` | `/api/export/meetings/:id/notion` | Export to Notion | ✅ |

### Public Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/shared/:shareToken` | Get shared meeting | ❌ |
| `GET` | `/api/health` | Health check | ❌ |

---

## 📁 Project Structure

```
Freelancers_Hackathon/
│
├── 📄 README.md                    # This file
├── 📄 QUICK_START.md               # 5-minute setup guide
├── 📄 SETUP_GUIDE.md               # Detailed setup & deployment
├── 📄 BUG_REPORT.md                # Known issues & fixes
├── 📄 .env.example                 # Environment template
│
├── 📦 backend/                     # Node.js/Express API
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 .env                     # Configuration (local)
│   ├── src/
│   │   ├── 📄 server.js            # Express app setup
│   │   ├── config/
│   │   │   ├── 📄 database.js      # MongoDB connection
│   │   │   ├── 📄 cors.js          # CORS settings
│   │   │   └── 📄 env.js           # Config loader
│   │   ├── models/
│   │   │   ├── 📄 User.js          # User model
│   │   │   ├── 📄 Meeting.js       # Meeting model
│   │   │   ├── 📄 Analysis.js      # Analysis with action items
│   │   │   └── 📄 index.js         # Models export
│   │   ├── routes/
│   │   │   ├── 📄 auth.js          # Auth routes
│   │   │   ├── 📄 meetings.js      # Meeting routes
│   │   │   ├── 📄 analyses.js      # Analysis routes
│   │   │   ├── 📄 actionItems.js   # Action items routes
│   │   │   ├── 📄 export.js        # Export routes
│   │   │   └── 📄 shared.js        # Public routes
│   │   ├── controllers/
│   │   │   ├── 📄 authController.js
│   │   │   ├── 📄 meetingController.js
│   │   │   ├── 📄 analysisController.js
│   │   │   ├── 📄 actionItemController.js
│   │   │   └── 📄 exportController.js
│   │   ├── services/
│   │   │   ├── 📄 aiService.js     # AI analysis (Claude/OpenAI)
│   │   │   ├── 📄 authService.js   # Auth business logic
│   │   │   ├── 📄 meetingService.js # Meeting search & operations
│   │   │   └── 📄 exportService.js # Export integrations
│   │   ├── middleware/
│   │   │   ├── 📄 auth.js          # JWT verification
│   │   │   ├── 📄 errorHandler.js  # Global error handling
│   │   │   ├── 📄 rateLimiter.js   # Rate limiting
│   │   │   └── 📄 validate.js      # Input validation
│   │   ├── validators/
│   │   │   ├── 📄 authValidator.js
│   │   │   ├── 📄 meetingValidator.js
│   │   │   └── 📄 analysisValidator.js
│   │   └── utils/
│   │       ├── 📄 apiError.js      # Error class
│   │       ├── 📄 logger.js        # Winston logging
│   │       └── 📄 schemaValidator.js
│   └── tests/
│       ├── setup.js
│       ├── unit/                   # Unit tests
│       └── integration/            # API tests
│
├── 📱 frontend/                    # React.js App
│   ├── 📄 package.json
│   ├── public/
│   │   └── 📄 index.html           # HTML entry point
│   └── src/
│       ├── 📄 App.jsx              # Main app component
│       ├── 📄 index.js             # React entry point
│       ├── 📄 index.css            # Global styles
│       ├── pages/
│       │   ├── 📄 Home.jsx         # Landing page
│       │   ├── 📄 Login.jsx        # Login page
│       │   ├── 📄 Register.jsx     # Registration page
│       │   ├── 📄 Dashboard.jsx    # Meeting list
│       │   ├── 📄 MeetingCreate.jsx # Create meeting
│       │   ├── 📄 MeetingDetail.jsx # Meeting view
│       │   ├── 📄 ActionItems.jsx  # Action items list
│       │   └── 📄 SharedView.jsx   # Public share view
│       ├── components/
│       │   ├── 📄 Navbar.jsx
│       │   ├── 📄 Layout.jsx
│       │   ├── 📄 MeetingCard.jsx
│       │   ├── 📄 ActionItemRow.jsx
│       │   ├── 📄 ActionItemFilters.jsx
│       │   ├── 📄 TranscriptUpload.jsx
│       │   ├── 📄 AnalysisView.jsx
│       │   ├── 📄 AnalysisEditor.jsx
│       │   ├── 📄 ExportMenu.jsx
│       │   ├── 📄 ProtectedRoute.jsx
│       │   ├── 📄 ErrorBanner.jsx
│       │   └── 📄 LoadingSpinner.jsx
│       ├── context/
│       │   └── 📄 AuthContext.js   # Auth state management
│       ├── api/
│       │   └── 📄 client.js        # API client/interceptors
│       └── utils/
│           ├── 📄 constants.js
│           └── 📄 helpers.js
│
├── 📚 docs/
│   ├── 📄 api-reference.md         # Complete API docs
│   ├── 📄 architecture.md          # System design
│   ├── 📄 database-schema.md       # Data models
│   └── 📄 setup-guide.md           # Deployment guide
│
├── 🐍 claude-api-service/          # Python wrapper (optional)
│   ├── 📄 main.py
│   ├── 📄 ai_service.py
│   ├── 📄 schemas.py
│   └── 📄 requirements.txt
│
└── 📋 .gitignore                   # Git ignore rules
```

---

## 🗄️ Database Schema

### Collections Overview

**Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Meetings Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  type: String, // "standup", "sprint-planning", "client", etc
  date: Date,
  participants: [String],
  tags: [String],
  userId: ObjectId (ref: User),
  archived: Boolean,
  shareToken: String (unique, optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Analyses Collection**
```javascript
{
  _id: ObjectId,
  meetingId: ObjectId (ref: Meeting),
  summary: String,
  keyPoints: [String],
  actionItems: [
    {
      _id: ObjectId,
      task: String,
      owner: String,
      deadline: Date,
      priority: String, // "high", "medium", "low"
      status: String, // "pending", "in-progress", "completed"
      createdAt: Date
    }
  ],
  version: Number,
  previousVersionId: ObjectId,
  confirmedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

See [docs/database-schema.md](docs/database-schema.md) for complete schema documentation.

---

## 🧪 Testing

### Run Tests

```bash
cd backend

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Results Example
```
PASS  tests/unit/models/User.test.js
PASS  tests/unit/models/Meeting.test.js
PASS  tests/unit/models/Analysis.test.js
PASS  tests/integration/api/auth.test.js
PASS  tests/integration/api/meetings.test.js

Tests:       45 passed, 45 total
Coverage:    88.5% statements, 82.3% branches
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

**Issue:** Port 5000 already in use
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

**Issue:** MongoDB connection failed
```bash
# Check MongoDB is running
mongod --version

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/ai-meeting-platform

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

**Issue:** Claude API not responding
```
The app has automatic fallback:
- Primary: Claude API
- Secondary: OpenAI GPT-4
- Tertiary: Regex-based parser (offline mode)

Check .env has valid CLAUDE_API_KEY
```

**Issue:** CORS errors in browser
```bash
# Update .env with correct frontend URL
CORS_ORIGIN=http://localhost:3001

# Or allow multiple origins
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

**Issue:** React app won't compile
```bash
# Clear cache and reinstall
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting) for more troubleshooting steps.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/vijeth06/Freelancers_Hackathon.git
   cd Freelancers_Hackathon
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Update code
   - Add tests
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Coding Standards

- **ESLint** — Linting rules configured
- **Prettier** — Code formatting
- **Jest** — Unit and integration tests required
- **JSDoc** — Comment critical functions

### Testing Requirements

- ✅ Unit tests for new functions
- ✅ Integration tests for API endpoints
- ✅ Minimum 80% code coverage

### Commit Message Format

```
type(scope): subject

types: feat, fix, docs, style, refactor, perf, test, chore
scope: auth, meetings, analysis, export, etc
subject: imperative, lowercase, no period
```

**Examples:**
```
feat(auth): add refresh token rotation
fix(analysis): handle empty transcripts
docs(readme): add database schema
test(meetings): add search integration tests
```

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

**Copyright © 2026 MeetingAI Platform**

You are free to use, modify, and distribute this software. See LICENSE file for complete terms.

---

## 🙋 Support & Contact

### Getting Help

- 📚 **Read the Docs** — Check [docs/](docs/) for detailed guides
- 🔍 **Search Issues** — Look for existing issue reports
- 💬 **Check Discussions** — Community Q&A
- 📧 **Email Support** — support@meetingai.example.com

### Report Bugs

Found a bug? Report it on GitHub Issues with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, etc)

### Feature Requests

Have an idea? Open an issue with the **enhancement** label describing:
- Problem you're solving
- Proposed solution
- Alternative approaches
- Use case examples

### Documentation Issues

See a problem in docs? File an issue or submit a PR to improve them!

---

## 🙏 Acknowledgments

Built with ❤️ using:
- **Claude API** for AI intelligence
- **MongoDB** for reliable data storage
- **React** for interactive UI
- **Express** for robust backend

Thanks to all contributors and users!

---

<div align="center">

**[⬆ Back to Top](#-meetingai--ai-meeting-notes--action-item-intelligence-platform)**

Made with ❤️ by the MeetingAI Team

[GitHub](https://github.com/vijeth06/Freelancers_Hackathon) • [Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>
