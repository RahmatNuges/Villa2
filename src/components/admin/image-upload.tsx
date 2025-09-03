'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Star, Edit2, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VillaImage {
  id: string
  url: string
  alt: string | null
  is_primary: boolean
  file_size: number
  file_type: string
  created_at: string
}

interface ImageUploadProps {
  villaId: string
  onImagesChange?: (images: VillaImage[]) => void
}

export function ImageUpload({ villaId, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<VillaImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ alt: '', isPrimary: false })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing images
  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/villas/${villaId}/images`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil gambar')
      }

      setImages(data.images)
      if (onImagesChange) {
        onImagesChange(data.images)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  // Upload new image
  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('Ukuran file terlalu besar. Maksimal 5MB')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', file.name)
      formData.append('isPrimary', 'false')

      const response = await fetch(`/api/admin/villas/${villaId}/images`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupload gambar')
      }

      // Refresh images list
      await fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsUploading(false)
    }
  }

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/villas/${villaId}/images/${imageId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus gambar')
      }

      // Refresh images list
      await fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  // Update image
  const handleUpdateImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/villas/${villaId}/images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupdate gambar')
      }

      setEditingImage(null)
      setEditForm({ alt: '', isPrimary: false })
      await fetchImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  // Start editing image
  const startEditing = (image: VillaImage) => {
    setEditingImage(image.id)
    setEditForm({
      alt: image.alt || '',
      isPrimary: image.is_primary,
    })
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingImage(null)
    setEditForm({ alt: '', isPrimary: false })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Load images on component mount
  useState(() => {
    fetchImages()
  })

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Upload Gambar Villa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file)
                  }
                }}
                className="hidden"
              />
              
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mr-2" />
                  <span className="text-gray-600">Mengupload gambar...</span>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    JPG, PNG, WebP (maksimal 5MB)
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Pilih File
                  </Button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images List */}
      <Card>
        <CardHeader>
          <CardTitle>Gambar Villa ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600">Memuat gambar...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada gambar yang diupload</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.alt || 'Villa image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Utama
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startEditing(image)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.alt || 'Tanpa judul'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.file_size)} • {image.file_type.split('/')[1].toUpperCase()}
                    </p>
                  </div>

                  {/* Edit Form */}
                  {editingImage === image.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Alt Text</label>
                          <Input
                            value={editForm.alt}
                            onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                            placeholder="Deskripsi gambar"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`primary-${image.id}`}
                            checked={editForm.isPrimary}
                            onChange={(e) => setEditForm(prev => ({ ...prev, isPrimary: e.target.checked }))}
                            className="mr-2"
                          />
                          <label htmlFor={`primary-${image.id}`} className="text-sm text-gray-700">
                            Jadikan gambar utama
                          </label>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateImage(image.id)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            Simpan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
