import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const villaUpdateSchema = z.object({
  name: z.string().min(1, 'Nama villa harus diisi').optional(),
  slug: z.string().min(1, 'Slug villa harus diisi').optional(),
  description: z.string().min(1, 'Deskripsi villa harus diisi').optional(),
  location: z.string().min(1, 'Lokasi villa harus diisi').optional(),
  bedrooms: z.number().min(1, 'Jumlah kamar minimal 1').optional(),
  bathrooms: z.number().min(1, 'Jumlah kamar mandi minimal 1').optional(),
  max_guests: z.number().min(1, 'Jumlah tamu maksimal minimal 1').optional(),
  base_price: z.number().min(0, 'Harga dasar tidak boleh negatif').optional(),
  amenities: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: villa, error } = await supabase
      .from('villas')
      .select(`
        id,
        name,
        slug,
        description,
        location,
        bedrooms,
        bathrooms,
        max_guests,
        base_price,
        amenities,
        features,
        rating_average,
        created_at,
        updated_at,
        images (
          id,
          url,
          alt,
          is_primary
        )
      `)
      .eq('id', id)
      .single()
    
    if (error || !villa) {
      return NextResponse.json(
        { error: 'Villa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ villa })
    
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
    
    // Validate request body
    const validatedData = villaUpdateSchema.parse(body)
    
    // Check if villa exists
    const { data: existingVilla, error: fetchError } = await supabase
      .from('villas')
      .select('id')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingVilla) {
      return NextResponse.json(
        { error: 'Villa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    // Check if slug already exists (if slug is being updated)
    if (validatedData.slug) {
      const { data: slugExists } = await supabase
        .from('villas')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', id)
        .single()
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug villa sudah digunakan' },
          { status: 409 }
        )
      }
    }
    
    // Update villa
    const { data: villa, error } = await supabase
      .from('villas')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating villa:', error)
      return NextResponse.json(
        { error: 'Gagal mengupdate villa' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      villa
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if villa exists
    const { data: existingVilla, error: fetchError } = await supabase
      .from('villas')
      .select('id, name')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingVilla) {
      return NextResponse.json(
        { error: 'Villa tidak ditemukan' },
        { status: 404 }
      )
    }
    
    // Check if villa has active bookings
    const { data: activeBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('villa_id', id)
      .in('status', ['confirmed', 'pending'])
      .limit(1)
    
    if (bookingError) {
      console.error('Error checking bookings:', bookingError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat memeriksa booking' },
        { status: 500 }
      )
    }
    
    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus villa yang memiliki booking aktif' },
        { status: 409 }
      )
    }
    
    // Delete villa images first
    const { error: imageError } = await supabase
      .from('villa_images')
      .delete()
      .eq('villa_id', id)
    
    if (imageError) {
      console.error('Error deleting villa images:', imageError)
      // Continue with villa deletion even if image deletion fails
    }
    
    // Delete villa
    const { error } = await supabase
      .from('villas')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting villa:', error)
      return NextResponse.json(
        { error: 'Gagal menghapus villa' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Villa "${existingVilla.name}" berhasil dihapus`
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
