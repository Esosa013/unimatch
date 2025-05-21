import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()
  const submissions = await db.collection('submissions').find().sort({ createdAt: -1 }).toArray()

  return NextResponse.json(submissions)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, reason } = await req.json()

  if (!id || !status) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db()

  await db.collection('submissions').updateOne(
    { _id: new (require('mongodb').ObjectId)(id) },
    { $set: { status, reason } }
  )

  return NextResponse.json({ message: 'Updated successfully' })
}
