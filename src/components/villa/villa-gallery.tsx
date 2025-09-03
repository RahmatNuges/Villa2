'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface VillaImage {
  id: string
  url: string
  alt: string
}

interface VillaGalleryProps {
  images: VillaImage[]
  villaName: string
}

export function VillaGallery({ images, villaName }: VillaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  
  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Tidak ada gambar tersedia</p>
      </div>
    )
  }

  const primaryImage = images[0]
  const otherImages = images.filter(img => img.id !== primaryImage.id).slice(0, 4)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div className="md:col-span-2 relative group cursor-pointer">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || `${villaName} - Main`}
            fill
            className="object-cover rounded-l-lg"
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div 
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-l-lg cursor-pointer"
            onClick={() => setSelectedImage(0)}
          />
        </div>

        {/* Thumbnail Images */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {otherImages.map((image, index) => (
            <div key={image.id} className="relative group cursor-pointer">
              <Image
                src={image.url}
                alt={image.alt || `${villaName} - ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedImage(index + 1)}
              />
            </div>
          ))}
          
          {/* Show more indicator if there are more images */}
          {images.length > 5 && (
            <div className="relative group cursor-pointer">
              <Image
                src={otherImages[3]?.url || primaryImage.url}
                alt={`${villaName} - More`}
                fill
                className="object-cover"
                loading="lazy"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedImage(5)}
              >
                <span className="text-white font-medium text-lg">
                  +{images.length - 5}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Main Image */}
            <div className="relative h-96 md:h-[600px]">
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || `${villaName} - ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
