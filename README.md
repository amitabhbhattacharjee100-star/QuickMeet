# QuickMeet

QuickMeet is a modern social connection platform that allows users to discover, match, chat, and video call with people around the world based on their preferences.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Profile Setup**: Comprehensive profile creation with gender, interests, and location preferences
- **Discovery & Matching**: Swipe-based discovery system with intelligent filtering
- **Real-time Messaging**: Instant messaging with typing indicators and read receipts
- **Video Calling**: WebRTC-based video calls with audio/video controls
- **Settings Management**: Easy profile and preference updates

### Advanced Features
- **Gender & Country Filtering**: Match users based on gender preferences and country selection
- **Skip Functionality**: Swipe away profiles you're not interested in
- **AdMob Integration**: Revenue generation through interstitial ads on skip actions
- **Privacy & Security**: Encrypted communications and robust privacy policies

## Tech Stack

### Backend
- **Node.js** with **Express** and **TypeScript**
- **MongoDB** with **Mongoose** for data persistence
- **Socket.io** for real-time communication
- **JWT** for authentication
- **WebRTC** for video calling

### Frontend
- **React** with **TypeScript**
- **React Router** for navigation
- **Socket.io Client** for real-time features
- **Axios** for API communication
- Modern CSS with gradient designs

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   cd QuickMeet
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quickmeet
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend (port 3000)

## Project Structure

```
QuickMeet/
├── server/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── socket.ts        # Socket.io setup
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── pages/           # Page components
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Matches
- `GET /api/matches/discover` - Get potential matches
- `POST /api/matches/like/:userId` - Like a user
- `POST /api/matches/skip/:userId` - Skip a user
- `GET /api/matches/matches` - Get all matches

### Messages
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/read/:userId` - Mark messages as read

## Socket Events

### Client → Server
- `send_message` - Send a message
- `typing` - Typing indicator
- `video_call_offer` - Initiate video call
- `video_call_answer` - Answer video call
- `video_call_ice_candidate` - ICE candidate exchange
- `video_call_end` - End video call

### Server → Client
- `receive_message` - Receive new message
- `message_sent` - Message sent confirmation
- `user_typing` - User typing indicator
- `video_call_offer` - Incoming video call
- `video_call_answer` - Video call answered
- `video_call_ice_candidate` - ICE candidate
- `video_call_end` - Call ended

## AdMob Integration

The app is structured to support AdMob integration for monetization:

1. **Interstitial Ads**: Triggered when users skip profiles
2. **Ad Display Logic**: Implemented in the skip handler
3. **Production Setup**: 
   - Register app with Google AdMob
   - Add AdMob SDK to client
   - Configure ad units
   - Update skip handler to show actual ads

## Development

### Backend Development
```bash
cd server
npm run dev
```

### Frontend Development
```bash
cd client
npm start
```

## Production Deployment

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Build the backend:
   ```bash
   cd server
   npm run build
   ```

3. Set production environment variables

4. Deploy to your preferred hosting platform (Heroku, AWS, etc.)

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on all endpoints
- CORS configuration for API security
- WebRTC encryption for video calls

## Future Enhancements

- Push notifications
- Image upload and sharing
- Advanced matching algorithms
- Group video calls
- Premium subscription features
- Enhanced analytics

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

