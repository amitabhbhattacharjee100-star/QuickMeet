import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Matches.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Match {
  matchId: string;
  user: {
    _id: string;
    name: string;
    age: number;
    profilePicture?: string;
    country: string;
  };
  matchedAt: string;
}

const Matches: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/matches`);
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="matches-container">Loading...</div>;
  }

  return (
    <div className="matches-container">
      <div className="matches-header">
        <button onClick={() => navigate('/discover')} className="btn-back">← Back</button>
        <h1>Your Matches</h1>
      </div>

      {matches.length === 0 ? (
        <div className="no-matches">
          <p>No matches yet. Start swiping to find your match!</p>
          <button onClick={() => navigate('/discover')} className="btn btn-primary">
            Start Discovering
          </button>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className="match-card"
              onClick={() => navigate(`/chat/${match.user._id}`)}
            >
              <div className="match-avatar">
                {match.user.profilePicture ? (
                  <img src={match.user.profilePicture} alt={match.user.name} />
                ) : (
                  <div className="avatar-circle">
                    {match.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="match-info">
                <h3>{match.user.name}, {match.user.age}</h3>
                <p>📍 {match.user.country}</p>
                <span className="match-date">
                  Matched {new Date(match.matchedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="match-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;

