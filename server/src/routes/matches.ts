import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Match from '../models/Match';
import Skip from '../models/Skip';

const router = express.Router();

// Get potential matches
router.get('/discover', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all skipped users
    const skippedUsers = await Skip.find({ userId: req.userId }).select('skippedUserId');
    const skippedUserIds = skippedUsers.map(skip => skip.skippedUserId);

    // Get all existing matches
    const existingMatches = await Match.find({
      $or: [
        { user1Id: req.userId },
        { user2Id: req.userId }
      ]
    });
    const matchedUserIds = existingMatches.map(match => 
      match.user1Id.toString() === req.userId ? match.user2Id : match.user1Id
    );

    // Build query for potential matches
    const query: any = {
      _id: { 
        $ne: req.userId,
        $nin: [...skippedUserIds, ...matchedUserIds]
      },
      gender: { $in: currentUser.interestedIn.length > 0 && currentUser.interestedIn.includes('everyone') 
        ? ['man', 'woman', 'non-binary', 'custom', 'prefer-not-to-say']
        : currentUser.interestedIn
      }
    };

    // Filter by preferred countries if specified
    if (currentUser.preferredCountries.length > 0) {
      query.country = { $in: currentUser.preferredCountries };
    }

    // Also check if current user matches others' preferences
    const potentialMatches = await User.find(query)
      .select('-password')
      .limit(20);

    // Filter to ensure mutual interest
    const filteredMatches = potentialMatches.filter(user => {
      return user.interestedIn.includes('everyone') || 
             user.interestedIn.includes(currentUser.gender) ||
             (user.interestedIn.length === 0);
    });

    res.json(filteredMatches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Like a user
router.post('/like/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.userId) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    // Check if match already exists
    let match = await Match.findOne({
      $or: [
        { user1Id: req.userId, user2Id: targetUserId },
        { user1Id: targetUserId, user2Id: req.userId }
      ]
    });

    if (!match) {
      // Create new match record
      match = new Match({
        user1Id: req.userId,
        user2Id: targetUserId,
        user1Liked: true
      });
    } else {
      // Update existing match
      if (match.user1Id.toString() === req.userId) {
        match.user1Liked = true;
      } else {
        match.user2Liked = true;
      }
    }

    // Check if it's a mutual match
    if (match.user1Liked && match.user2Liked && !match.isMatched) {
      match.isMatched = true;
      match.matchedAt = new Date();
    }

    await match.save();

    res.json({ 
      match: match.isMatched,
      message: match.isMatched ? 'It\'s a match!' : 'Like recorded'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Skip a user
router.post('/skip/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.userId) {
      return res.status(400).json({ message: 'Cannot skip yourself' });
    }

    // Record skip
    const skip = new Skip({
      userId: req.userId,
      skippedUserId: targetUserId
    });

    await skip.save();

    // Return ad trigger flag (for AdMob integration)
    res.json({ 
      skipped: true,
      showAd: true,
      message: 'User skipped'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.json({ skipped: true, showAd: false, message: 'Already skipped' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all matches
router.get('/matches', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1Id: req.userId },
        { user2Id: req.userId }
      ],
      isMatched: true
    }).populate('user1Id', 'name age profilePicture country').populate('user2Id', 'name age profilePicture country');

    const matchList = matches.map(match => {
      const otherUser = match.user1Id.toString() === req.userId 
        ? match.user2Id 
        : match.user1Id;
      return {
        matchId: match._id,
        user: otherUser,
        matchedAt: match.matchedAt
      };
    });

    res.json(matchList);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

