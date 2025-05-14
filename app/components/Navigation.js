'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error('Error checking user:', error)
      }
    }
    
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-8">
            <Link href="/" className="font-semibold">
              Event Space App
            </Link>
            <Link href="/venues">Browse Venues</Link>
            <Link href="/requests">Space Requests</Link>
            {user && (
              <>
                <Link href="/venues/create">List Space</Link>
                <Link href="/requests/create">Post Request</Link>
              </>
            )}
          </div>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded">
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}