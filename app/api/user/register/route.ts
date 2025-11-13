import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user';
import CollegeCommunity from '@/models/collegeCommunity';

export const runtime = 'nodejs';

const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters long'),
  collegeId: z.string().trim().min(1, 'collegeId is required'),
  collegeName: z.string().trim().min(1, 'collegeName is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[+\d][\d\s-]{6,}$/i, 'Phone must be at least 7 characters and contain only digits, spaces, + or -'),
  skills: z.array(z.string().trim()).max(25).optional().default([]),
  role: z.enum(['student', 'mentor', 'admin']).optional().default('student'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long'),
});

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

function generateProfileId(): string {
  const letters = Array.from({ length: 3 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join('');
  const digits = Array.from({ length: 3 }, () => DIGITS[Math.floor(Math.random() * DIGITS.length)]).join('');
  return `syncin@${letters}${digits}`;
}

async function generateUniqueProfileId(): Promise<string> {
  let profileId = generateProfileId();
  let attempts = 0;

  while (attempts < 10) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await User.exists({ profileId });
    if (!exists) {
      return profileId;
    }
    profileId = generateProfileId();
    attempts += 1;
  }

  throw new Error('Failed to generate a unique profile ID. Please try again.');
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parseResult = registerSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: issue?.message ?? 'Invalid request body' }, { status: 400 });
    }

    const { username, collegeId, collegeName, email, phone, skills, role, password } = parseResult.data;

    const normalizedEmail = email.toLowerCase();
    const isCollegeEmail = /@(.*\.)?(edu|ac)(\.\w+)?$/i.test(normalizedEmail);
    if (!isCollegeEmail) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid college email address.' },
        { status: 400 },
      );
    }

    if (!process.env.MONGO_URI) {
      return NextResponse.json(
        { success: false, error: 'Database connection is not configured. Please set MONGO_URI in your environment.' },
        { status: 503 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with that email or phone already exists.' }, { status: 409 });
    }

    const profileId = await generateUniqueProfileId();

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      profileId,
      collegeId,
      collegeName,
      email: normalizedEmail,
      phone,
      skills,
      role,
      passwordHash,
    });

    await CollegeCommunity.findOneAndUpdate(
      { collegeId },
      {
        $setOnInsert: { collegeName, members: [], posts: [] },
        $addToSet: { members: profileId },
        $set: { collegeName },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        profileId: user.profileId,
        collegeId: user.collegeId,
        collegeName: user.collegeName,
        skills: user.skills,
        role: user.role,
        joinedAt: user.joinedAt,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
