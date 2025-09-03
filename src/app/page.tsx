import { Suspense } from 'react'
import { BookingForm } from '@/components/forms/booking-form'
import { VillaCard } from '@/components/villa/villa-card'
import { supabase } from '@/lib/supabase'
import { Star, Shield, Heart, Award } from 'lucide-react'

async function getFeaturedVillas() {
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
    .limit(4)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching villas:', error)
    return []
  }

  return villas || []
}

export default async function HomePage() {
  const featuredVillas = await getFeaturedVillas()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-balance">
              Nikmati Kemewahan
              <span className="text-[#D4AF37] block">Villa di Bali</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pengalaman menginap villa mewah yang tak terlupakan dengan fasilitas lengkap, 
              pelayanan terbaik, dan pemandangan menakjubkan di Pulau Dewata.
            </p>
            
            {/* Booking Form */}
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<div className="h-24 bg-white/10 rounded-lg animate-pulse"></div>}>
                <BookingForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-[#111827] mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan pengalaman menginap villa terbaik dengan standar internasional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Kualitas Premium</h3>
              <p className="text-gray-600 text-sm">
                Villa mewah dengan fasilitas lengkap dan standar internasional
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#14B8A6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#14B8A6]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600 text-sm">
                Booking aman dengan sistem pembayaran yang terjamin keamanannya
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pelayanan Terbaik</h3>
              <p className="text-gray-600 text-sm">
                Tim customer service siap membantu 24/7 untuk kebutuhan Anda
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#14B8A6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[#14B8A6]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Terpercaya</h3>
              <p className="text-gray-600 text-sm">
                Ribuan tamu puas telah mempercayai layanan villa kami
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Villas Section */}
      <section className="py-16 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-[#111827] mb-4">
              Villa Unggulan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilihan villa mewah terbaik dengan lokasi strategis dan fasilitas lengkap
            </p>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVillas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          </Suspense>

          <div className="text-center mt-12">
            <a
              href="/villas"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
            >
              Lihat Semua Villa
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Siap untuk Pengalaman Tak Terlupakan?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Booking villa mewah Anda sekarang dan nikmati liburan sempurna di Bali
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/villas"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#111827] bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
            >
              Cari Villa
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-[#D4AF37] text-base font-medium rounded-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111827] transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}