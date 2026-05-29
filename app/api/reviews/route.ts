import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

// Simple in-memory rate limiter for review submissions
const reviewLimiter = new Map<string, { count: number; resetAt: number }>();

function checkReviewLimit(ip: string): boolean {
  const now = Date.now();
  const entry = reviewLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    reviewLimiter.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }
  if (entry.count >= 3) return false; // max 3 reviews per hour per IP
  entry.count++;
  return true;
}

export async function GET() {
  try {
    const reviews = await db.review.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkReviewLimit(ip)) {
    return NextResponse.json({ error: 'Too many reviews submitted. Try again later.' }, { status: 429 });
  }

  try {
    const { name, rating, comment } = await req.json();

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 80)
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    if (!comment || typeof comment !== 'string' || comment.trim().length < 5 || comment.length > 1000)
      return NextResponse.json({ error: 'Comment must be between 5 and 1000 characters' }, { status: 400 });
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });

    const newReview = await db.review.create({
      data: {
        name:      name.trim().slice(0, 80),
        rating:    ratingNum,
        comment:   comment.trim().slice(0, 1000),
        isApproved: false,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;

  try {
    const { id, isApproved } = await req.json();
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const updated = await db.review.update({ where: { id }, data: { isApproved: Boolean(isApproved) } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;

  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await db.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
