import mongoose, { Document, Schema } from 'mongoose';

export interface ISkip extends Document {
  userId: mongoose.Types.ObjectId;
  skippedUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SkipSchema = new Schema<ISkip>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skippedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique skip records
SkipSchema.index({ userId: 1, skippedUserId: 1 }, { unique: true });

export default mongoose.model<ISkip>('Skip', SkipSchema);

