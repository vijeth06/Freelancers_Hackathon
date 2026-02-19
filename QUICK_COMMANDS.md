# ⚡ Quick Commands Reference

Quick cheat sheet for common commands when developing MeetingAI.

---

## 🚀 First Time Setup (Copy & Paste)

```bash
# Clone repo
git clone https://github.com/vijeth06/Freelancers_Hackathon.git
cd Freelancers_Hackathon

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env
npm start
```

---

## 📅 Daily Development

### Start Both Servers (Morning)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (new terminal):**
```bash
cd frontend
npm start
```

---

## 🛠 Common Tasks

### Install New Package

**Backend:**
```bash
cd backend
npm install package-name
npm install --save-dev package-name  # dev dependency
```

**Frontend:**
```bash
cd frontend
npm install package-name
npm install --save-dev package-name  # dev dependency
```

### Update All Packages

```bash
cd backend
npm update

cd ../frontend
npm update
```

### Clear Cache & Reinstall

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🧪 Testing

### Run All Tests

```bash
cd backend
npm test
```

### Run Unit Tests

```bash
cd backend
npm run test:unit
```

### Run Integration Tests

```bash
cd backend
npm run test:integration
```

### Run with Coverage

```bash
cd backend
npm test -- --coverage
```

---

## 🔍 Debugging

### Check Setup

```bash
cd backend
node scripts/verify-setup.js
```

### View Logs

**Backend logs (live):**
```bash
# Already showing in terminal when running npm run dev
# Check backend terminal window
```

**Frontend logs:**
- Open browser DevTools: F12 or Right-click → Inspect
- Go to Console tab
- See all frontend errors

### Check Database

**If using local MongoDB:**
```bash
mongo
> use meeting-ai
> db.users.find()
> db.meetings.find()
```

**If using MongoDB Atlas:**
- Go to https://cloud.mongodb.com
- Connect via MongoDB Compass or Atlas UI

---

## 🌐 Port Issues

### Kill Process on Port 5000 (Backend)

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

### Kill Process on Port 3001 (Frontend)

**Windows:**
```powershell
netstat -ano | Select-String "3001"
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3001
kill -9 <PID>
```

### Use Different Port

**Backend (change in .env):**
```env
PORT=5001
```

**Frontend (change in package.json or terminal):**
```bash
PORT=3002 npm start
```

---

## 📝 Git Workflow

### Clone Latest

```bash
git clone https://github.com/vijeth06/Freelancers_Hackathon.git
cd Freelancers_Hackathon
```

### Update to Latest

```bash
git pull origin main
npm install  # in both backend and frontend
```

### Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# Make changes
git add -A
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### Sync with Main

```bash
git fetch origin
git rebase origin/main
# or
git merge origin/main
```

### See Changes

```bash
git status                    # What changed
git diff                      # What actually changed
git log --oneline -10         # Last 10 commits
```

---

## 🧹 Clean Up

### Remove All Node Modules (Full Reset)

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Clear MongoDB

```bash
mongo
> use meeting-ai
> db.dropDatabase()
```

**Or in MongoDB Atlas:**
- Go to Collections
- Select database
- Click Delete Database

---

## 📦 Environment Variables

### Create .env Files

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit with your values
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit with your values
```

### Required Backend Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meeting-ai
JWT_SECRET=min-32-characters-long-secret-string
CLAUDE_API_KEY=sk-ant-...
```

### Required Frontend Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 👀 Viewing Running Servers

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/public/health |
| API Docs | http://localhost:5000 (if integrated) |

---

## 🚨 Emergency Commands

### Kill Everything & Start Fresh

```bash
# Kill all node processes
taskkill /F /IM node.exe          # Windows
killall node                       # Mac
killall -9 node                    # Linux

# Go to project
cd backend

# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev

# In new terminal
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### Reset Everything

```bash
# Stop both servers (Ctrl+C in both terminals)

# Backend
cd backend
rm -rf node_modules package-lock.json
rm .env
cp .env.example .env

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
rm .env
cp .env.example .env

# Edit .env files with your config
# Then run:
cd ../backend && npm install && npm run dev
# In new terminal:
cd frontend && npm install && npm start
```

---

## 📊 Useful Queries

### Check Node Version

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

### View Package Info

```bash
npm list                  # See all installed packages
npm list react            # See specific package version
npm outdated              # See outdated packages
```

### View Scripts Available

```bash
cd backend
npm run              # Lists all available npm scripts
```

---

## 💡 Tips & Tricks

### Auto-reload on File Changes

**Backend:**
- Run with `npm run dev` (uses nodemon)
- Changes auto-reload

**Frontend:**
- Run with `npm start`
- Changes auto-reload

### Debug Backend

Add logs in backend code:
```javascript
console.log('Debug:', variable);
console.error('Error:', error);
```

See them in the terminal running `npm run dev`

### Debug Frontend

- F12 or Right-click → Inspect
- Console, Network, Application tabs
- React DevTools extension recommended

### Test API Endpoint

```bash
curl http://localhost:5000/api/public/health

# Or POST
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'
```

---

## 🎯 Most Used Commands

```bash
# Daily start
npm run dev                 # backend
npm start                   # frontend

# Fix issues
npm install
git pull origin main

# Commit code
git add -A
git commit -m "feat: message"
git push origin main

# Reset everything
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | `npm install` |
| Port in use | Kill process or use different port |
| MongoDB error | Check MONGODB_URI in .env |
| CORS error | Check REACT_APP_API_URL in frontend/.env |
| React won't compile | `rm -rf node_modules && npm install &&npm start` |
| API returns 404 | Backend might not be running on :5000 |
| Can't register | Check backend is running and .env is configured |

---

**Bookmark this page for quick reference!** 📌
