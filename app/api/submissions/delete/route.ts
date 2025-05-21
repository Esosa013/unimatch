import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import path from 'path'
import fs from 'fs/promises'
import clientPromise from '@/lib/mongodb' // adjust if your DB client path is different

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('submissions')

    // Find the submission first
    const submission = await collection.findOne({ _id: new ObjectId(id) })
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', 'uploads', path.basename(submission.fileUrl))
    await fs.unlink(filePath).catch(() => {
      // Fail silently if file doesn't exist
    })

    // Delete from DB
    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
