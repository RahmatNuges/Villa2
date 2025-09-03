import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    const isPrimary = formData.get('isPrimary') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Check if villa exists
    const { data: villa, error: villaError } = await supabase
      .from('villas')
      .select('id, name')
      .eq('id', id)
      .single()

    if (villaError || !villa) {
      return NextResponse.json(
        { error: 'Villa tidak ditemukan' },
        { status: 404 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `villas/${id}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('villa-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Gagal mengupload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('villa-images')
      .getPublicUrl(filePath)

    // If this is set as primary, unset other primary images
    if (isPrimary) {
      await supabase
        .from('villa_images')
        .update({ is_primary: false })
        .eq('villa_id', id)
    }

    // Save image record to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('villa_images')
      .insert({
        villa_id: id,
        url: urlData.publicUrl,
        alt: alt || file.name,
        is_primary: isPrimary,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving image record:', dbError)
      // Try to delete the uploaded file
      await supabase.storage
        .from('villa-images')
        .remove([filePath])
      
      return NextResponse.json(
        { error: 'Gagal menyimpan data gambar' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: imageRecord
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: images, error } = await supabase
      .from('villa_images')
      .select('*')
      .eq('villa_id', id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching images:', error)
      return NextResponse.json(
        { error: 'Gagal mengambil data gambar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ images: images || [] })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
