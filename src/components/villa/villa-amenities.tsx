import { 
  Wifi, 
  Coffee, 
  Utensils, 
  Car, 
  Waves, 
  Tv, 
  Wind, 
  Droplets,
  Bed,
  Bath,
  Users,
  MapPin
} from 'lucide-react'

interface VillaAmenitiesProps {
  amenities: string[] | null
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  breakfast: Coffee,
  kitchen: Utensils,
  parking: Car,
  pool: Waves,
  tv: Tv,
  ac: Wind,
  shower: Droplets,
  bedroom: Bed,
  bathroom: Bath,
  guests: Users,
  location: MapPin,
}

export function VillaAmenities({ amenities }: VillaAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#111827] mb-6">Fasilitas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => {
          const Icon = amenityIcons[amenity.toLowerCase()]
          
          return (
            <div key={index} className="flex items-center space-x-3">
              {Icon ? (
                <Icon className="h-5 w-5 text-[#D4AF37]" />
              ) : (
                <div className="h-5 w-5 bg-[#D4AF37] rounded-full" />
              )}
              <span className="text-gray-700 capitalize">
                {amenity.replace('_', ' ')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
