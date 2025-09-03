import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Bed, Bath, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface VillaCardProps {
  villa: {
    id: string
    slug: string
    name: string
    location: string | null
    bedrooms: number
    bathrooms: number
    max_guests: number
    base_price: number
    rating_average: number | null
    images: Array<{
      url: string
      alt: string | null
    }>
  }
}

export function VillaCard({ villa }: VillaCardProps) {
  const mainImage = villa.images[0] || {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    alt: villa.name
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={mainImage.url}
          alt={mainImage.alt || villa.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {villa.rating_average && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
            <span className="text-xs font-medium">{villa.rating_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Location */}
          {villa.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {villa.location}
            </div>
          )}

          {/* Villa Name */}
          <h3 className="font-heading text-xl font-semibold text-[#111827] group-hover:text-[#D4AF37] transition-colors">
            {villa.name}
          </h3>

          {/* Villa Details */}
          <div className="flex items-center space-x-4 text-gray-600 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {villa.max_guests} tamu
            </div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {villa.bedrooms} kamar
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {villa.bathrooms} kamar mandi
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-[#111827]">
                {formatCurrency(villa.base_price)}
              </span>
              <span className="text-gray-600 text-sm ml-1">/malam</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/villas/${villa.slug}`} className="block">
            <Button className="w-full">
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
