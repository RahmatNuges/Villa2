import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const calculatePriceSchema = z.object({
  villa_id: z.string().uuid(),
  check_in: z.string().min(1, 'Tanggal check-in harus diisi'),
  check_out: z.string().min(1, 'Tanggal check-out harus diisi'),
  guests: z.number().min(1, 'Jumlah tamu minimal 1'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = calculatePriceSchema.parse(body)
    
    // Get villa details
    const { data: villa, error: villaError } = await supabase
      .from('villas')
      .select('id, name, base_price, max_guests')
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
    
    // Calculate number of nights
    const checkInDate = new Date(validatedData.check_in)
    const checkOutDate = new Date(validatedData.check_out)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) {
      return NextResponse.json(
        { error: 'Tanggal check-out harus setelah tanggal check-in' },
        { status: 400 }
      )
    }
    
    // Get pricing rules for the date range
    const { data: pricingRules, error: pricingError } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('villa_id', validatedData.villa_id)
      .lte('starts_on', validatedData.check_out)
      .gte('ends_on', validatedData.check_in)
    
    if (pricingError) {
      console.error('Error fetching pricing rules:', pricingError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat menghitung harga' },
        { status: 500 }
      )
    }
    
    // Calculate base price
    let totalPrice = villa.base_price * nights
    
    // Apply pricing rules
    if (pricingRules && pricingRules.length > 0) {
      // Use the first rule found
      const rule = pricingRules[0]
      
      if (rule.type === 'percentage') {
        totalPrice = totalPrice * (1 + rule.value / 100)
      } else if (rule.type === 'flat') {
        totalPrice = totalPrice + (rule.value * nights)
      }
    }
    
    // Check for blackout dates
    const { data: blackoutDates, error: blackoutError } = await supabase
      .from('blackout_dates')
      .select('*')
      .eq('villa_id', validatedData.villa_id)
      .gte('date', validatedData.check_in)
      .lte('date', validatedData.check_out)
    
    if (blackoutError) {
      console.error('Error checking blackout dates:', blackoutError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat memeriksa ketersediaan' },
        { status: 500 }
      )
    }
    
    if (blackoutDates && blackoutDates.length > 0) {
      return NextResponse.json(
        { error: 'Villa tidak tersedia untuk tanggal yang dipilih' },
        { status: 409 }
      )
    }
    
    // Check for existing bookings
    const { data: existingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id')
      .eq('villa_id', validatedData.villa_id)
      .eq('status', 'confirmed')
      .or(`and(start_date.lte.${validatedData.check_out},end_date.gte.${validatedData.check_in})`)
    
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
    
    // Calculate breakdown
    const basePricePerNight = villa.base_price
    const subtotal = basePricePerNight * nights
    const adjustments = totalPrice - subtotal
    
    return NextResponse.json({
      success: true,
      pricing: {
        villa_name: villa.name,
        check_in: validatedData.check_in,
        check_out: validatedData.check_out,
        nights,
        guests: validatedData.guests,
        base_price_per_night: basePricePerNight,
        subtotal,
        adjustments,
        total_price: Math.round(totalPrice),
        breakdown: {
          base_price: subtotal,
          adjustments: adjustments,
          total: Math.round(totalPrice),
        }
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
