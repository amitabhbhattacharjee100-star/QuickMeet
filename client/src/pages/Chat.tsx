import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import VideoCall from '../components/VideoCall';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

const Chat: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchMessages();
    
    if (socket) {
      socket.on('receive_message', (message: Message) => {
        if (message.senderId._id === userId) {
          setMessages(prev => [...prev, message]);
          markAsRead();
        }
      });

      socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
        if (data.userId === userId) {
          setIsTyping(data.isTyping);
        }
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [socket, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${userId}`);
      setMessages(response.data);
      markAsRead();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put(`${API_URL}/messages/read/${userId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !socket || !userId) return;

    socket.emit('send_message', {
      receiverId: userId,
      content: newMessage,
      messageType: 'text'
    });

    setNewMessage('');
    stopTyping();
  };

  const handleTyping = () => {
    if (!socket || !userId) return;

    socket.emit('typing', {
      receiverId: userId,
      isTyping: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!socket || !userId) return;
    socket.emit('typing', {
      receiverId: userId,
      isTyping: false
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {showVideoCall && userId && (
        <VideoCall
          receiverId={userId}
          onClose={() => setShowVideoCall(false)}
        />
      )}

      <div className="chat-header">
        <button onClick={() => navigate('/matches')} className="btn-back">← Back</button>
        <h2>Chat</h2>
        <button onClick={() => setShowVideoCall(true)} className="btn-video">📹</button>
      </div>

      <div className="messages-container">
        {messages.map((message) => {
          const isOwn = message.senderId._id === user?.id;
          return (
            <div key={message._id} className={`message ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && (
                <div className="message-avatar">
                  {message.senderId.profilePicture ? (
                    <img src={message.senderId.profilePicture} alt={message.senderId.name} />
                  ) : (
                    <div className="avatar-small">
                      {message.senderId.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="message other">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="btn-send" disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

