import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Match from '../models/Match';

const router = express.Router();

// Get conversation with a user
router.get('/conversation/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const otherUserId = req.params.userId;

    // Verify they are matched
    const match = await Match.findOne({
      $or: [
        { user1Id: req.userId, user2Id: otherUserId },
        { user1Id: otherUserId, user2Id: req.userId }
      ],
      isMatched: true
    });

    if (!match) {
      return res.status(403).json({ message: 'Users are not matched' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.userId }
      ]
    }).sort({ createdAt: 1 }).populate('senderId', 'name profilePicture');

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all conversations
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1Id: req.userId },
        { user2Id: req.userId }
      ],
      isMatched: true
    });

    const conversationPromises = matches.map(async (match) => {
      const otherUserId = match.user1Id.toString() === req.userId 
        ? match.user2Id 
        : match.user1Id;

      const lastMessage = await Message.findOne({
        $or: [
          { senderId: req.userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.userId }
        ]
      }).sort({ createdAt: -1 }).populate('senderId', 'name').populate('receiverId', 'name');

      const unreadCount = await Message.countDocuments({
        senderId: otherUserId,
        receiverId: req.userId,
        isRead: false
      });

      return {
        userId: otherUserId,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId
        } : null,
        unreadCount
      };
    });

    const conversations = await Promise.all(conversationPromises);
    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/read/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

