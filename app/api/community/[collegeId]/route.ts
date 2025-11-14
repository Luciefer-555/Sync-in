import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { connectToDatabase } from '@/lib/mongodb';
import CollegeCommunity from '@/models/collegeCommunity';

export const runtime = 'nodejs';

const postSchema = z.object({
  authorProfileId: z.string().min(1, 'authorProfileId is required'),
  content: z.string().trim().min(1, 'Post content cannot be empty').max(2000, 'Post content is too long'),
});

const commentSchema = z.object({
  postId: z.string().uuid('postId must be a valid UUID'),
  authorProfileId: z.string().min(1, 'authorProfileId is required'),
  text: z.string().trim().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

function sanitizeCommunityResponse(community: any) {
  if (!community) {
    return { posts: [], members: [], collegeId: null, collegeName: null };
  }

  const posts = community.posts.map((post: any) => ({
    postId: post.postId,
    authorProfileId: post.authorProfileId,
    content: post.content,
    createdAt: post.createdAt,
    reactions: post.reactions,
    comments: post.comments.map((comment: any) => ({
      commentId: comment.commentId,
      authorProfileId: comment.authorProfileId,
      text: comment.text,
      createdAt: comment.createdAt,
    })),
  }));

  return {
    collegeId: community.collegeId,
    collegeName: community.collegeName,
    members: community.members,
    posts,
  };
}

export async function GET(
  _: Request,
  context: { params: Promise<{ collegeId: string }> }
) {
  try {
    const { collegeId } = await context.params;
    await connectToDatabase();

    const community = await CollegeCommunity.findOne({ collegeId }).lean();

    return NextResponse.json({ success: true, data: sanitizeCommunityResponse(community) });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch community data' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ collegeId: string }> }
) {
  try {
    const payload = await request.json();
    const parseResult = postSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: issue?.message ?? 'Invalid request body' }, { status: 400 });
    }

    const { authorProfileId, content } = parseResult.data;

    const { collegeId } = await context.params;
    await connectToDatabase();

    const community = await CollegeCommunity.findOneAndUpdate(
      { collegeId },
      {
        $setOnInsert: {
          collegeId,
          collegeName: payload.collegeName ?? 'Unknown College',
          members: [],
          posts: [],
        },
      },
      { new: true, upsert: true }
    );

    community.posts.unshift({
      postId: crypto.randomUUID(),
      authorProfileId,
      content,
      createdAt: new Date(),
      reactions: 0,
      comments: [],
    });

    await community.save();

    return NextResponse.json({ success: true, data: sanitizeCommunityResponse(community) });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
