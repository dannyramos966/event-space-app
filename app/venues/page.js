'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function BrowseVenues() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          venue_availability (*)
        `)
        .eq('status', 'active')

      if (error) throw error
      setVenues(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (dayNum) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[dayNum]
  }

  if (loading) return <div className="text-center py-8">Loading venues...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Browse Event Spaces</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Location:</span> {venue.city}, {venue.state}</p>
                <p><span className="font-medium">Capacity:</span> {venue.capacity} people</p>
                <p><span className="font-medium">Price:</span> ${venue.price_per_hour}/hour</p>
                
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Available:</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.venue_availability
                      .sort((a, b) => a.day_of_week - b.day_of_week)
                      .map((avail) => (
                        <span
                          key={avail.id}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {getDayName(avail.day_of_week)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                View Details
              </button>
            </div>
          ))}
        </div>
        
        {venues.length === 0 && (
          <p className="text-center text-gray-500">No venues available yet.</p>
        )}
      </div>
    </div>
  )
}