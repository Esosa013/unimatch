import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET: List all users (Admin only)
export async function GET() {
  try {
    const db = await getDatabase();
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PUT: Update user info (Admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, update } = body;

    if (!id || !update) {
      return NextResponse.json({ error: "Missing 'id' or 'update' in body" }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
