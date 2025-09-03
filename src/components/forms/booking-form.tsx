'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function BookingForm() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!checkIn || !checkOut) {
      alert('Silakan pilih tanggal check-in dan check-out')
      return
    }

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    })

    router.push(`/villas?${params.toString()}`)
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label htmlFor="guests" className="text-sm font-medium text-gray-700">
            Tamu
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Tamu' : 'Tamu'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 opacity-0">
            Cari
          </label>
          <Button type="submit" className="w-full h-10">
            <Search className="h-4 w-4 mr-2" />
            Cari Villa
          </Button>
        </div>
      </div>
    </form>
  )
}
