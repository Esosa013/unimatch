import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
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

export async function PUT(request: Request) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const { id, update } = body;

    if (!id || !update) {
      return NextResponse.json({ error: "Missing 'id' or 'update' in request body" }, { status: 400 });
    }

    const result = await db.collection("universities").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "University updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update university" }, { status: 500 });
  }
}