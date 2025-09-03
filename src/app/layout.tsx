import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StructuredData } from '@/components/seo/structured-data'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'NamaBrandVilla - Villa Mewah di Bali',
    template: '%s | NamaBrandVilla'
  },
  description: 'Nikmati pengalaman menginap villa mewah di Bali dengan fasilitas lengkap dan pelayanan terbaik. Booking villa luxury dengan harga terbaik.',
  keywords: ['villa bali', 'villa mewah', 'villa luxury', 'sewa villa', 'villa seminyak', 'villa ubud'],
  authors: [{ name: 'NamaBrandVilla' }],
  creator: 'NamaBrandVilla',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://namabrandvilla.com',
    title: 'NamaBrandVilla - Villa Mewah di Bali',
    description: 'Nikmati pengalaman menginap villa mewah di Bali dengan fasilitas lengkap dan pelayanan terbaik.',
    siteName: 'NamaBrandVilla',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NamaBrandVilla - Villa Mewah di Bali',
    description: 'Nikmati pengalaman menginap villa mewah di Bali dengan fasilitas lengkap dan pelayanan terbaik.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}