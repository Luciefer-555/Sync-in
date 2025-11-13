import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/mongodb';
import UserProgress from '@/models/userProgress';

const allowedOrigin = process.env.CORS_ORIGIN ?? '*';
const allowedHeaders = 'Content-Type, Authorization';
const allowedMethods = 'GET, OPTIONS';

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', allowedMethods);
  response.headers.set('Access-Control-Allow-Headers', allowedHeaders);
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

function createJsonResponse<T>(data: T, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  return withCors(response);
}

function createErrorResponse(message: string, status = 400) {
  return createJsonResponse({ success: false, error: message }, { status });
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return withCors(response);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.max(1, Math.min(50, parseInt(limitParam, 10))) : 10;

  try {
    await connectToDatabase();

    const leaderboard = await UserProgress.aggregate([
      {
        $addFields: {
          totalPoints: { $sum: '$recentActivity.points' },
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          totalPoints: 1,
          problemsSolved: 1,
          streakDays: 1,
          hackathons: 1,
          collaborations: 1,
          recentActivity: 1,
        },
      },
      { $sort: { totalPoints: -1, problemsSolved: -1, streakDays: -1 } },
      { $limit: limit },
    ]);

    return createJsonResponse({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return createErrorResponse('Failed to fetch leaderboard.', 500);
  }
}
