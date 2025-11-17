# 🚀 QuickMeet - Get It Running NOW!

## ⚡ Fastest Way to Get Started

### Step 1: Install Node.js (REQUIRED)
- **Download:** https://nodejs.org/
- **Install** the LTS version
- **Restart** your computer after installation

### Step 2: Run the Setup Checker
Double-click: **`CHECK_SETUP.bat`**

This will tell you what's missing.

### Step 3: Install Everything
Double-click: **`START_APP.bat`**

This will:
- ✅ Check if Node.js is installed
- ✅ Install all dependencies automatically
- ✅ Create the .env file if missing
- ✅ Start the app

### Step 4: Open Browser
Go to: **http://localhost:3000**

---

## 📋 Manual Setup (If Scripts Don't Work)

### 1. Install Node.js
Download from: https://nodejs.org/

### 2. Open PowerShell in QuickMeet Folder
Right-click in the folder → "Open PowerShell here"

### 3. Install Dependencies
```powershell
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

### 4. Create server/.env File
Create a file named `.env` in the `server` folder:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmeet
JWT_SECRET=quickmeet-secret-key-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 5. Install MongoDB
**Option A:** Local MongoDB
- Download: https://www.mongodb.com/try/download/community
- Install and start the service

**Option B:** MongoDB Atlas (Cloud - FREE)
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Replace `MONGODB_URI` in `server/.env`

### 6. Start the App
```powershell
npm run dev
```

### 7. Open Browser
Go to: **http://localhost:3000**

---

## ❌ Troubleshooting

### "node is not recognized"
- Node.js not installed
- **Fix:** Install Node.js and restart terminal

### "Cannot find module"
- Dependencies not installed
- **Fix:** Run `npm install` in root, server, and client folders

### "MongoDB connection error"
- MongoDB not running
- **Fix:** Start MongoDB or use MongoDB Atlas

### Blank page in browser
1. Press **F12** (Developer Tools)
2. Check **Console** tab for errors
3. Make sure backend is running (port 5000)
4. Make sure frontend is running (port 3000)

### Port already in use
- Close other apps using ports 3000/5000
- Or change PORT in `server/.env`

---

## ✅ Success Checklist

- [ ] Node.js installed and verified
- [ ] All dependencies installed
- [ ] `server/.env` file exists
- [ ] MongoDB running (local or Atlas)
- [ ] Both servers running (`npm run dev`)
- [ ] Browser opened to http://localhost:3000
- [ ] No errors in browser console (F12)

---

## 🎯 What You Should See

1. **First Visit:** Login/Register page
2. **After Registration:** Profile setup
3. **After Setup:** Discovery page with user cards
4. **Navigation:** Discover, Matches, Settings

---

## 📞 Still Not Working?

1. Run `CHECK_SETUP.bat` to see what's wrong
2. Check browser console (F12) for errors
3. Check terminal for error messages
4. Make sure both servers are running

**The app needs both backend AND frontend running!**

