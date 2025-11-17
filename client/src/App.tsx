import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile-setup"
                element={
                  <PrivateRoute>
                    <ProfileSetup />
                  </PrivateRoute>
                }
              />
              <Route
                path="/discover"
                element={
                  <PrivateRoute>
                    <Discover />
                  </PrivateRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <PrivateRoute>
                    <Matches />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:userId"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/discover" replace />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

