'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Bagaimana cara booking villa?",
    answer: "Anda dapat booking villa dengan cara: 1) Pilih villa yang diinginkan, 2) Pilih tanggal check-in dan check-out, 3) Pilih jumlah tamu, 4) Klik 'Instant Book via WhatsApp' atau 'Hubungi Kami', 5) Konfirmasi booking dengan tim kami."
  },
  {
    question: "Apakah ada biaya booking?",
    answer: "Tidak ada biaya booking. Anda hanya membayar harga villa sesuai dengan durasi menginap yang dipilih."
  },
  {
    question: "Kapan check-in dan check-out?",
    answer: "Check-in: 14:00 WITA, Check-out: 11:00 WITA. Untuk check-in lebih awal atau check-out lebih sore, silakan hubungi kami terlebih dahulu."
  },
  {
    question: "Apakah ada minimum stay?",
    answer: "Ya, minimum stay adalah 2 malam untuk weekday dan 3 malam untuk weekend dan hari libur nasional."
  },
  {
    question: "Bagaimana dengan pembayaran?",
    answer: "Pembayaran dapat dilakukan melalui transfer bank atau pembayaran di tempat. DP 50% saat booking, sisanya saat check-in."
  },
  {
    question: "Apakah villa memiliki WiFi?",
    answer: "Ya, semua villa kami dilengkapi dengan WiFi gratis dengan kecepatan tinggi."
  },
  {
    question: "Apakah ada cleaning service?",
    answer: "Ya, cleaning service harian termasuk dalam harga villa. Linen dan handuk akan diganti setiap hari."
  },
  {
    question: "Bagaimana dengan keamanan?",
    answer: "Semua villa kami dilengkapi dengan sistem keamanan 24 jam, CCTV, dan petugas keamanan yang berjaga."
  },
  {
    question: "Apakah ada dapur di villa?",
    answer: "Ya, semua villa dilengkapi dengan dapur lengkap termasuk peralatan memasak dan alat makan."
  },
  {
    question: "Bagaimana dengan transportasi dari bandara?",
    answer: "Kami menyediakan layanan transportasi dari bandara dengan biaya tambahan. Silakan hubungi kami untuk booking transportasi."
  },
  {
    question: "Apakah ada kolam renang?",
    answer: "Ya, semua villa kami dilengkapi dengan kolam renang pribadi dengan pemandangan yang indah."
  },
  {
    question: "Bagaimana jika ingin cancel booking?",
    answer: "Pembatalan dapat dilakukan maksimal 7 hari sebelum check-in dengan biaya administrasi 10%. Pembatalan kurang dari 7 hari tidak dapat dikembalikan."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar booking villa
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#111827] mb-8">FAQ</h2>
              
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-[#111827] pr-4">
                        {item.question}
                      </span>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {openItems.includes(index) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#111827] mb-4">
                Masih punya pertanyaan?
              </h3>
              <p className="text-gray-600 mb-6">
                Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk menghubungi kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
                >
                  Hubungi Kami
                </a>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
