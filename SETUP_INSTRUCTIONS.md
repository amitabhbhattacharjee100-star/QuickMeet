# 🚀 QuickMeet - Setup Instructions to Get Your Website Live

## ⚠️ CRITICAL: You Must Install Node.js First!

Your website cannot run without Node.js. Follow these steps:

---

## Step 1: Install Node.js (REQUIRED)

1. **Download Node.js:**
   - Go to: **https://nodejs.org/**
   - Click the big green "Download" button (LTS version recommended)
   - The file will be something like `node-v20.x.x-x64.msi`

2. **Install Node.js:**
   - Run the downloaded installer
   - Click "Next" through all the prompts (default settings are fine)
   - Make sure "Add to PATH" is checked (it should be by default)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation:**
   - **Close and reopen** your PowerShell/Command Prompt window
   - Run these commands:
     ```powershell
     node --version
     npm --version
     ```
   - Both should show version numbers (like `v20.x.x` and `10.x.x`)
   - If you see "not recognized", restart your computer and try again

---

## Step 2: Install Dependencies

Once Node.js is installed, open PowerShell in the QuickMeet folder and run:

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

**OR** use the automated script:
```powershell
npm run install-all
```

This will take a few minutes. Wait for it to complete.

---

## Step 3: Set Up MongoDB (Database)

You need a database for the app to work. Choose one option:

### Option A: MongoDB Atlas (Cloud - EASIEST & FREE)

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click "Try Free" or "Sign Up"
3. Create a free account
4. Create a free cluster (choose the free tier)
5. Create a database user (remember the username and password)
6. Add your IP address (or use `0.0.0.0/0` for all IPs)
7. Click "Connect" → "Connect your application"
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
9. Replace `username` and `password` with your actual credentials
10. Open `server/.env` and replace the `MONGODB_URI` line with your connection string

### Option B: Local MongoDB

1. Download MongoDB: **https://www.mongodb.com/try/download/community**
2. Install MongoDB
3. MongoDB should start automatically as a service
4. The `.env` file is already configured for local MongoDB

---

## Step 4: Start the Application

From the QuickMeet root folder, run:

```powershell
npm run dev
```

You should see:
- ✅ Backend server starting on port 5000
- ✅ Frontend app starting on port 3000
- ✅ MongoDB connected

**Keep this window open!** The servers need to keep running.

---

## Step 5: Open Your Website

Open your web browser and go to:

```
http://localhost:3000
```

You should see the QuickMeet login/register page!

---

## ✅ Quick Checklist

Before running `npm run dev`, make sure:

- [ ] Node.js is installed (`node --version` works)
- [ ] Dependencies are installed (you see `node_modules` folders)
- [ ] `server/.env` file exists (✅ Already created for you!)
- [ ] MongoDB is set up (Atlas or local)
- [ ] No other apps are using ports 3000 or 5000

---

## ❌ Troubleshooting

### "node is not recognized"
- **Fix:** Node.js is not installed or not in PATH
- Install Node.js and **restart your terminal/computer**

### "Cannot find module" errors
- **Fix:** Dependencies not installed
- Run `npm install` in root, server, and client folders

### "MongoDB connection error"
- **Fix:** MongoDB not running or wrong connection string
- Check `MONGODB_URI` in `server/.env`
- Make sure MongoDB is running (local) or connection string is correct (Atlas)

### "Port 3000/5000 already in use"
- **Fix:** Another app is using the port
- Close other apps or change `PORT` in `server/.env`

### Blank page in browser
1. Press **F12** to open Developer Tools
2. Check **Console** tab for red errors
3. Check **Network** tab for failed requests
4. Make sure backend is running (you should see it in the terminal)

### "npm is not recognized"
- **Fix:** Node.js not installed properly
- Reinstall Node.js and restart terminal

---

## 🎯 What Should Happen

When everything works:

1. You run `npm run dev`
2. Two servers start (backend on 5000, frontend on 3000)
3. You open `http://localhost:3000` in your browser
4. You see the QuickMeet login/register page
5. You can register, login, and use the app!

---

## 📞 Still Having Issues?

Share these details:
- Error messages from terminal
- Browser console errors (F12 → Console tab)
- Output of `node --version` and `npm --version`

---

## 🚀 Next Steps After Setup

1. Register a new account
2. Complete your profile
3. Start discovering and matching with people!

Good luck! 🎉

