import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message';
import User from './models/User';

interface SocketUser {
  userId: string;
  socketId: string;
}

const connectedUsers: Map<string, string> = new Map(); // userId -> socketId

export const setupSocketIO = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      (socket as any).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    connectedUsers.set(userId, socket.id);

    // Update user online status
    User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() }).exec();

    console.log(`User connected: ${userId}`);

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Handle sending messages
    socket.on('send_message', async (data: { receiverId: string; content: string; messageType?: string }) => {
      try {
        const message = new Message({
          senderId: userId,
          receiverId: data.receiverId,
          content: data.content,
          messageType: data.messageType || 'text'
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name profilePicture');

        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', populatedMessage);
        }

        // Confirm to sender
        socket.emit('message_sent', populatedMessage);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId,
          isTyping: data.isTyping
        });
      }
    });

    // Handle video call signaling
    socket.on('video_call_offer', (data: { receiverId: string; offer: any }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('video_call_offer', {
          callerId: userId,
          offer: data.offer
        });
      }
    });

    socket.on('video_call_answer', (data: { callerId: string; answer: any }) => {
      const callerSocketId = connectedUsers.get(data.callerId);
      if (callerSocketId) {
        io.to(callerSocketId).emit('video_call_answer', {
          answererId: userId,
          answer: data.answer
        });
      }
    });

    socket.on('video_call_ice_candidate', (data: { receiverId: string; candidate: any }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('video_call_ice_candidate', {
          senderId: userId,
          candidate: data.candidate
        });
      }
    });

    socket.on('video_call_end', (data: { receiverId: string }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('video_call_end', { userId });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      connectedUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      }).exec();
      console.log(`User disconnected: ${userId}`);
    });
  });
};

