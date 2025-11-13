import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email('A valid college email is required'),
  profileId: z.string().trim().min(1, 'Profile ID is required'),
  collegeId: z.string().trim().min(1, 'College ID is required'),
  password: z.string().min(8, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parseResult = loginSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: issue?.message ?? 'Invalid credentials' }, { status: 400 });
    }

    const { email, profileId, collegeId, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    const isCollegeEmail = /@(.*\.)?(edu|ac)(\.\w+)?$/i.test(normalizedEmail);
    if (!isCollegeEmail) {
      return NextResponse.json(
        { success: false, error: 'Please sign in with your college email address.' },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail, profileId, collegeId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'We could not find a matching profile for those credentials.' },
        { status: 404 },
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Password authentication is not enabled for this account yet. Please reset your password.' },
        { status: 400 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again or reset your password.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        profileId: user.profileId,
        collegeId: user.collegeId,
        collegeName: user.collegeName,
        skills: user.skills ?? [],
        role: user.role,
        joinedAt: user.joinedAt,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during user login:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
