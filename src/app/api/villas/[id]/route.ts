import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
        slug,
        name,
        description,
        location,
        bedrooms,
        bathrooms,
        max_guests,
        base_price,
        rating_average,
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
