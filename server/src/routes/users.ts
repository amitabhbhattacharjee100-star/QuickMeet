import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/me', authenticate, [
  body('name').optional().trim().notEmpty(),
  body('age').optional().isInt({ min: 18 }),
  body('gender').optional().isIn(['man', 'woman', 'non-binary', 'custom', 'prefer-not-to-say']),
  body('interestedIn').optional().isArray(),
  body('country').optional().trim().notEmpty(),
  body('preferredCountries').optional().isArray(),
  body('bio').optional().isLength({ max: 500 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

