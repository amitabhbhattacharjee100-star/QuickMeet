import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  interestedIn: string[];
  country: string;
  preferredCountries: string[];
  bio?: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  gender: {
    type: String,
    required: true,
    enum: ['man', 'woman', 'non-binary', 'custom', 'prefer-not-to-say']
  },
  interestedIn: {
    type: [String],
    required: true,
    enum: ['man', 'woman', 'non-binary', 'everyone']
  },
  country: {
    type: String,
    required: true
  },
  preferredCountries: {
    type: [String],
    required: true,
    default: []
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profilePicture: {
    type: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

