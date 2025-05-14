'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function BrowseRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('space_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  if (loading) return <div className="text-center py-8">Loading requests...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Space Requests</h1>
          <a
            href="/requests/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Post a Request
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{request.title}</h2>
              <p className="text-gray-600 mb-4">{request.description}</p>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Date:</span> {formatDate(request.event_date)}</p>
                <p><span className="font-medium">Time:</span> {request.start_time} - {request.end_time}</p>
                <p><span className="font-medium">Guests:</span> {request.expected_guests}</p>
                <p><span className="font-medium">Budget:</span> ${request.budget_min} - ${request.budget_max}</p>
                <p><span className="font-medium">Area:</span> {request.preferred_area || 'Any'}</p>
              </div>
              
              <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Contact Guest
              </button>
            </div>
          ))}
        </div>
        
        {requests.length === 0 && (
          <p className="text-center text-gray-500">No active space requests yet.</p>
        )}
      </div>
    </div>
  )
}