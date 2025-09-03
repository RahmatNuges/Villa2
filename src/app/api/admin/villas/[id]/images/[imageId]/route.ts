import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params

    // Get image details
    const { data: image, error: fetchError } = await supabase
      .from('villa_images')
      .select('*')
      .eq('id', imageId)
      .eq('villa_id', id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('villa-images')
      .remove([image.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete image record from database
    const { error: dbError } = await supabase
      .from('villa_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      console.error('Error deleting image record:', dbError)
      return NextResponse.json(
        { error: 'Gagal menghapus data gambar' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gambar berhasil dihapus'
    })

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
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params
    const body = await request.json()
    const { alt, isPrimary } = body

    // Check if image exists
    const { data: existingImage, error: fetchError } = await supabase
      .from('villa_images')
      .select('*')
      .eq('id', imageId)
      .eq('villa_id', id)
      .single()

    if (fetchError || !existingImage) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 404 }
      )
    }

    // If setting as primary, unset other primary images
    if (isPrimary) {
      await supabase
        .from('villa_images')
        .update({ is_primary: false })
        .eq('villa_id', id)
        .neq('id', imageId)
    }

    // Update image record
    const { data: updatedImage, error: updateError } = await supabase
      .from('villa_images')
      .update({
        alt: alt,
        is_primary: isPrimary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', imageId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating image:', updateError)
      return NextResponse.json(
        { error: 'Gagal mengupdate gambar' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      image: updatedImage
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
