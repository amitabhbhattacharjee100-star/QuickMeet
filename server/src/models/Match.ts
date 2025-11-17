import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  user1Liked: boolean;
  user2Liked: boolean;
  isMatched: boolean;
  matchedAt?: Date;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  user1Id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2Id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user1Liked: {
    type: Boolean,
    default: false
  },
  user2Liked: {
    type: Boolean,
    default: false
  },
  isMatched: {
    type: Boolean,
    default: false
  },
  matchedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure unique match records
MatchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

export default mongoose.model<IMatch>('Match', MatchSchema);

