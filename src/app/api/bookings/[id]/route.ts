import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: booking, error } = await supabase
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
          bedrooms,
          bathrooms,
          max_guests,
          base_price,
          images (
            url,
            alt
          )
        )
      `)
      .eq('id', id)
      .single()
    
    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ booking })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Only allow updating status and special_requests
    const allowedUpdates = {
      status: body.status,
      special_requests: body.special_requests,
    }
    
    // Remove undefined values
    const updates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    )
    
    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error || !booking) {
      return NextResponse.json(
        { error: 'Gagal mengupdate booking' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ booking })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if booking exists and can be cancelled
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status, check_in')
      .eq('id', id)
      .single()
    
    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan' },
        { status: 404 }
      )
    }
    
    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking sudah dibatalkan' },
        { status: 400 }
      )
    }
    
    // Check if check-in date has passed
    const checkInDate = new Date(booking.check_in)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (checkInDate <= today) {
      return NextResponse.json(
        { error: 'Tidak dapat membatalkan booking yang sudah dimulai' },
        { status: 400 }
      )
    }
    
    // Update booking status to cancelled
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError || !updatedBooking) {
      return NextResponse.json(
        { error: 'Gagal membatalkan booking' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking berhasil dibatalkan',
      booking: updatedBooking 
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
