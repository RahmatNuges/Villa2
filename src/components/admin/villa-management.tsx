'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Eye, Calendar, Users, Bed, Bath } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Villa {
  id: string
  name: string
  slug: string
  location: string | null
  bedrooms: number
  bathrooms: number
  max_guests: number
  base_price: number
  rating_average: number | null
  created_at: string
  images: Array<{
    id: string
    url: string
    alt: string | null
    is_primary: boolean
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function VillaManagement() {
  const [villas, setVillas] = useState<Villa[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVillas = async (page = 1, searchTerm = '') => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/admin/villas?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data villa')
      }

      setVillas(data.villas)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVillas()
  }, [])

  const handleSearch = (value: string) => {
    setSearch(value)
    fetchVillas(1, value)
  }

  const handleDelete = async (villa: Villa) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus villa "${villa.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/villas/${villa.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus villa')
      }

      // Refresh the list
      fetchVillas(pagination.page, search)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Villa</h2>
          <p className="text-gray-600">Kelola data villa dan informasi terkait</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Villa
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari villa berdasarkan nama atau lokasi..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Villa List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data villa...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={() => fetchVillas()}>
            Coba Lagi
          </Button>
        </div>
      ) : villas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada villa</h3>
              <p className="text-sm">
                {search ? 'Tidak ada villa yang sesuai dengan pencarian Anda' : 'Belum ada villa yang ditambahkan'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villas.map((villa) => (
            <Card key={villa.id} className="overflow-hidden">
              {/* Villa Image */}
              <div className="relative h-48 bg-gray-200">
                {villa.images && villa.images.length > 0 ? (
                  <img
                    src={villa.images[0].url}
                    alt={villa.images[0].alt || villa.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Calendar className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900">
                    {villa.rating_average ? `${villa.rating_average.toFixed(1)} ⭐` : 'Baru'}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Villa Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {villa.name}
                  </h3>
                  {villa.location && (
                    <p className="text-sm text-gray-600 mb-2">{villa.location}</p>
                  )}
                  
                  {/* Villa Details */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {villa.max_guests}
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {villa.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {villa.bathrooms}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-yellow-600">
                    {formatCurrency(villa.base_price)}/malam
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Dibuat: {formatDate(villa.created_at)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/villas/${villa.slug}`, '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit villa functionality
                        // Edit villa functionality
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(villa)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchVillas(pagination.page - 1, search)}
            disabled={pagination.page === 1}
          >
            Sebelumnya
          </Button>
          
          <span className="text-sm text-gray-600">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchVillas(pagination.page + 1, search)}
            disabled={pagination.page === pagination.totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
              <div className="text-sm text-gray-600">Total Villa</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {villas.filter(v => v.rating_average && v.rating_average >= 4).length}
              </div>
              <div className="text-sm text-gray-600">Villa Rating Tinggi</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {villas.filter(v => v.images && v.images.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Villa dengan Foto</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
