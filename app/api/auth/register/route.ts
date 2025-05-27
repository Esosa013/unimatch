import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone, state } = await request.json();
     const db = await getDatabase();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Save to database
    const user = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      state,
      likedUniversities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, userId: user.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}