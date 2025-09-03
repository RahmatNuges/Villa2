'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Booking {
  id: string
  villa_id: string
  villa_name: string
  villa_location: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

interface AccountBookingsProps {
  userId: string
}

export function AccountBookings({ userId }: AccountBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [userId])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          villa_id,
          check_in,
          check_out,
          guests,
          total_price,
          status,
          created_at,
          villas (
            name,
            location
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookings:', error)
      } else {
        const formattedBookings = data?.map(booking => ({
          id: booking.id,
          villa_id: booking.villa_id,
          villa_name: booking.villas?.name || 'Villa tidak ditemukan',
          villa_location: booking.villas?.location || '',
          check_in: booking.check_in,
          check_out: booking.check_out,
          guests: booking.guests,
          total_price: booking.total_price,
          status: booking.status,
          created_at: booking.created_at,
        })) || []

        setBookings(formattedBookings)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu Konfirmasi' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Dikonfirmasi' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Selesai' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Booking</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Booking</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada booking
          </h3>
          <p className="text-gray-600">
            Anda belum memiliki riwayat booking villa.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {booking.villa_name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.villa_location}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(booking.status)}
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Check-in</div>
                    <div className="font-medium">
                      {new Date(booking.check_in).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Check-out</div>
                    <div className="font-medium">
                      {new Date(booking.check_out).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-600">Tamu</div>
                    <div className="font-medium">{booking.guests} orang</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Booking ID: {booking.id.slice(0, 8)}...
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="font-semibold text-lg text-yellow-600">
                    Rp{booking.total_price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Dibuat pada: {new Date(booking.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
