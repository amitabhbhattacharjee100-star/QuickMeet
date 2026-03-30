import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './VideoCall.css';

interface VideoCallProps {
  receiverId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ receiverId, onClose }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('video_call_offer', handleOffer);
    socket.on('video_call_answer', handleAnswer);
    socket.on('video_call_ice_candidate', handleIceCandidate);
    socket.on('video_call_end', handleCallEnd);

    return () => {
      socket.off('video_call_offer');
      socket.off('video_call_answer');
      socket.off('video_call_ice_candidate');
      socket.off('video_call_end');
    };
  }, [socket]);

  const initializeCall = async () => {
    try {
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('video_call_ice_candidate', {
            receiverId,
            candidate: event.candidate
          });
        }
      };

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus('connected');
        }
      };

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      if (socket) {
        socket.emit('video_call_offer', {
          receiverId,
          offer: peerConnection.localDescription
        });
      }
    } catch (error) {
      console.error('Error initializing call:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
      onClose();
    }
  };

  const handleOffer = async (data: { callerId: string; offer: RTCSessionDescriptionInit }) => {
    // This would be handled by the receiver
    // For now, we assume this component is the caller
  };

  const handleAnswer = async (data: { answererId: string; answer: RTCSessionDescriptionInit }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  const handleIceCandidate = async (data: { senderId: string; candidate: RTCIceCandidateInit }) => {
    if (peerConnectionRef.current && data.candidate) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleCallEnd = () => {
    setCallStatus('ended');
    endCall();
    onClose();
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (socket) {
      socket.emit('video_call_end', { receiverId });
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="video-call-overlay">
      <div className="video-call-container">
        <div className="video-call-header">
          <h3>Video Call</h3>
          <button onClick={() => { endCall(); onClose(); }} className="btn-close">✕</button>
        </div>

        <div className="video-call-content">
          <div className="local-video-container">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
            <div className="video-call-controls">
              <button
                onClick={toggleMute}
                className={`control-btn ${isMuted ? 'muted' : ''}`}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={toggleVideo}
                className={`control-btn ${isVideoOff ? 'video-off' : ''}`}
              >
                {isVideoOff ? '🚫' : '📹'}
              </button>
              <button
                onClick={() => { endCall(); onClose(); }}
                className="control-btn end-call"
              >
                📞
              </button>
            </div>
          </div>

          <div className="remote-video-container">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="remote-video"
            />
            {callStatus === 'connecting' && (
              <div className="call-status">Connecting...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

