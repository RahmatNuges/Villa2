import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email'
import { z } from 'zod'

const bookingSchema = z.object({
  villa_id: z.string().uuid(),
  guest_name: z.string().min(1, 'Nama tamu harus diisi'),
  guest_email: z.string().email('Email tidak valid'),
  guest_phone: z.string().min(1, 'Nomor telepon harus diisi'),
  check_in: z.string().min(1, 'Tanggal check-in harus diisi'),
  check_out: z.string().min(1, 'Tanggal check-out harus diisi'),
  guests: z.number().min(1, 'Jumlah tamu minimal 1'),
  total_price: z.number().min(0, 'Total harga tidak valid'),
  special_requests: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = bookingSchema.parse(body)
    
    // Check if villa exists
    const { data: villa, error: villaError } = await supabase
      .from('villas')
      .select('id, name, max_guests')
      .eq('id', validatedData.villa_id)
      .single()
    
    if (villaError || !villa) {
      return NextResponse.json(
        { error: 'Villa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    // Check if guests exceed villa capacity
    if (validatedData.guests > villa.max_guests) {
      return NextResponse.json(
        { error: `Jumlah tamu melebihi kapasitas villa (maksimal ${villa.max_guests} tamu)` },
        { status: 400 }
      )
    }
    
    // Check for date conflicts
    const { data: existingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('villa_id', validatedData.villa_id)
      .eq('status', 'confirmed')
      .or(`and(check_in.lte.${validatedData.check_out},check_out.gte.${validatedData.check_in})`)
    
    if (conflictError) {
      console.error('Error checking booking conflicts:', conflictError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat memeriksa ketersediaan' },
        { status: 500 }
      )
    }
    
    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Villa tidak tersedia untuk tanggal yang dipilih' },
        { status: 409 }
      )
    }
    
    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        villa_id: validatedData.villa_id,
        guest_name: validatedData.guest_name,
        guest_email: validatedData.guest_email,
        guest_phone: validatedData.guest_phone,
        check_in: validatedData.check_in,
        check_out: validatedData.check_out,
        guests: validatedData.guests,
        total_price: validatedData.total_price,
        special_requests: validatedData.special_requests,
        status: 'confirmed', // Instant book
        booking_reference: `VIL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      })
      .select()
      .single()
    
    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { error: 'Gagal membuat booking' },
        { status: 500 }
      )
    }
    
    // Send email notifications
    const emailData = {
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      villa_name: villa.name,
      booking_reference: booking.booking_reference,
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      total_price: booking.total_price,
      special_requests: booking.special_requests,
    }

    // Send confirmation email to guest
    const guestEmailResult = await sendBookingConfirmationEmail(emailData)
    if (!guestEmailResult.success) {
      console.error('Failed to send guest confirmation email:', guestEmailResult.error)
    }

    // Send notification email to admin
    const adminEmailResult = await sendAdminNotificationEmail(emailData)
    if (!adminEmailResult.success) {
      console.error('Failed to send admin notification email:', adminEmailResult.error)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        booking_reference: booking.booking_reference,
        villa_name: villa.name,
        guest_name: booking.guest_name,
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: booking.guests,
        total_price: booking.total_price,
        status: booking.status,
      },
      emailNotifications: {
        guest: guestEmailResult.success,
        admin: adminEmailResult.success,
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const bookingRef = searchParams.get('reference')
    
    if (!email && !bookingRef) {
      return NextResponse.json(
        { error: 'Email atau booking reference diperlukan' },
        { status: 400 }
      )
    }
    
    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_reference,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        guests,
        total_price,
        status,
        special_requests,
        created_at,
        villas (
          id,
          name,
          location,
          images (
            url,
            alt
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    if (email) {
      query = query.eq('guest_email', email)
    }
    
    if (bookingRef) {
      query = query.eq('booking_reference', bookingRef)
    }
    
    const { data: bookings, error } = await query
    
    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json(
        { error: 'Gagal mengambil data booking' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ bookings: bookings || [] })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
