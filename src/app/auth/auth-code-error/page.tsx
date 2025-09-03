import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-[#111827] mb-4">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, terjadi kesalahan saat proses autentikasi. Silakan coba lagi.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full">
                Coba Login Lagi
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
