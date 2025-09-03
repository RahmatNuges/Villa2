import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NamaBrandVilla'

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">
              {siteName}
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Pengalaman menginap villa mewah yang tak terlupakan di Bali. 
              Nikmati kemewahan dan kenyamanan dengan pelayanan terbaik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H7.83v9.781h8.449V7.207z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/villas" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Villa
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Testimoni
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Kebijakan
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {siteName}. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/policies" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/policies" className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
