'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Users, Phone, Mail, MessageCircle, Home, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookingData {
  id: string
  booking_reference: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: string
  special_requests?: string
  villas: {
    id: string
    name: string
    location: string | null
    images: Array<{
      url: string
      alt: string | null
    }>
  }
}

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reference = searchParams.get('reference')

  useEffect(() => {
    if (!reference) {
      router.push('/villas')
      return
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings?reference=${reference}`)
        if (!response.ok) {
          throw new Error('Booking tidak ditemukan')
        }
        const data = await response.json()
        if (data.bookings && data.bookings.length > 0) {
          setBooking(data.bookings[0])
        } else {
          throw new Error('Booking tidak ditemukan')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [reference, router])

  const handleWhatsAppContact = () => {
    if (!booking) return

    const message = `Halo! Saya telah melakukan booking villa "${booking.villas.name}" dengan referensi ${booking.booking_reference}.

📅 Check-in: ${booking.check_in}
📅 Check-out: ${booking.check_out}
👥 Jumlah tamu: ${booking.guests}
💰 Total: Rp${booking.total_price.toLocaleString()}

Mohon konfirmasi dan informasi lebih lanjut.`

    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    
    window.open(waUrl, '_blank')
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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <Button onClick={() => router.push('/villas')}>
            Kembali ke Villa
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Berhasil!
          </h1>
          <p className="text-gray-600">
            Terima kasih telah memilih villa kami. Booking Anda telah dikonfirmasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Detail Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Reference */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800">Nomor Referensi Booking</h3>
                      <p className="text-2xl font-bold text-yellow-900">{booking.booking_reference}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {booking.status === 'confirmed' ? 'Dikonfirmasi' : booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Villa Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">{booking.villas.name}</h3>
                  {booking.villas.location && (
                    <p className="text-gray-600 mb-4">{booking.villas.location}</p>
                  )}
                  {booking.villas.images && booking.villas.images.length > 0 && (
                    <img
                      src={booking.villas.images[0].url}
                      alt={booking.villas.images[0].alt || booking.villas.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">{booking.check_in}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">{booking.check_out}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Jumlah Tamu</p>
                        <p className="font-medium">{booking.guests} orang</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 text-gray-400 mr-3 flex items-center justify-center">
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Harga</p>
                        <p className="font-medium text-lg">Rp{booking.total_price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg mb-4">Informasi Tamu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Nama</p>
                        <p className="font-medium">{booking.guest_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{booking.guest_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Telepon</p>
                        <p className="font-medium">{booking.guest_phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-lg mb-2">Permintaan Khusus</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {booking.special_requests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-4">
                    Booking Anda telah dikonfirmasi. Tim kami akan menghubungi Anda untuk konfirmasi lebih lanjut.
                  </p>
                </div>

                <Button 
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Hubungi via WhatsApp
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => router.push('/villas')}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Lihat Villa Lain
                </Button>

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <p className="mb-2"><strong>Catatan Penting:</strong></p>
                  <ul className="space-y-1">
                    <li>• Simpan nomor referensi booking ini</li>
                    <li>• Tim kami akan menghubungi Anda dalam 24 jam</li>
                    <li>• Pembayaran dapat dilakukan saat check-in</li>
                    <li>• Batas waktu pembatalan: 24 jam sebelum check-in</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
