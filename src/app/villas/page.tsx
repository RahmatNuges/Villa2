import { Suspense } from 'react'
import { VillaCard } from '@/components/villa/villa-card'
import { VillaFilters } from '@/components/villa/villa-filters'
import { supabase } from '@/lib/supabase'
import { Search, MapPin, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VillasPageProps {
  searchParams: Promise<{
    checkIn?: string
    checkOut?: string
    guests?: string
    location?: string
    bedrooms?: string
    priceMin?: string
    priceMax?: string
  }>
}

async function getVillas(searchParams: VillasPageProps['searchParams']) {
  const params = await searchParams
  let query = supabase
    .from('villas')
    .select(`
      id,
      slug,
      name,
      location,
      bedrooms,
      bathrooms,
      max_guests,
      base_price,
      rating_average,
      images (
        url,
        alt
      )
    `)

  // Apply filters
  if (params.location) {
    query = query.ilike('location', `%${params.location}%`)
  }

  if (params.bedrooms) {
    query = query.gte('bedrooms', parseInt(params.bedrooms))
  }

  if (params.priceMin) {
    query = query.gte('base_price', parseInt(params.priceMin))
  }

  if (params.priceMax) {
    query = query.lte('base_price', parseInt(params.priceMax))
  }

  if (params.guests) {
    query = query.gte('max_guests', parseInt(params.guests))
  }

  const { data: villas, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching villas:', error)
    return []
  }

  return villas || []
}

export default async function VillasPage({ searchParams }: VillasPageProps) {
  const villas = await getVillas(searchParams)
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Temukan Villa Impian Anda
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Pilihan villa mewah terbaik di Bali dengan fasilitas lengkap dan lokasi strategis
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <VillaFilters searchParams={params} />
        </div>
      </section>

      {/* Villa Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">
                {villas.length} Villa Tersedia
              </h2>
              <p className="text-gray-600">
                {params.location && `Lokasi: ${params.location}`}
                {params.guests && ` • ${params.guests} tamu`}
                {params.checkIn && params.checkOut && 
                  ` • ${params.checkIn} - ${params.checkOut}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Villa Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            {villas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {villas.map((villa) => (
                  <VillaCard key={villa.id} villa={villa} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak ada villa yang ditemukan
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Coba ubah filter pencarian Anda atau hubungi kami untuk bantuan.
                  </p>
                  <Button>
                    Reset Filter
                  </Button>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  )
}
