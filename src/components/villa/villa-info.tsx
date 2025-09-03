import { MapPin, Users, Bed, Bath, Car, Wifi, Coffee, Utensils } from 'lucide-react'

interface VillaInfoProps {
  villa: {
    name: string
    description: string
    location: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    parking_spaces: number
    wifi: boolean
    breakfast: boolean
    kitchen: boolean
  }
}

export function VillaInfo({ villa }: VillaInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#111827] mb-4">Tentang Villa Ini</h2>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed mb-6">
          {villa.description}
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <div className="text-sm text-gray-600">Kapasitas</div>
            <div className="font-medium">{villa.max_guests} Tamu</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Bed className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <div className="text-sm text-gray-600">Kamar Tidur</div>
            <div className="font-medium">{villa.bedrooms} Kamar</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Bath className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <div className="text-sm text-gray-600">Kamar Mandi</div>
            <div className="font-medium">{villa.bathrooms} Kamar</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-[#D4AF37]" />
          <div>
            <div className="text-sm text-gray-600">Parkir</div>
            <div className="font-medium">{villa.parking_spaces} Mobil</div>
          </div>
        </div>
      </div>

      {/* Amenities Icons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-[#111827] mb-3">Fasilitas</h3>
        <div className="flex flex-wrap gap-4">
          {villa.wifi && (
            <div className="flex items-center space-x-2 text-sm">
              <Wifi className="h-4 w-4 text-[#D4AF37]" />
              <span>WiFi Gratis</span>
            </div>
          )}
          
          {villa.breakfast && (
            <div className="flex items-center space-x-2 text-sm">
              <Coffee className="h-4 w-4 text-[#D4AF37]" />
              <span>Sarapan</span>
            </div>
          )}
          
          {villa.kitchen && (
            <div className="flex items-center space-x-2 text-sm">
              <Utensils className="h-4 w-4 text-[#D4AF37]" />
              <span>Dapur</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
