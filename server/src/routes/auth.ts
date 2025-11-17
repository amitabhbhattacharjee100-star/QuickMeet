import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('age').isInt({ min: 18 }),
  body('gender').isIn(['man', 'woman', 'non-binary', 'custom', 'prefer-not-to-say']),
  body('interestedIn').isArray(),
  body('country').trim().notEmpty(),
  body('preferredCountries').isArray()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, age, gender, interestedIn, country, preferredCountries, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      name,
      age,
      gender,
      interestedIn,
      country,
      preferredCountries,
      bio
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        interestedIn: user.interestedIn,
        country: user.country,
        preferredCountries: user.preferredCountries,
        bio: user.bio
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        gender: user.gender,
        interestedIn: user.interestedIn,
        country: user.country,
        preferredCountries: user.preferredCountries,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

