# QuickMeet Setup Guide

## Quick Start

### 1. Install Dependencies

Run this command from the root directory:
```bash
npm run install-all
```

This will install dependencies for:
- Root package (concurrently for running both servers)
- Server (backend)
- Client (frontend)

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB on your system
- Start MongoDB service
- Default connection: `mongodb://localhost:27017/quickmeet`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Use the connection string in your `.env` file

### 3. Configure Environment Variables

Create a file `server/.env` with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickmeet
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 4. Start the Application

From the root directory, run:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Development Workflow

### Running Backend Only
```bash
cd server
npm run dev
```

### Running Frontend Only
```bash
cd client
npm start
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm run build
```

## Project Structure

```
QuickMeet/
├── server/              # Backend (Node.js/Express)
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth middleware
│   │   └── socket.ts    # Socket.io setup
│   └── package.json
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Page components
│   │   └── App.tsx
│   └── package.json
└── package.json         # Root package.json
```

## Features Overview

### ✅ Implemented Features

1. **User Authentication**
   - Registration with profile setup
   - Login/Logout
   - JWT-based session management

2. **Profile Management**
   - Gender selection (inclusive options)
   - Interest preferences
   - Country selection
   - Bio and personal information

3. **Discovery & Matching**
   - Swipe-based discovery
   - Skip functionality
   - Like/Match system
   - Filtering by gender and country

4. **Real-time Messaging**
   - Instant messaging
   - Typing indicators
   - Read receipts
   - Message history

5. **Video Calling**
   - WebRTC video calls
   - Audio/Video controls
   - Mute/Unmute
   - Camera on/off

6. **Settings**
   - Profile updates
   - Preference changes
   - Logout functionality

7. **AdMob Integration Structure**
   - Skip action triggers ad display
   - Ready for AdMob SDK integration

## Testing the Application

### 1. Create Test Users

1. Register a new account at `/register`
2. Complete profile setup
3. Open a new incognito window
4. Register another account with different preferences
5. Test matching and messaging between accounts

### 2. Test Features

- **Discovery**: Navigate to `/discover` and swipe through profiles
- **Matching**: Like profiles to create matches
- **Messaging**: Go to `/matches` and start a conversation
- **Video Call**: Click the video icon in chat to start a call
- **Settings**: Update your profile at `/settings`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network/firewall settings

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `CLIENT_URL` if backend port changes

### Socket.io Connection Issues
- Ensure backend is running before frontend
- Check CORS settings in `server/src/index.ts`
- Verify `CLIENT_URL` matches frontend URL

### Video Call Not Working
- Ensure HTTPS in production (WebRTC requirement)
- Check browser permissions for camera/microphone
- Verify STUN server configuration

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set proper `CLIENT_URL`

### Security Checklist
- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable input validation
- [ ] Set up error logging
- [ ] Configure secure headers

### AdMob Setup (Optional)
1. Create AdMob account
2. Register your app
3. Get Ad Unit IDs
4. Install AdMob SDK
5. Update skip handler in `Discover.tsx`

## Support

For issues or questions:
1. Check the README.md
2. Review error logs
3. Verify environment configuration
4. Check MongoDB connection

## Next Steps

- [ ] Add image upload functionality
- [ ] Implement push notifications
- [ ] Add advanced matching algorithm
- [ ] Set up analytics
- [ ] Configure production hosting
- [ ] Integrate AdMob SDK
- [ ] Add unit tests
- [ ] Set up CI/CD pipeline

