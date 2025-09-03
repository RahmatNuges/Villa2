import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const villaSchema = z.object({
  name: z.string().min(1, 'Nama villa harus diisi'),
  slug: z.string().min(1, 'Slug villa harus diisi'),
  description: z.string().min(1, 'Deskripsi villa harus diisi'),
  location: z.string().min(1, 'Lokasi villa harus diisi'),
  bedrooms: z.number().min(1, 'Jumlah kamar minimal 1'),
  bathrooms: z.number().min(1, 'Jumlah kamar mandi minimal 1'),
  max_guests: z.number().min(1, 'Jumlah tamu maksimal minimal 1'),
  base_price: z.number().min(0, 'Harga dasar tidak boleh negatif'),
  amenities: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    let query = supabase
      .from('villas')
      .select(`
        id,
        name,
        slug,
        location,
        bedrooms,
        bathrooms,
        max_guests,
        base_price,
        rating_average,
        created_at,
        images (
          id,
          url,
          alt,
          is_primary
        )
      `, { count: 'exact' })

    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`)
    }

    const { data: villas, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error fetching villas:', error)
      return NextResponse.json(
        { error: 'Gagal mengambil data villa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      villas: villas || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = villaSchema.parse(body)
    
    // Check if slug already exists
    const { data: existingVilla } = await supabase
      .from('villas')
      .select('id')
      .eq('slug', validatedData.slug)
      .single()
    
    if (existingVilla) {
      return NextResponse.json(
        { error: 'Slug villa sudah digunakan' },
        { status: 409 }
      )
    }
    
    // Create villa
    const { data: villa, error } = await supabase
      .from('villas')
      .insert({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        location: validatedData.location,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        max_guests: validatedData.max_guests,
        base_price: validatedData.base_price,
        amenities: validatedData.amenities || [],
        features: validatedData.features || [],
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating villa:', error)
      return NextResponse.json(
        { error: 'Gagal membuat villa' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      villa
    }, { status: 201 })
    
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
