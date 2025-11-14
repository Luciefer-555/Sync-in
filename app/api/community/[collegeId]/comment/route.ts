import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { connectToDatabase } from '@/lib/mongodb';
import CollegeCommunity from '@/models/collegeCommunity';

export const runtime = 'nodejs';

const commentSchema = z.object({
  postId: z.string().min(1, 'postId is required'),
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

export async function POST(
  request: Request,
  context: { params: Promise<{ collegeId: string }> }
) {
  try {
    const payload = await request.json();
    const parseResult = commentSchema.safeParse(payload);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return NextResponse.json({ success: false, error: issue?.message ?? 'Invalid request body' }, { status: 400 });
    }

    const { postId, authorProfileId, text } = parseResult.data;

    const { collegeId } = await context.params;
    await connectToDatabase();

    const community = await CollegeCommunity.findOne({ collegeId });
    if (!community) {
      return NextResponse.json({ success: false, error: 'Community not found' }, { status: 404 });
    }

    const targetPost = community.posts.find(post => post.postId === postId);
    if (!targetPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    targetPost.comments.push({
      commentId: crypto.randomUUID(),
      authorProfileId,
      text,
      createdAt: new Date(),
    });

    await community.save();

    return NextResponse.json({ success: true, data: sanitizeCommunityResponse(community) });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 });
  }
}
