# 🚀 How to Make QuickMeet Go Live

## ⚠️ CRITICAL: Node.js Must Be Installed First!

Your system doesn't have Node.js installed. **You MUST install it before the app can run.**

## Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click "Download" (LTS version recommended)
   - Run the installer

2. **Verify Installation:**
   - Close and reopen your terminal/PowerShell
   - Run: `node --version`
   - Run: `npm --version`
   - Both should show version numbers

## Step 2: Install Dependencies

Open PowerShell/Command Prompt in the QuickMeet folder and run:

```powershell
# Install root dependencies
npm install

# Install server dependencies  
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

## Step 3: Create Environment File

Create a file named `.env` in the `server` folder:

**File path:** `server/.env`

**File content:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmeet
JWT_SECRET=quickmeet-secret-key-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Step 4: Install MongoDB (Choose One)

### Option A: Local MongoDB
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service (usually starts automatically)

### Option B: MongoDB Atlas (Cloud - Easier!)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Replace `MONGODB_URI` in `server/.env` with your Atlas connection string

## Step 5: Start the Application

From the QuickMeet root folder, run:

```powershell
npm run dev
```

This will start:
- ✅ Backend server on: http://localhost:5000
- ✅ Frontend app on: http://localhost:3000

## Step 6: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

## 🎯 Quick Checklist

- [ ] Node.js installed and verified
- [ ] All dependencies installed (`npm install` in root, server, and client)
- [ ] `server/.env` file created with correct values
- [ ] MongoDB running (local or Atlas)
- [ ] Both servers running (`npm run dev`)
- [ ] Browser opened to http://localhost:3000

## ❌ Common Errors & Fixes

### "node is not recognized"
- Node.js not installed or not in PATH
- **Fix:** Install Node.js and restart terminal

### "Cannot find module"
- Dependencies not installed
- **Fix:** Run `npm install` in root, server, and client folders

### "MongoDB connection error"
- MongoDB not running or wrong connection string
- **Fix:** Start MongoDB or check MONGODB_URI in .env

### "Port 3000/5000 already in use"
- Another app is using the port
- **Fix:** Close other apps or change PORT in server/.env

### Blank page or errors in browser
1. Press F12 to open Developer Tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Make sure backend is running on port 5000

## 🆘 Still Not Working?

1. **Check if servers are running:**
   - You should see two terminals/windows running
   - One for backend (port 5000)
   - One for frontend (port 3000)

2. **Check browser console:**
   - Press F12
   - Look for red error messages
   - Share the errors for help

3. **Verify files exist:**
   - `server/.env` file exists
   - `node_modules` folders exist in root, server, and client

## 📞 Need More Help?

Share:
- Any error messages you see
- Screenshot of browser console (F12)
- Output from terminal when running `npm run dev`

