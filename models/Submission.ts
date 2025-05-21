export interface Submission {
  _id: string
  studentId: string
  fileType: string
  fileUrl: string
  status: 'pending' | 'accepted' | 'rejected'
  reason?: string
  createdAt: Date
}