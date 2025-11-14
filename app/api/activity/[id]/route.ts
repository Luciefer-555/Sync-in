import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

import { connectToDatabase } from '@/lib/mongodb';
import UserProgress from '@/models/userProgress';

const allowedOrigin = process.env.CORS_ORIGIN ?? '*';
const allowedHeaders = 'Content-Type, Authorization';
const allowedMethods = 'DELETE, OPTIONS';

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: activityId } = await context.params;
  const username = request.nextUrl.searchParams.get('username');

  if (!activityId) {
    return createErrorResponse('Activity ID is required.', 400);
  }

  if (!Types.ObjectId.isValid(activityId)) {
    return createErrorResponse('Invalid activity ID format.', 400);
  }

  if (!username) {
    return createErrorResponse('Query parameter "username" is required.', 400);
  }

  try {
    await connectToDatabase();

    const result = await UserProgress.findOneAndUpdate(
      { username, 'recentActivity._id': new Types.ObjectId(activityId) },
      { $pull: { recentActivity: { _id: new Types.ObjectId(activityId) } } },
      { new: true }
    ).lean();

    if (!result) {
      return createErrorResponse('Activity not found.', 404);
    }

    return createJsonResponse({ success: true, data: result, message: 'Activity deleted successfully.' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return createErrorResponse('Failed to delete activity.', 500);
  }
}
