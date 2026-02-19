# 🚀 Quick Start Guide - AI Meeting Notes Generator

## ⚡ 5-Minute Setup

### **Prerequisites**
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string
- Git installed

### **Step 1: Clone & Install**
```bash
# Clone the repository
git clone https://github.com/vijeth06/Freelancers_Hackathon.git
cd Freelancers_Hackathon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in another terminal)
cd frontend
npm install
```

### **Step 2: Configure Environment**
```bash
# In backend directory, create/update .env file:
cp .env.example .env

# Edit .env and update:
CLAUDE_API_KEY=your-claude-api-key  # Get from https://console.anthropic.com
MONGODB_URI=mongodb://localhost:27017/ai-meeting-platform  # Or your MongoDB Atlas URL
JWT_SECRET=any-secret-key-min-32-characters-long
JWT_REFRESH_SECRET=any-refresh-secret-min-32-characters
```

### **Step 3: Start Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should show: ✅ Server running on port 5000
# Should show: ✅ Claude API client initialized
# Should show: ✅ MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Should show: ✅ Compiled successfully!
# Should open: http://localhost:3001
```

### **Step 4: Test the Application**

1. **Visit**: http://localhost:3001
2. **Click**: "Get Started" button
3. **Create Account**: 
   - Email: test@example.com
   - Password: TestPass123
4. **Create Meeting**:
   - Upload or paste a meeting transcript
   - AI will analyze it automatically
5. **View Results**:
   - Summary
   - Key points
   - Action items with owners and deadlines
   - Options to export

---

## 📋 Core Features at a Glance

| Feature | Access | Status |
|---------|--------|--------|
| **Upload Meetings** | Create Meeting | ✅ Working |
| **AI Analysis** | Auto on create | ✅ Working |
| **Action Items** | Dashboard/Meeting | ✅ Working |
| **Export JSON** | Meeting detail | ✅ Working |
| **Export PDF** | Meeting detail | ✅ Working |
| **Export Trello** | Meeting detail | ✅ Requires API key |
| **Export Notion** | Meeting detail | ✅ Requires API key |
| **Search Meetings** | Dashboard | ✅ Working |
| **Meeting History** | Dashboard | ✅ Working |

---

## 🔑 API Keys (Optional but Recommended)

### **Claude API** (Primary AI)
- Get key: https://console.anthropic.com/account/keys
- Add to `.env` as `CLAUDE_API_KEY=sk-ant-...`
- Provides best AI analysis quality

### **Trello API** (Optional Export)
- Get key: https://trello.com/app-key
- Generate token from same page
- Add to `.env`: `TRELLO_API_KEY` and `TRELLO_API_TOKEN`

### **Notion API** (Optional Export)
- Create integration: https://www.notion.so/my-integrations
- Get API key
- Add to `.env` as `NOTION_API_KEY=secret_...`

---

## 🧪 Test Scenarios

### **Scenario 1: Create Meeting with AI Analysis**
1. Login to dashboard
2. Click "New Meeting"
3. Paste this sample text:
```
Meeting: Sprint Planning
Attendees: Alice, Bob, Charlie

Alice: We need to finish the API by Friday - this is critical for the client demo
Bob: I can take that task. Also, we need to update the documentation
Charlie: I'll handle the database optimization, should take 2-3 days
Bob: UI needs a redesign, but it's lower priority
Alice: Let's aim to complete everything by next Tuesday
```
4. Fill in meeting details
5. Click "Create Meeting"
6. View AI-generated analysis with extracted tasks

### **Scenario 2: Export & Manage Tasks**
1. From meeting detail page
2. Click "Export" menu
3. Try JSON or PDF export
4. View generated document

### **Scenario 3: Search & Filter**
1. Go to Dashboard
2. Use search bar to find "API"
3. Filter by meeting type (e.g., "Standup")
4. Try different combinations

---

## 🐛 Troubleshooting

### **Backend won't start - Port 5000 in use**
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/src/server.js
```

### **Frontend build fails**
```bash
# Clear node_modules and cache
rm -r frontend/node_modules
npm cache clean --force
cd frontend
npm install
```

### **MongoDB connection error**
```bash
# Make sure MongoDB is running:
# - Local: mongod should be running
# - Atlas: Check connection string in .env
```

### **Claude API not responding**
```bash
# The app falls back to regex-based analysis
# Check .env has valid CLAUDE_API_KEY
# Or leave it for offline mode (regex parser)
```

---

## 📱 URLs

| Service | URL | Login |
|---------|-----|-------|
| **Frontend** | http://localhost:3001 | test@example.com / TestPass123 |
| **Backend API** | http://localhost:5000 | N/A |
| **API Docs** | http://localhost:5000/api | View in browser |

---

## 🏗️ Project Structure

```
Freelancers_Hackathon/
├── frontend/              # React app (http://localhost:3001)
│   ├── src/pages/        # 8 page components
│   ├── src/components/   # 12 reusable components
│   └── src/api/          # API client
│
├── backend/              # Node.js API (http://localhost:5000)
│   ├── src/controllers/  # Request handlers
│   ├── src/models/       # Database schemas
│   ├── src/routes/       # API endpoints
│   └── src/services/     # Business logic
│
└── Documentation files   # Guides and references
```

---

## 📚 Documentation

- **REQUIREMENTS_VERIFICATION.md** - Complete feature checklist
- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Full project documentation
- **COMPLETION_SUMMARY.md** - Implementation details

---

## ✨ Key Technologies

- **Frontend**: React 18, Tailwind CSS, React Router 6
- **Backend**: Node.js, Express.js, Mongoose
- **AI**: Claude API (with fallbacks)
- **Database**: MongoDB
- **Export**: Trello API, Notion API, PDFKit

---

## 🎯 Next Steps

1. **Test All Features**: Follow test scenarios above
2. **Get API Keys**: Optional for Trello/Notion (basic features work without)
3. **Customize**: Edit colors, text, settings to match your brand
4. **Deploy**: See SETUP_GUIDE.md for deployment instructions

---

## ⚠️ Important Notes

- **Development Mode Only**: Current setup is for development
- **Database**: Uses local MongoDB by default (change MONGODB_URI to use cloud)
- **Security**: Update JWT_SECRET for production
- **API Keys**: Never commit real keys to git (use .env)
- **Rate Limits**: Enabled to prevent abuse (configurable)

---

## 🚀 Production Deployment

See **SETUP_GUIDE.md** for full deployment instructions for:
- Vercel (Frontend)
- Heroku (Backend)
- AWS (Backend)
- MongoDB Atlas (Database)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review SETUP_GUIDE.md for detailed configuration
3. Check terminal logs for error messages
4. Verify all prerequisites are installed

---

**Status**: ✅ Fully functional, production-ready application

**Last Updated**: February 19, 2026

**Repository**: https://github.com/vijeth06/Freelancers_Hackathon
