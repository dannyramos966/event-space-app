'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateVenue() {
  const [venue, setVenue] = useState({
    name: '',
    description: '',
    address: '',
    city: 'Orlando',
    state: 'FL',
    zip: '',
    capacity: '',
    price_per_hour: ''
  })
  
  // Initialize availability for all days
  const [availability, setAvailability] = useState({
    0: { day: 'Sunday', open: '09:00', close: '17:00', available: false },
    1: { day: 'Monday', open: '09:00', close: '17:00', available: true },
    2: { day: 'Tuesday', open: '09:00', close: '17:00', available: true },
    3: { day: 'Wednesday', open: '09:00', close: '17:00', available: true },
    4: { day: 'Thursday', open: '09:00', close: '17:00', available: true },
    5: { day: 'Friday', open: '09:00', close: '17:00', available: true },
    6: { day: 'Saturday', open: '09:00', close: '17:00', available: false }
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

      // Create venue
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .insert([
          {
            ...venue,
            host_id: user.id,
            capacity: parseInt(venue.capacity),
            price_per_hour: parseFloat(venue.price_per_hour)
          }
        ])
        .select()

      if (venueError) throw venueError

      // Create availability entries
      const availabilityData = Object.entries(availability)
        .filter(([day, data]) => data.available)
        .map(([day, data]) => ({
          venue_id: venueData[0].id,
          day_of_week: parseInt(day),
          open_time: data.open,
          close_time: data.close,
          is_available: true
        }))

      const { error: availError } = await supabase
        .from('venue_availability')
        .insert(availabilityData)

      if (availError) throw availError

      alert('Venue created successfully!')
      router.push('/dashboard')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateAvailability = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">List Your Space</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic venue info */}
          <div>
            <label className="block mb-1">Venue Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded"
              value={venue.name}
              onChange={(e) => setVenue({...venue, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 border rounded"
              value={venue.description}
              onChange={(e) => setVenue({...venue, description: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded"
              value={venue.address}
              onChange={(e) => setVenue({...venue, address: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded"
                value={venue.city}
                onChange={(e) => setVenue({...venue, city: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">State</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded"
                value={venue.state}
                onChange={(e) => setVenue({...venue, state: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">ZIP</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded"
                value={venue.zip}
                onChange={(e) => setVenue({...venue, zip: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Capacity</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border rounded"
                value={venue.capacity}
                onChange={(e) => setVenue({...venue, capacity: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-1">Price per Hour ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-3 py-2 border rounded"
                value={venue.price_per_hour}
                onChange={(e) => setVenue({...venue, price_per_hour: e.target.value})}
              />
            </div>
          </div>
          
          {/* Availability section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Availability Hours</h3>
            <div className="space-y-2">
              {Object.entries(availability).map(([day, data]) => (
                <div key={day} className="flex items-center gap-4 p-3 border rounded">
                  <input
                    type="checkbox"
                    checked={data.available}
                    onChange={(e) => updateAvailability(day, 'available', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="w-24">{data.day}</span>
                  <input
                    type="time"
                    value={data.open}
                    onChange={(e) => updateAvailability(day, 'open', e.target.value)}
                    disabled={!data.available}
                    className="px-2 py-1 border rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={data.close}
                    onChange={(e) => updateAvailability(day, 'close', e.target.value)}
                    disabled={!data.available}
                    className="px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            {loading ? 'Creating...' : 'List My Space'}
          </button>
        </form>
      </div>
    </div>
  )
}