'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogIn, FileCheck, Upload, Shield, BookOpen, CreditCard, Receipt } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // wait for session
    if (session) {
      if (session.user.role === 'admin') {
        router.replace('/dashboard/admin')
      } else if (session.user.role === 'student') {
        router.replace('/dashboard/student')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-3">
              <img src="\bingham.png" alt="Bingham University" className="h-12" />
              <div>
                <h1 className="text-xl font-bold text-blue-800">Bingham University</h1>
                <p className="text-sm text-gray-600">Student Document Portal</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center px-4 py-20">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your session...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="\bingham.png" alt="Bingham University" className="h-12" />
              <div>
                <h1 className="text-xl font-bold text-blue-800">Bingham University</h1>
                <p className="text-sm text-gray-600">Student Document Portal</p>
              </div>
            </div>
            <a
              href="/signin"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-blue-800 text-white rounded-lg p-8 mb-12 shadow-md text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Document Clearance System</h2>
          <p className="text-xl mb-6">Streamline your document submission and verification process</p>
          <a
            href="/signin"
            className="inline-flex items-center space-x-2 bg-white text-blue-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
          >
            <LogIn size={20} />
            <span>Get Started - Sign In</span>
          </a>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold">Easy Upload</h3>
            </div>
            <p className="text-gray-600">
              Submit your documents digitally with our user-friendly upload system. Support for PDF, JPG, and PNG formats.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileCheck className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold">Quick Verification</h3>
            </div>
            <p className="text-gray-600">
              Track your submission status in real-time. Get instant notifications when your documents are approved or need revision.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold">Secure & Reliable</h3>
            </div>
            <p className="text-gray-600">
              Your documents are stored securely with industry-standard encryption. Access your submissions anytime, anywhere.
            </p>
          </div>
        </div>

        {/* Document Types Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-12">
          <div className="bg-blue-800 text-white px-6 py-4">
            <h3 className="text-xl font-semibold">Required Documents</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-blue-600" size={20} />
                <div>
                  <h4 className="font-medium">Student ID Card</h4>
                  <p className="text-sm text-gray-600">Valid university identification</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Receipt className="text-purple-600" size={20} />
                <div>
                  <h4 className="font-medium">School Fees Receipt</h4>
                  <p className="text-sm text-gray-600">Proof of payment for current semester</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="text-teal-600" size={20} />
                <div>
                  <h4 className="font-medium">Library Clearance</h4>
                  <p className="text-sm text-gray-600">No outstanding library obligations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Sign in to your student account to begin submitting your clearance documents.
            </p>
            <a
              href="/signin"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition text-lg"
            >
              <LogIn size={20} />
              <span>Sign In to Your Account</span>
            </a>
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