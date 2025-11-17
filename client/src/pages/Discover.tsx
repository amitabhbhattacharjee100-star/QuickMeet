import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Discover.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  age: number;
  country: string;
  bio?: string;
  profilePicture?: string;
  gender: string;
}

const Discover: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/discover`);
      setUsers(response.data);
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= users.length) return;
    
    const currentUser = users[currentIndex];
    try {
      const response = await axios.post(`${API_URL}/matches/like/${currentUser._id}`);
      if (response.data.match) {
        alert('It\'s a match! 🎉');
      }
      nextUser();
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handleSkip = async () => {
    if (currentIndex >= users.length) return;
    
    const currentUser = users[currentIndex];
    try {
      const response = await axios.post(`${API_URL}/matches/skip/${currentUser._id}`);
      
      // Show ad on skip (AdMob integration point)
      if (response.data.showAd) {
        setShowAd(true);
        // In production, trigger AdMob interstitial ad here
        setTimeout(() => {
          setShowAd(false);
          nextUser();
        }, 3000); // Simulate ad display
      } else {
        nextUser();
      }
    } catch (error) {
      console.error('Error skipping user:', error);
      nextUser();
    }
  };

  const nextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
    } else {
      // No more users, fetch more
      fetchUsers();
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'left') {
        handleSkip();
      } else {
        handleLike();
      }
    }, 300);
  };

  if (loading) {
    return <div className="discover-container">Loading...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="discover-container">
        <div className="no-users">
          <h2>No more users to discover</h2>
          <p>Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1>QuickMeet</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/matches')} className="btn-icon">💬</button>
          <button onClick={() => navigate('/settings')} className="btn-icon">⚙️</button>
        </div>
      </div>

      {showAd && (
        <div className="ad-overlay">
          <div className="ad-placeholder">
            <p>AdMob Ad Here</p>
            <p style={{ fontSize: '12px', color: '#666' }}>In production, this would show an interstitial ad</p>
          </div>
        </div>
      )}

      <div className="card-stack">
        <div
          className={`user-card ${swipeDirection === 'left' ? 'swipe-left' : ''} ${swipeDirection === 'right' ? 'swipe-right' : ''}`}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;

            const handleTouchMove = (e: TouchEvent) => {
              const touch = e.touches[0];
              const deltaX = touch.clientX - startX;
              const deltaY = touch.clientY - startY;

              if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                  setSwipeDirection('right');
                } else {
                  setSwipeDirection('left');
                }
              }
            };

            const handleTouchEnd = () => {
              if (swipeDirection) {
                handleSwipe(swipeDirection);
              }
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          <div className="user-image-placeholder">
            {currentUser.profilePicture ? (
              <img src={currentUser.profilePicture} alt={currentUser.name} />
            ) : (
              <div className="avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="user-info">
            <h2>{currentUser.name}, {currentUser.age}</h2>
            <p className="user-location">📍 {currentUser.country}</p>
            {currentUser.bio && <p className="user-bio">{currentUser.bio}</p>}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleSkip} className="btn-action btn-skip">
          ✕
        </button>
        <button onClick={handleLike} className="btn-action btn-like">
          ♥
        </button>
      </div>
    </div>
  );
};

export default Discover;

