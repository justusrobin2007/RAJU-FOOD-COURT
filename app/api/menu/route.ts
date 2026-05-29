import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

function validateMenuItem(body: any) {
  const { name, description, price, category, image } = body;
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 120) return 'Invalid name';
  if (!description || typeof description !== 'string' || description.trim().length < 5 || description.length > 1000) return 'Invalid description';
  if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0 || parseFloat(price) > 100000) return 'Invalid price';
  if (!category || typeof category !== 'string') return 'Invalid category';
  if (!image || typeof image !== 'string' || image.length > 500) return 'Invalid image';
  return null;
}

// Public: only active items
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    // Admin requests with session can see all items; public sees only active
    const isAdmin = all && getSessionFromRequest(req);
    const items = await db.menuItem.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;
  try {
    const body = await req.json();
    const validationError = validateMenuItem(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const { name, description, price, category, image, spiceLevel, isBestseller, ingredients } = body;
    const newItem = await db.menuItem.create({
      data: {
        name:        name.trim().slice(0, 120),
        description: description.trim().slice(0, 1000),
        price:       parseFloat(price),
        category:    category.trim(),
        image:       image.trim(),
        spiceLevel:  Math.min(3, Math.max(0, parseInt(spiceLevel) || 0)),
        isBestseller: Boolean(isBestseller),
        isActive:    true,
        ingredients: Array.isArray(ingredients) ? ingredients.slice(0, 20).map((i: string) => String(i).slice(0, 60)) : [],
      },
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// Edit or toggle a menu item
export async function PATCH(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    // Build safe update object
    const data: any = {};
    if (typeof updates.isActive     === 'boolean') data.isActive     = updates.isActive;
    if (typeof updates.isBestseller === 'boolean') data.isBestseller = updates.isBestseller;
    if (typeof updates.name         === 'string')  data.name         = updates.name.trim().slice(0, 120);
    if (typeof updates.description  === 'string')  data.description  = updates.description.trim().slice(0, 1000);
    if (typeof updates.price        === 'number')  data.price        = updates.price;
    if (typeof updates.category     === 'string')  data.category     = updates.category.trim();
    if (typeof updates.spiceLevel   === 'number')  data.spiceLevel   = Math.min(3, Math.max(0, updates.spiceLevel));
    if (typeof updates.image        === 'string' && updates.image.length > 0) data.image = updates.image.trim();

    const updated = await db.menuItem.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!getSessionFromRequest(req)) return UNAUTHORIZED;
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
