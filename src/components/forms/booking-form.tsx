'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BookingForm() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: {[key: string]: string} = {}
    
    if (!checkIn) {
      newErrors.checkIn = 'Pilih tanggal check-in'
    }
    
    if (!checkOut) {
      newErrors.checkOut = 'Pilih tanggal check-out'
    }
    
    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      newErrors.checkOut = 'Tanggal check-out harus setelah check-in'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    
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
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value)
                if (errors.checkIn) setErrors(prev => ({ ...prev, checkIn: '' }))
              }}
              min={today}
              className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.checkIn ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              required
            />
          </div>
          {errors.checkIn && (
            <p className="text-xs text-red-600">{errors.checkIn}</p>
          )}
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value)
                if (errors.checkOut) setErrors(prev => ({ ...prev, checkOut: '' }))
              }}
              min={checkIn || today}
              className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.checkOut ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              required
            />
          </div>
          {errors.checkOut && (
            <p className="text-xs text-red-600">{errors.checkOut}</p>
          )}
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label htmlFor="guests" className="text-sm font-medium text-gray-700">
            Tamu
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm text-gray-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 appearance-none cursor-pointer"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num} className="text-gray-900">
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
          <Button type="submit" className="w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-white">
            <Search className="h-4 w-4 mr-2" />
            Cari Villa
          </Button>
        </div>
      </div>
    </form>
  )
}
