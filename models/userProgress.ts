import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface Activity {
  _id?: Types.ObjectId;
  title: string;
  time: string;
  points: number;
}

export interface UserProgressDocument extends Document {
  username: string;
  problemsSolved: number;
  streakDays: number;
  hackathons: number;
  collaborations: number;
  recentActivity: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<Activity>(
  {
    title: { type: String, required: true, trim: true },
    time: { type: String, required: true },
    points: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const UserProgressSchema = new Schema<UserProgressDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    problemsSolved: { type: Number, default: 0, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    hackathons: { type: Number, default: 0, min: 0 },
    collaborations: { type: Number, default: 0, min: 0 },
    recentActivity: { type: [ActivitySchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const UserProgress: Model<UserProgressDocument> =
  mongoose.models.UserProgress ||
  mongoose.model<UserProgressDocument>('UserProgress', UserProgressSchema);

export default UserProgress;
