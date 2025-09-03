import { supabase } from '@/lib/supabase'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  rating: number
  content: string
  created_at: string
  villa_name?: string
}

async function getTestimonials() {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select(`
        id,
        name,
        rating,
        content,
        created_at,
        villas (
          name
        )
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return testimonials?.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      rating: testimonial.rating,
      content: testimonial.content,
      created_at: testimonial.created_at,
      villa_name: testimonial.villas?.name,
    })) || []
  } catch (error) {
    return []
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length 
    : 0

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Testimonial Tamu
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Lihat pengalaman menginap tamu kami di villa-villa mewah
            </p>
            
            {/* Average Rating */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {averageRating.toFixed(1)} dari 5.0
              </span>
              <span className="text-gray-300">
                ({testimonials.length} ulasan)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada testimonial
              </h3>
              <p className="text-gray-600">
                Jadilah yang pertama memberikan testimonial setelah menginap di villa kami.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-[#111827]">
                        {testimonial.name}
                      </h3>
                      {testimonial.villa_name && (
                        <p className="text-sm text-gray-600">
                          Menginap di {testimonial.villa_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-[#D4AF37] opacity-20" />
                    <p className="text-gray-700 leading-relaxed pl-4">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-4">
                Ingin Memberikan Testimonial?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Setelah menginap di villa kami, bagikan pengalaman Anda untuk membantu tamu lain memilih villa yang tepat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/villas"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
                >
                  Booking Villa
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
        </div>
      </section>
    </div>
  )
}
