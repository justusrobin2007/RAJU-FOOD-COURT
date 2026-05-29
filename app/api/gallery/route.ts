import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function GET() {
  try {
    const photos = await db.galleryPhoto.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;
  try {
    const { url, caption } = await req.json();
    if (!url || typeof url !== 'string') return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    const photo = await db.galleryPhoto.create({
      data: { url: url.trim(), caption: (caption || '').trim().slice(0, 120) },
    });
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Failed to add gallery photo:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await db.galleryPhoto.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete gallery photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
