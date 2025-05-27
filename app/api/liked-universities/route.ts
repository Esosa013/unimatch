import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Helper function to verify JWT token and get user ID
async function verifyToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  return decoded.userId;
}

// GET - Retrieve user's liked universities
export async function GET(request: Request) {
  try {
    const userId = await verifyToken(request);
    const db = await getDatabase();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { likedUniversities: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      likedUniversities: user.likedUniversities || [] 
    });
  } catch (error) {
    console.error('GET Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch liked universities' }, { status: 500 });
  }
}

// POST - Add university to liked list
export async function POST(request: Request) {
  try {
    const userId = await verifyToken(request);
    const { universityId } = await request.json();

    if (!universityId) {
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const db = await getDatabase();

    // Check if university is already liked
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
      likedUniversities: universityId
    });

    if (user) {
      return NextResponse.json({ error: 'University already liked' }, { status: 409 });
    }

    // Add university to liked list
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $addToSet: { likedUniversities: universityId },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'University added to liked list',
      universityId 
    });
  } catch (error) {
    console.error('POST Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to add university to liked list' }, { status: 500 });
  }
}

// DELETE - Remove university from liked list
export async function DELETE(request: Request) {
  try {
    console.log('DELETE request received');
    const userId = await verifyToken(request);
    console.log('User ID:', userId);
    
    // Get the request body
    const body = await request.json();
    console.log('Request body:', body);
    const { universityId } = body;

    if (!universityId) {
      console.log('No university ID provided');
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    console.log('Database connected');

    // First check if user exists and has this university in their liked list
    const userBefore = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { likedUniversities: 1 } }
    );
    
    console.log('User before update:', userBefore);
    console.log('Liked universities before:', userBefore?.likedUniversities);
    console.log('Trying to remove:', universityId);

    // Remove university from liked list
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $pull: { likedUniversities: universityId },
        $set: { updatedAt: new Date() }
      }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the university was actually removed
    const userAfter = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { likedUniversities: 1 } }
    );
    
    console.log('User after update:', userAfter);
    console.log('Liked universities after:', userAfter?.likedUniversities);

    // If modifiedCount is 0, it means the university wasn't in the list
    if (result.modifiedCount === 0) {
      console.log('University not found in liked list or already removed');
      // Still return success since the desired state is achieved
      return NextResponse.json({ 
        message: 'University was not in liked list or already removed',
        universityId 
      });
    }

    console.log('University successfully removed');
    return NextResponse.json({ 
      message: 'University removed from liked list',
      universityId 
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to remove university from liked list' }, { status: 500 });
  }
}