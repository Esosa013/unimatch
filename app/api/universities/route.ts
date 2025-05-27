import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
     const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const course = searchParams.get('course');
    const maxFee = searchParams.get('maxFee');
    
    let filter: any = {};
    
    if (state) filter.state = state;
    if (course) filter.courses = { $in: [new RegExp(course, 'i')] };
    if (maxFee) filter['tuitionFee.max'] = { $lte: parseInt(maxFee) };
    
    const universities = await db.collection('universities').find(filter).toArray();
    
    return NextResponse.json(universities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 });
  }
}