import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  rating: number
  content: string
  created_at: string
}

interface VillaReviewsProps {
  testimonials: Testimonial[] | null
}

export function VillaReviews({ testimonials }: VillaReviewsProps) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-[#111827] mb-4">Ulasan Tamu</h2>
        <p className="text-gray-500 text-center py-8">
          Belum ada ulasan untuk villa ini. Jadilah yang pertama memberikan ulasan!
        </p>
      </div>
    )
  }

  const averageRating = testimonials.reduce((acc, review) => acc + review.rating, 0) / testimonials.length

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111827]">Ulasan Tamu</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageRating.toFixed(1)} ({testimonials.length} ulasan)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-6 w-6 text-[#D4AF37] opacity-20" />
              <p className="text-gray-700 leading-relaxed pl-4">
                "{testimonial.content}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length > 3 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full text-[#D4AF37] hover:text-[#B8941F] font-medium">
            Lihat Semua Ulasan ({testimonials.length})
          </button>
        </div>
      )}
    </div>
  )
}
