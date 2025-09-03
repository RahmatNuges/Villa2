import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[#D4AF37] mb-4">404</h1>
          <h2 className="text-2xl font-bold text-[#111827] mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak ditemukan atau mungkin sudah dipindahkan.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <Link href="/villas">
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Jelajahi Villa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
