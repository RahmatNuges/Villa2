import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { VillaCard } from '@/components/villa/villa-card'

async function getVillas() {
  const { data: villas, error } = await supabase
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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching villas:', error)
    return []
  }

  return villas || []
}

export default async function GalleryPage() {
  const villas = await getVillas()

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Galeri Villa
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Jelajahi koleksi villa mewah kami dengan pemandangan terbaik
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {villas.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada villa
              </h3>
              <p className="text-gray-600">
                Villa akan segera ditambahkan ke galeri kami.
              </p>
            </div>
          ) : (
            <>
              {/* Villa Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {villas.map((villa) => (
                  <VillaCard key={villa.id} villa={villa} />
                ))}
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-[#111827] mb-4">
                    Ingin Melihat Lebih Detail?
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Pilih villa yang menarik dan lihat detail lengkap beserta fasilitas yang tersedia.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/villas"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
                    >
                      Lihat Semua Villa
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Hubungi Kami
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
