# 👥 Team Setup Guide - MeetingAI Project

**Follow this guide exactly step-by-step to get the project running without errors.**

---

## 📋 Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (need v18+)
node --version
# Expected: v18.0.0 or higher

# Check npm version (need v9+)
npm --version
# Expected: 9.0.0 or higher

# Check Git
git --version
# Expected: git version 2.x.x or higher
```

❌ **Missing something?**
- Install Node.js from https://nodejs.org/ (download LTS version)
- npm comes with Node.js

---

## 🚀 Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/vijeth06/Freelancers_Hackathon.git

# Enter the directory
cd Freelancers_Hackathon
```

**Expected output:**
```
Cloning into 'Freelancers_Hackathon'...
...receiving objects... done.
```

---

## 🔧 Step 2: Backend Setup (DO THIS FIRST)

### 2.1: Navigate to Backend

```bash
cd backend
```

### 2.2: Install Dependencies

```bash
npm install
```

**Wait for completion** - This may take 1-2 minutes.

**Expected output:**
```
added 150+ packages in X.XXs
```

❌ **If you get error about missing packages:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2.3: Create .env File

```bash
# Copy the example file
cp .env.example .env
```

**On Windows if `cp` doesn't work:**
```powershell
Copy-Item .env.example .env
```

### 2.4: Edit .env File with Your Values

Open `backend/.env` and fill in these values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database - Choose ONE option:

# Option A: Local MongoDB (if you have MongoDB running locally)
MONGODB_URI=mongodb://localhost:27017/meeting-ai

# Option B: MongoDB Atlas Cloud (recommended, easiest)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create a cluster
# 4. Get connection string
# 5. Paste it here (replace username and password):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meeting-ai

# JWT Secrets (use any random string, min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-that-is-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-that-is-minimum-32-characters

# AI Provider - Claude API (get from https://console.anthropic.com)
CLAUDE_API_KEY=sk-ant-your-real-claude-api-key-here

# Optional: OpenAI Fallback (get from https://platform.openai.com)
OPENAI_API_KEY=sk-your-openai-key-here

# Optional: Trello Integration
TRELLO_API_KEY=your-trello-api-key
TRELLO_API_TOKEN=your-trello-token

# Optional: Notion Integration
NOTION_API_KEY=your-notion-api-key

# Logging
LOG_LEVEL=info
```

❓ **Don't have API keys?**
- Claude API: Free tier available at https://console.anthropic.com
- App works in "offline mode" if no API keys (uses regex parser)

### 2.5: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
✅ Server running on http://localhost:5000
✅ MongoDB connected successfully
✅ Claude API client initialized
✅ Server ready for connections
```

**Keep this terminal open!** ← Important

❌ **If you get "Port 5000 already in use":**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

❌ **If you get MongoDB connection error:**
- Option 1: Start MongoDB locally: `mongod`
- Option 2: Use MongoDB Atlas (cloud) - update MONGODB_URI in .env

---

## 🎨 Step 3: Frontend Setup (In NEW Terminal)

### 3.1: Open New Terminal Window

**Do NOT close the backend terminal!** Open a completely new terminal/PowerShell window.

### 3.2: Navigate to Frontend

```bash
cd Freelancers_Hackathon/frontend
```

### 3.3: Install Dependencies

```bash
npm install
```

**Wait for completion** - This takes 1-2 minutes.

**Expected output:**
```
added 200+ packages in X.XXs
```

### 3.4: Create .env File

```bash
# Copy the example
cp .env.example .env
```

**On Windows if `cp` doesn't work:**
```powershell
Copy-Item .env.example .env
```

### 3.5: Edit frontend/.env

Open `frontend/.env` and set:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**That's it!** Frontend is ready.

### 3.6: Start Frontend Server

```bash
npm start
```

**Expected output:**
```
✅ Compiled successfully!
✅ You can now view frontend in the browser.

  Local:            http://localhost:3001
  
On Your Network: http://192.168.x.x:3001
```

The browser should automatically open at `http://localhost:3001`

---

## ✅ Step 4: Verify Everything Works

### 4.1: Check Both Servers Running

You should have:

**Terminal 1 (Backend):**
```
✅ Server running on http://localhost:5000
✅ MongoDB connected
```

**Terminal 2 (Frontend):**
```
✅ Compiled successfully!
✅ Local: http://localhost:3001
```

### 4.2: Test in Browser

Open http://localhost:3001

**Expected:** You see a beautiful landing page with "Get Started" button

### 4.3: Test Registration

1. Click "Get Started"
2. Register with test account:
   - Email: test@example.com
   - Password: TestPass123!
3. Should successfully create account

### 4.4: Test Meeting Creation

1. Click "New Meeting"
2. Fill in:
   - Title: "Test Meeting"
   - Type: "Standup"
   - Date: Today
   - Participants: "Alice, Bob"
3. Paste this test transcript:

```
Alice: We need to finish the API by Friday
Bob: I can handle the database migration
Alice: Great, Bob you're on database by Thursday
Bob: Also need to update documentation
```

4. Click "Create Meeting"
5. Should see AI-generated summary and action items!

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'express'"

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Port 5000 already in use"

**Windows:**
```powershell
netstat -ano | Select-String "5000"
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### ❌ "MongoDB connection failed"

**Check if running locally:**
```bash
# Windows: Start MongoDB from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Or use MongoDB Atlas (cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Paste in MONGODB_URI

### ❌ ".env file not found"

**Solution:**
```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../frontend
cp .env.example .env
```

### ❌ "React app won't compile"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### ❌ "CORS error in browser console"

**Check frontend/.env has:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### ❌ "Claude API not responding"

The app has automatic fallback:
- Primary: Claude API
- Secondary: OpenAI GPT-4
- Fallback: Regex-based parser (works offline)

If no API keys, analysis uses regex parser.

---

## 📊 Verify Setup Script

Run this to check your setup:

```bash
cd backend
node scripts/verify-setup.js
```

**Expected output:**
```
🔍 MeetingAI Setup Verification

✓ Node.js: v18.x.x
✓ .env file exists
  - MONGODB_URI: ✓
  - JWT_SECRET: ✓
  - CLAUDE_API_KEY: ✓
✓ node_modules exists
✓ Required packages:
  ✓ express
  ✓ mongoose
  ✓ cors
  ✓ dotenv

✅ Setup verification complete!
```

---

## 📱 URLs & Access

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3001 | React app (user interface) |
| Backend API | http://localhost:5000 | Node.js API server |
| MongoDB | mongodb://localhost:27017 | Database (if local) |
| Health Check | http://localhost:5000/api/public/health | API status |

---

## 🔑 Test Credentials

After registration, use these to login:
- **Email:** test@example.com
- **Password:** TestPass123!

---

## 💾 Daily Development Workflow

### Morning (Start Development)

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm start
```

### During Development
- Frontend auto-reloads on file changes
- Backend may need restart for some changes
- Check browser console for errors
- Check terminal logs for backend errors

### Before Committing
```bash
cd backend && npm test    # Run tests
git add -A
git commit -m "feat: your feature"
git push origin main
```

---

## 📞 Issues & Debugging

**If something goes wrong:**

1. **Read the error message carefully** - it usually tells you the problem
2. **Check the terminal where server is running** - errors show there
3. **Try the troubleshooting section above**
4. **Delete node_modules and retry:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev  # or npm start
   ```
5. **Share the exact error with the team** - Include:
   - Your OS (Windows/Mac/Linux)
   - Full error message (copy from terminal)
   - What step you're on

---

## ✅ Success Checklist

Before you start developing, verify:

- [ ] Node.js v18+ installed
- [ ] MongoDB running (local or Atlas)
- [ ] backend/.env created with all values filled
- [ ] frontend/.env created with API_URL
- [ ] `npm install` completed in both folders
- [ ] Backend running on port 5000 without errors
- [ ] Frontend running on port 3001 without errors
- [ ] Can see landing page at localhost:3001
- [ ] Can register new account
- [ ] Can create a test meeting
- [ ] Can see AI-generated summary and action items

---

## 🎯 Next Steps

1. **Explore the code** - Read the codebase
2. **Make a simple change** - Update a page/component
3. **Test your changes** - Verify it works
4. **Commit and push** - Push to GitHub

## 🚀 You're Ready!

If you completed all steps above without errors, **you're ready to start developing!!!**

Happy coding! 💻

---

## 🆘 Still Having Issues?

Share the following in the team chat:
1. Your OS (Windows 10/11, Mac, Linux)
2. Node version: `node --version`
3. Exact error message (copy from terminal)
4. What step failed (1-4)

Team will help you debug! 🤝
