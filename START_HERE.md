# QuickMeet - Getting Started

## ⚠️ Important: You need to install dependencies first!

The app won't work until you install all the required packages.

## Step-by-Step Setup

### 1. Check if Node.js is installed
Open PowerShell or Command Prompt and run:
```bash
node --version
npm --version
```

If these commands don't work, you need to install Node.js first:
- Download from: https://nodejs.org/
- Install the LTS version

### 2. Install Dependencies

**Option A: Install everything at once (Recommended)**
```bash
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

**Option B: Use the install script**
```bash
npm run install-all
```

### 3. Set Up Environment Variables

Create a file named `.env` in the `server` folder with this content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmeet
JWT_SECRET=quickmeet-secret-key-change-in-production-2024
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Note:** If you don't have MongoDB installed locally, you can:
- Install MongoDB: https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas

### 4. Start MongoDB (if using local MongoDB)

**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB`

**Mac/Linux:**
```bash
mongod
```

### 5. Run the Application

From the root directory, run:
```bash
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend app on: http://localhost:3000

### 6. Open the App

Open your browser and go to:
```
http://localhost:3000
```

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Cannot find module" errors
- Dependencies are not installed
- Run: `npm install` in the root, server, and client folders

### "MongoDB connection error"
- MongoDB is not running
- Check your MONGODB_URI in server/.env
- Make sure MongoDB service is started

### "Port already in use"
- Another application is using port 3000 or 5000
- Change the PORT in server/.env
- Kill the process using the port

### App shows blank page or errors
1. Open browser Developer Tools (F12)
2. Check the Console tab for errors
3. Check the Network tab for failed requests
4. Make sure both backend and frontend are running

## What You Should See

1. **First Visit**: Login/Register page
2. **After Registration**: Profile setup page
3. **After Setup**: Discovery page with user cards
4. **Navigation**: 
   - Discover (swipe through profiles)
   - Matches (view your matches)
   - Settings (update profile)

## Quick Test

1. Register a new account
2. Complete profile setup
3. You should see the discovery page
4. If no users appear, register another account in an incognito window to test matching

## Need Help?

- Check the browser console (F12) for errors
- Check server terminal for backend errors
- Verify MongoDB is running
- Ensure all dependencies are installed

