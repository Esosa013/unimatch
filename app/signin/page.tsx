'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { LogIn, User, Lock } from 'lucide-react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

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

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Banner */}
          <div className="bg-blue-800 text-white rounded-lg p-6 mb-6 shadow-md text-center">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="mt-2">Sign in to access your document portal</p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-800 text-white px-4 py-3">
              <h3 className="font-semibold text-lg flex items-center">
                <LogIn size={20} className="mr-2" />
                Student Login
              </h3>
            </div>
            
            <div className="p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 rounded-md bg-red-100 text-red-800 border border-red-300">
                  Invalid credentials. Please try again.
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  signIn('credentials', {
                    redirect: true,
                    callbackUrl: '/dashboard/student',
                    username: formData.get('username'),
                    password: formData.get('password'),
                  })
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition flex justify-center items-center"
                >
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Having trouble accessing your account?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    Contact IT Support
                  </a>
                </p>
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