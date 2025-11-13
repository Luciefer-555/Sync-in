import mongoose, { Document, Model, Schema } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  profileId: string;
  collegeId: string;
  collegeName: string;
  email: string;
  phone: string;
  skills: string[];
  role: string;
  joinedAt: Date;
  passwordHash?: string;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  credentialRecoveryCode?: string | null;
  credentialRecoveryExpires?: Date | null;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, trim: true },
    profileId: { type: String, required: true, unique: true },
    collegeId: { type: String, required: true, index: true },
    collegeName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
    role: { type: String, default: 'student', enum: ['student', 'mentor', 'admin'] },
    joinedAt: { type: Date, default: Date.now },
    passwordHash: { type: String },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    credentialRecoveryCode: { type: String, default: null },
    credentialRecoveryExpires: { type: Date, default: null },
  },
  {
    timestamps: false,
  }
);

UserSchema.index({ collegeId: 1, profileId: 1 });

export const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;
