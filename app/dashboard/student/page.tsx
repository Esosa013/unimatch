'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { signOut } from 'next-auth/react'
import { 
  Upload, 
  FileCheck, 
  FileWarning, 
  ClockIcon, 
  LogOut,
  BookOpen,
  CreditCard,
  Receipt
} from 'lucide-react'
import { Submission } from '@/models/Submission'

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [fileType, setFileType] = useState('id_card')
  const [file, setFile] = useState<File | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  type Notification = { type: 'error' | 'success', message: string } | null
  const [notification, setNotification] = useState<Notification>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/submissions')
        const data = await res.json()
        setSubmissions(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
        setNotification({
          type: 'error',
          message: 'Failed to load your submissions. Please try again later.'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setNotification({
        type: 'error',
        message: 'Please select a file to upload'
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', fileType)

      await axios.post('/api/submissions', formData, {
        withCredentials: true,
      })

      setNotification({
        type: 'success',
        message: 'Document submitted successfully!'
      })

      // Refresh submissions instead of reloading the page
      const res = await fetch('/api/submissions')
      const data = await res.json()
      setSubmissions(Array.isArray(data) ? data : [])
      
      // Reset form
      setFile(null)
      // Reset file input by accessing the DOM directly
      const fileInput = document.getElementById('file-upload') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error("Submission error:", error)
      setNotification({
        type: 'error',
        message: 'Failed to upload document. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rejected submission?')) return

    setLoading(true)
    try {
      await axios.delete('/api/submissions/delete', { data: { id } })
      setSubmissions(prev => prev.filter(sub => sub._id !== id))
      setNotification({
        type: 'success',
        message: 'Submission deleted successfully'
      })
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to delete submission'
      })
    } finally {
      setLoading(false)
    }
  }

  interface StatusIconProps {
    status: 'approved' | 'rejected' | string
  }

  const getStatusIcon = (status: StatusIconProps['status']): JSX.Element => {
    switch(status) {
      case 'approved':
        return <FileCheck className="text-green-600" />
      case 'rejected':
        return <FileWarning className="text-red-600" />
      default:
        return <ClockIcon className="text-yellow-600" />
    }
  }

  interface FileTypeIconProps {
    type: 'id_card' | 'school_fees' | 'library_clearance' | string
  }

  const getFileTypeIcon = (type: FileTypeIconProps['type']): JSX.Element | null => {
    switch(type) {
      case 'id_card':
        return <CreditCard className="text-blue-600" />
      case 'school_fees':
        return <Receipt className="text-purple-600" />
      case 'library_clearance':
        return <BookOpen className="text-teal-600" />
      default:
        return null
    }
  }

  interface FileTypeNameMap {
    [key: string]: string;
    id_card: string;
    school_fees: string;
    library_clearance: string;
  }

  const getFileTypeName = (type: string): string => {
    const typeMap: FileTypeNameMap = {
      id_card: 'Student ID Card',
      school_fees: 'School Fees Receipt',
      library_clearance: 'Library Clearance',
    };
    return typeMap[type] || type;
  }

  interface StatusClassMap {
    [key: string]: string;
    approved: string;
    rejected: string;
    pending: string;
  }

  const getStatusClass = (status: 'approved' | 'rejected' | string): string => {
    const statusMap: StatusClassMap = {
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return statusMap[status] || statusMap['pending']!;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/bingham.png" alt="Bingham University" className="h-12" />
            <div>
              <h1 className="text-xl font-bold text-blue-800">Bingham University</h1>
              <p className="text-sm text-gray-600">Student Document Portal</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-2xl font-bold">Welcome, {session?.user?.email || 'Student'}</h2>
          <p className="mt-2">Use this portal to submit your required documents for verification</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`}>
            {notification.message}
            <button 
              className="float-right text-sm font-semibold" 
              onClick={() => setNotification(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Upload size={20} className="mr-2" />
                  Upload Document
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    id="document-type"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="id_card">Student ID Card</option>
                    <option value="school_fees">School Fees Receipt</option>
                    <option value="library_clearance">Library Clearance</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                    Select File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </button>
              </form>
            </div>
          </div>

          {/* Submissions List */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-3">
                <h3 className="font-semibold text-lg">Your Submissions</h3>
              </div>
              <div className="p-4">
                {loading && submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Loading your submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    You haven't submitted any documents yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub, i) => (
                      <div key={i} className="border rounded-md overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                          <div className="flex items-center space-x-2">
                            {getFileTypeIcon(sub.fileType)}
                            <span className="font-medium">{getFileTypeName(sub.fileType)}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(sub.status)} flex items-center`}>
                            {getStatusIcon(sub.status)}
                            <span className="ml-1 capitalize">{sub.status}</span>
                          </div>
                        </div>
                        <div className="px-4 py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">
                                Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                              </p>
                              {sub.status === 'rejected' && sub.reason && (
                                <div className="mt-2 text-sm text-red-600">
                                  <strong>Reason:</strong> {sub.reason}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <a
                                href={sub.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition"
                              >
                                View
                              </a>
                              {sub.status === 'rejected' && (
                                <button
                                  onClick={() => handleDelete(sub._id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Bingham University. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-600">
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-blue-800">Help</a></li>
                <li><a href="#" className="hover:text-blue-800">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-800">Contact IT Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}