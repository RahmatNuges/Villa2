import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { VillaGallery } from '@/components/villa/villa-gallery'
import { VillaInfo } from '@/components/villa/villa-info'
import { VillaBooking } from '@/components/villa/villa-booking'
import { VillaAmenities } from '@/components/villa/villa-amenities'
import { VillaLocation } from '@/components/villa/villa-location'
import { VillaReviews } from '@/components/villa/villa-reviews'
import { StructuredData } from '@/components/seo/structured-data'

interface VillaDetailPageProps {
  params: {
    slug: string
  }
  searchParams: {
    checkIn?: string
    checkOut?: string
    guests?: string
  }
}

async function getVilla(slug: string) {
  // Get basic villa data first
  const { data: villa, error: villaError } = await supabase
    .from('villas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (villaError) {
    return null
  }

  if (!villa) {
    return null
  }

  // Get images separately
  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('id, url, alt')
    .eq('villa_id', villa.id)
    .order('order_index', { ascending: true })

  if (imagesError) {
    villa.images = []
  } else {
    villa.images = images || []
  }

  // Get testimonials separately
  const { data: testimonials, error: testimonialsError } = await supabase
    .from('testimonials')
    .select('id, name, rating, content, created_at')
    .eq('villa_id', villa.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (testimonialsError) {
    villa.testimonials = []
  } else {
    villa.testimonials = testimonials || []
  }

  return villa
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const villa = await getVilla(params.slug)
  
  if (!villa) {
    return {
      title: 'Villa Tidak Ditemukan',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://villa-rental.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Villa Rental'
  
  return {
    title: `${villa.name} - Villa Mewah di ${villa.location}`,
    description: villa.description || `Nikmati pengalaman menginap di ${villa.name}, villa mewah di ${villa.location} dengan ${villa.bedrooms} kamar tidur dan ${villa.bathrooms} kamar mandi. Harga mulai Rp${villa.base_price.toLocaleString()}/malam.`,
    keywords: [
      'villa bali',
      'villa mewah',
      villa.name.toLowerCase(),
      villa.location?.toLowerCase() || 'bali',
      'sewa villa',
      'villa luxury',
    ],
    openGraph: {
      title: `${villa.name} - Villa Mewah di ${villa.location}`,
      description: villa.description || `Villa mewah di ${villa.location} dengan fasilitas lengkap`,
      url: `${baseUrl}/villas/${villa.slug}`,
      siteName,
      images: villa.images?.map(img => ({
        url: img.url,
        alt: img.alt || villa.name,
      })) || [],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${villa.name} - Villa Mewah di ${villa.location}`,
      description: villa.description || `Villa mewah di ${villa.location} dengan fasilitas lengkap`,
      images: villa.images?.map(img => img.url) || [],
    },
    alternates: {
      canonical: `${baseUrl}/villas/${villa.slug}`,
    },
  }
}

export default async function VillaDetailPage({ params, searchParams }: VillaDetailPageProps) {
  const villa = await getVilla(params.slug)

  if (!villa) {
    notFound()
  }

  return (
    <>
      <StructuredData type="villa" villa={villa} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Gallery */}
        <section className="relative">
          <VillaGallery images={villa.images} villaName={villa.name} />
        </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Villa Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Villa Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-[#111827] mb-2">
                      {villa.name}
                    </h1>
                    <p className="text-gray-600 mb-4">
                      {villa.location} • {villa.bedrooms} kamar tidur • {villa.bathrooms} kamar mandi
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {villa.rating_average?.toFixed(1) || '4.5'} ({villa.testimonials?.length || 0} ulasan)
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Maksimal {villa.max_guests} tamu
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        Rp{villa.base_price?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">per malam</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Villa Description */}
              <VillaInfo villa={villa} />

              {/* Amenities */}
              <VillaAmenities amenities={villa.amenities} />

              {/* Location */}
              <VillaLocation location={villa.location} />

              {/* Reviews */}
              <VillaReviews testimonials={villa.testimonials} />
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <VillaBooking 
                  villa={villa}
                  checkIn={searchParams.checkIn}
                  checkOut={searchParams.checkOut}
                  guests={searchParams.guests}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
