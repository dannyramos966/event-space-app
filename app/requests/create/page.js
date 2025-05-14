'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateSpaceRequest() {
  const [request, setRequest] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    expected_guests: '',
    budget_min: '',
    budget_max: '',
    preferred_area: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please login first')
        router.push('/auth/login')
        return
      }

      const { error } = await supabase
        .from('space_requests')
        .insert([
          {
            ...request,
            guest_id: user.id,
            expected_guests: parseInt(request.expected_guests),
            budget_min: parseFloat(request.budget_min),
            budget_max: parseFloat(request.budget_max)
          }
        ])

      if (error) throw error

      alert('Space request posted successfully!')
      router.push('/requests')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Post a Space Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Birthday Party, Corporate Meeting"
              className="w-full px-3 py-2 border rounded"
              value={request.title}
              onChange={(e) => setRequest({...request, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your event and space needs..."
              className="w-full px-3 py-2 border rounded"
              value={request.description}
              onChange={(e) => setRequest({...request, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Event Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border rounded"
                value={request.event_date}
                onChange={(e) => setRequest({...request, event_date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">Start Time</label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 border rounded"
                value={request.start_time}
                onChange={(e) => setRequest({...request, start_time: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">End Time</label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 border rounded"
                value={request.end_time}
                onChange={(e) => setRequest({...request, end_time: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1">Expected Number of Guests</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border rounded"
              value={request.expected_guests}
              onChange={(e) => setRequest({...request, expected_guests: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Minimum Budget ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-3 py-2 border rounded"
                value={request.budget_min}
                onChange={(e) => setRequest({...request, budget_min: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">Maximum Budget ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-3 py-2 border rounded"
                value={request.budget_max}
                onChange={(e) => setRequest({...request, budget_max: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1">Preferred Area</label>
            <input
              type="text"
              placeholder="e.g., Winter Park, Downtown Orlando"
              className="w-full px-3 py-2 border rounded"
              value={request.preferred_area}
              onChange={(e) => setRequest({...request, preferred_area: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            {loading ? 'Posting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  )
}