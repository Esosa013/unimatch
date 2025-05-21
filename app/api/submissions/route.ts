import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
 const session = await getServerSession({ req, ...authOptions })

  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const fileType = formData.get('fileType') as string

  if (!file || !fileType) {
    return NextResponse.json({ message: 'Missing file or fileType' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${uuidv4()}-${file.name}`
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(filePath, buffer)

  const client = await clientPromise
  const db = client.db()

  await db.collection('submissions').insertOne({
    studentId: session.user.id,
    fileType,
    fileUrl: `/uploads/${filename}`,
    status: 'pending',
    createdAt: new Date(),
  })

  return NextResponse.json({ message: 'Uploaded successfully' })
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'student') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const submissions = await db
    .collection('submissions')
    .find({ studentId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json(submissions)
}
