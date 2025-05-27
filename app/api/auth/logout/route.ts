import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Since we're using JWT tokens stored in localStorage,
    // logout is handled on the client side by removing the token
    // This endpoint can be used for additional cleanup if needed
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' }, 
      { status: 500 }
    );
  }
}