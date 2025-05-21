'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  LogOut,
  Filter,
  FileText,
  User,
  Search,
  BookOpen,
  CreditCard,
  Receipt
} from 'lucide-react'

interface Submission {
  _id: string
  studentId: string
  studentName?: string
  fileType: string
  fileUrl: string
  status: string
  reason?: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [reasonMap, setReasonMap] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/admin/submissions')
        setSubmissions(res.data)
        setFilteredSubmissions(res.data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
        setNotification({
          type: 'error',
          message: 'Failed to load submissions. Please try again.'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  useEffect(() => {
    // Apply filtering and searching
    let result = [...submissions]
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(sub => sub.status === filter)
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(sub => 
        (sub.studentId && sub.studentId.toLowerCase().includes(term)) ||
        (sub.studentName && sub.studentName.toLowerCase().includes(term)) ||
        sub.fileType.toLowerCase().includes(term)
      )
    }
    
    setFilteredSubmissions(result)
  }, [filter, searchTerm, submissions])

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const reason = reasonMap[id] || ''
    if (status === 'rejected' && !reason) {
      setNotification({
        type: 'error',
        message: 'Please provide a reason for rejection'
      })
      return
    }
    
    setLoading(true)
    try {
      await axios.put('/api/admin/submissions', { id, status, reason })
      
      // Update local state
      setSubmissions(prev => 
        prev.map(s => (s._id === id ? { ...s, status, reason } : s))
      )
      
      setNotification({
        type: 'success',
        message: `Submission ${status === 'approved' ? 'approved' : 'rejected'} successfully`
      })
      
      // Clear reason field
      const updatedReasonMap = { ...reasonMap }
      delete updatedReasonMap[id]
      setReasonMap(updatedReasonMap)
      
      // Close expanded view
      setExpandedSubmission(null)
    } catch (error) {
      console.error("Action failed:", error)
      setNotification({
        type: 'error',
        message: `Failed to ${status} submission. Please try again.`
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved':
        return <CheckCircle size={20} className="text-green-600" />
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />
      default:
        return <Clock size={20} className="text-yellow-600" />
    }
  }

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const getFileTypeIcon = (type: string) => {
    switch(type) {
      case 'id_card':
        return <CreditCard size={18} className="text-blue-600" />
      case 'school_fees':
        return <Receipt size={18} className="text-purple-600" />
      case 'library_clearance':
        return <BookOpen size={18} className="text-teal-600" />
      default:
        return <FileText size={18} className="text-gray-600" />
    }
  }

  const getFileTypeName = (type: string) => {
    switch(type) {
      case 'id_card':
        return 'Student ID Card'
      case 'school_fees':
        return 'School Fees Receipt'
      case 'library_clearance':
        return 'Library Clearance'
      default:
        return type
    }
  }

  const toggleExpand = (id: string) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null)
    } else {
      setExpandedSubmission(id)
    }
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
              <p className="text-sm text-gray-600">Admin Document Portal</p>
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
        {/* Admin Header */}
        <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="mt-2">Review and manage student document submissions</p>
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <Filter size={20} className="text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium mr-3">Filter:</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-md flex items-center ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <Clock size={14} className="mr-1" />
                  Pending
                </button>
                <button 
                  onClick={() => setFilter('approved')}
                  className={`px-3 py-1 rounded-md flex items-center ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Approved
                </button>
                <button 
                  onClick={() => setFilter('rejected')}
                  className={`px-3 py-1 rounded-md flex items-center ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <XCircle size={14} className="mr-1" />
                  Rejected
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by student ID or document type..."
                className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center">
              <FileText size={20} className="mr-2" />
              Document Submissions
            </h3>
            <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'submission' : 'submissions'}
            </span>
          </div>

          {loading && submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Loading submissions...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No submissions found matching your criteria.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.map((sub) => (
                <div key={sub._id} className="hover:bg-gray-50 transition">
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpand(sub._id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-start md:items-center space-x-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{sub.studentName || `Student ID: ${sub.studentId}`}</div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            {getFileTypeIcon(sub.fileType)}
                            <span className="ml-1">{getFileTypeName(sub.fileType)}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(sub.status)} flex items-center`}>
                          {getStatusIcon(sub.status)}
                          <span className="ml-1 capitalize">{sub.status}</span>
                        </span>
                        {expandedSubmission !== sub._id && sub.status === 'pending' && (
                          <div className="ml-3 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(sub._id, 'approved');
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedSubmission(sub._id);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedSubmission === sub._id && (
                    <div className="bg-gray-50 p-4 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-1">
                          <div className="mb-4">
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md transition font-medium"
                            >
                              <FileText size={16} className="mr-2" />
                              View Document
                            </a>
                          </div>

                          {sub.status === 'pending' && (
                            <div className="space-y-3">
                              <div>
                                <label htmlFor={`reason-${sub._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Rejection Reason
                                </label>
                                <textarea
                                  id={`reason-${sub._id}`}
                                  placeholder="Please provide a reason for rejection..."
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  rows={3}
                                  value={reasonMap[sub._id] || ''}
                                  onChange={(e) => setReasonMap({ ...reasonMap, [sub._id]: e.target.value })}
                                />
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleAction(sub._id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition flex-1"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(sub._id, 'rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition flex-1"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}

                          {sub.status !== 'pending' && sub.reason && (
                            <div className="mt-2 bg-gray-100 p-3 rounded-md">
                              <div className="text-sm text-gray-800">
                                <strong>Feedback/Reason:</strong> {sub.reason}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
                <li><a href="#" className="hover:text-blue-800">Admin Guide</a></li>
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