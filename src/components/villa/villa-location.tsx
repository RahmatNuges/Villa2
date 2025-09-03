import { MapPin, Navigation } from 'lucide-react'

interface VillaLocationProps {
  location: string
}

export function VillaLocation({ location }: VillaLocationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#111827] mb-4">Lokasi</h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-[#D4AF37] mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">{location}</h3>
            <p className="text-gray-600 text-sm mt-1">
              Lokasi strategis dengan akses mudah ke berbagai destinasi wisata
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Jarak ke Destinasi Populer:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pantai terdekat</span>
              <span className="text-gray-600">5-10 menit</span>
            </div>
            <div className="flex justify-between">
              <span>Restoran & Cafe</span>
              <span className="text-gray-600">2-5 menit</span>
            </div>
            <div className="flex justify-between">
              <span>Pusat perbelanjaan</span>
              <span className="text-gray-600">10-15 menit</span>
            </div>
            <div className="flex justify-between">
              <span>Bandara Ngurah Rai</span>
              <span className="text-gray-600">20-30 menit</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <Navigation className="h-4 w-4" />
          <span>Lihat di Peta</span>
        </button>
      </div>
    </div>
  )
}
