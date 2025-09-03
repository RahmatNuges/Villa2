'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Users, User, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Villa {
  id: string
  name: string
  location: string | null
  base_price: number
  max_guests: number
  images: Array<{
    url: string
    alt: string | null
  }>
}

interface PricingData {
  nights: number
  total_price: number
  base_price_per_night: number
  subtotal: number
  adjustments: number
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [villa, setVilla] = useState<Villa | null>(null)
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [bookingData, setBookingData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    special_requests: '',
  })

  const villaId = searchParams.get('villaId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = searchParams.get('guests')

  useEffect(() => {
    if (!villaId || !checkIn || !checkOut || !guests) {
      router.push('/villas')
      return
    }

    const fetchVillaAndPricing = async () => {
      try {
        // Fetch villa details
        const villaResponse = await fetch(`/api/villas/${villaId}`)
        if (!villaResponse.ok) {
          throw new Error('Villa tidak ditemukan')
        }
        const villaData = await villaResponse.json()
        setVilla(villaData.villa)

        // Calculate pricing
        const pricingResponse = await fetch('/api/bookings/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            villa_id: villaId,
            check_in: checkIn,
            check_out: checkOut,
            guests: parseInt(guests),
          }),
        })

        if (!pricingResponse.ok) {
          const errorData = await pricingResponse.json()
          throw new Error(errorData.error || 'Gagal menghitung harga')
        }

        const pricingData = await pricingResponse.json()
        setPricing(pricingData.pricing)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVillaAndPricing()
  }, [villaId, checkIn, checkOut, guests, router])

  const handleInputChange = (key: string, value: string) => {
    setBookingData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!villa || !pricing) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          villa_id: villa.id,
          guest_name: bookingData.guest_name,
          guest_email: bookingData.guest_email,
          guest_phone: bookingData.guest_phone,
          check_in: checkIn,
          check_out: checkOut,
          guests: parseInt(guests || '1'),
          total_price: pricing.total_price,
          special_requests: bookingData.special_requests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat booking')
      }

      // Redirect to success page or show success message
      router.push(`/booking/success?reference=${data.booking.booking_reference}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    )
  }

  if (error || !villa || !pricing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <Button onClick={() => router.push('/villas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Villa
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Booking</h1>
          <p className="text-gray-600 mt-2">Lengkapi data Anda untuk menyelesaikan booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Tamu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Guest Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={bookingData.guest_name}
                        onChange={(e) => handleInputChange('guest_name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={bookingData.guest_email}
                        onChange={(e) => handleInputChange('guest_email', e.target.value)}
                        placeholder="Masukkan email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        value={bookingData.guest_phone}
                        onChange={(e) => handleInputChange('guest_phone', e.target.value)}
                        placeholder="Masukkan nomor telepon"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Permintaan Khusus (Opsional)</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        value={bookingData.special_requests}
                        onChange={(e) => handleInputChange('special_requests', e.target.value)}
                        placeholder="Masukkan permintaan khusus jika ada"
                        className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                        rows={3}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Villa Info */}
                <div>
                  <h3 className="font-semibold text-lg">{villa.name}</h3>
                  {villa.location && (
                    <p className="text-sm text-gray-600">{villa.location}</p>
                  )}
                </div>

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium">{checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium">{checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamu:</span>
                    <span className="font-medium">{guests} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <span className="font-medium">{pricing.nights} malam</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
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

                {/* Villa Image */}
                {villa.images && villa.images.length > 0 && (
                  <div className="pt-4">
                    <img
                      src={villa.images[0].url}
                      alt={villa.images[0].alt || villa.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
