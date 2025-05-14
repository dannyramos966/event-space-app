'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <a href="/" className="flex items-center px-2 py-2 text-gray-900 font-semibold">
              Event Space App
            </a>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/venues" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Browse Venues
              </a>
              <a href="/requests" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Space Requests
              </a>
              {user && user.role === 'host' && (
                <a href="/venues/create" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  List Space
                </a>
              )}
              {user && user.role === 'guest' && (
                <a href="/requests/create" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  Post Request
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-4">
                <a href="/auth/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </a>
                <a href="/auth/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}