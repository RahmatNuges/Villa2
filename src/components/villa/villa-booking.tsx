'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Phone, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VillaBookingProps {
  villa: {
    id: string
    name: string
    base_price: number
    max_guests: number
  }
  checkIn?: string
  checkOut?: string
  guests?: string
}

interface PricingData {
  nights: number
  total_price: number
  base_price_per_night: number
  subtotal: number
  adjustments: number
}

export function VillaBooking({ villa, checkIn, checkOut, guests }: VillaBookingProps) {
  const router = useRouter()
  const [bookingData, setBookingData] = useState({
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    guests: guests || '2',
  })
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const calculatePrice = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setPricing(null)
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          villa_id: villa.id,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
          guests: parseInt(bookingData.guests),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghitung harga')
      }

      setPricing(data.pricing)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setPricing(null)
    } finally {
      setIsCalculating(false)
    }
  }

  useEffect(() => {
    calculatePrice()
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.guests])

  const handleInputChange = (key: string, value: string) => {
    setBookingData(prev => ({ ...prev, [key]: value }))
  }

  const handleInstantBook = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Silakan pilih tanggal check-in dan check-out')
      return
    }

    if (error) {
      alert(error)
      return
    }

    if (!pricing) {
      alert('Sedang menghitung harga, silakan tunggu sebentar')
      return
    }

    // Create WhatsApp message
    const message = `Halo! Saya ingin booking villa "${villa.name}" untuk:
📅 Check-in: ${bookingData.checkIn}
📅 Check-out: ${bookingData.checkOut}
👥 Jumlah tamu: ${bookingData.guests}
💰 Total: Rp${pricing.total_price.toLocaleString()}

Mohon informasi lebih lanjut.`

    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    
    window.open(waUrl, '_blank')
  }

  const handleBookNow = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Silakan pilih tanggal check-in dan check-out')
      return
    }

    // Redirect to booking page with parameters
    const params = new URLSearchParams({
      villaId: villa.id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
    })

    router.push(`/booking?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
        <div className="text-2xl font-bold text-yellow-600 mb-1">
          Rp{villa.base_price?.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">per malam</div>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={bookingData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={today}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={bookingData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={bookingData.checkIn || today}
              className="pl-10"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tamu</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={bookingData.guests}
              onChange={(e) => handleInputChange('guests', e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
            >
              {Array.from({ length: villa.max_guests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Tamu' : 'Tamu'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Breakdown */}
        {isCalculating && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Menghitung harga...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          </div>
        )}

        {pricing && !isCalculating && !error && (
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rp{pricing.base_price_per_night.toLocaleString()} × {pricing.nights} malam</span>
                <span>Rp{pricing.subtotal.toLocaleString()}</span>
              </div>
              {pricing.adjustments !== 0 && (
                <div className="flex justify-between text-sm">
                  <span>Penyesuaian harga</span>
                  <span className={pricing.adjustments > 0 ? 'text-red-600' : 'text-green-600'}>
                    {pricing.adjustments > 0 ? '+' : ''}Rp{pricing.adjustments.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rp{pricing.total_price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleInstantBook}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Instant Book via WhatsApp
          </Button>
          
          <Button 
            onClick={handleBookNow}
            variant="outline"
            className="w-full"
          >
            <Phone className="h-4 w-4 mr-2" />
            Hubungi Kami
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          <p>• Tidak ada biaya booking</p>
          <p>• Pembayaran aman</p>
          <p>• Konfirmasi instan</p>
        </div>
      </div>
    </div>
  )
}
