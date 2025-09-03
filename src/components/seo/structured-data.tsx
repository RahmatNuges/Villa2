interface Villa {
  id: string
  name: string
  description: string
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

interface StructuredDataProps {
  type: 'website' | 'villa' | 'organization'
  villa?: Villa
}

export function StructuredData({ type, villa }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://villa-rental.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Villa Rental'

  const getWebsiteData = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: 'Nikmati pengalaman menginap villa mewah di Bali dengan fasilitas lengkap dan pelayanan terbaik.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/villas?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  })

  const getOrganizationData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Penyedia villa mewah di Bali dengan standar internasional',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: process.env.NEXT_PUBLIC_WA_NUMBER || '+62-812-3456-7890',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressRegion: 'Bali',
      addressLocality: 'Bali',
    },
    sameAs: [
      'https://www.instagram.com/villa-rental',
      'https://www.facebook.com/villa-rental',
    ],
  })

  const getVillaData = () => {
    if (!villa) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: villa.name,
      description: villa.description,
      url: `${baseUrl}/villas/${villa.id}`,
      image: villa.images.map(img => img.url),
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: 'Bali',
        addressLocality: villa.location || 'Bali',
      },
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Bedrooms',
          value: villa.bedrooms,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Bathrooms',
          value: villa.bathrooms,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Maximum Guests',
          value: villa.max_guests,
        },
      ],
      priceRange: `Rp${villa.base_price.toLocaleString()}`,
      aggregateRating: villa.rating_average ? {
        '@type': 'AggregateRating',
        ratingValue: villa.rating_average,
        reviewCount: 1,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: villa.base_price,
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
      },
    }
  }

  const getData = () => {
    switch (type) {
      case 'website':
        return getWebsiteData()
      case 'organization':
        return getOrganizationData()
      case 'villa':
        return getVillaData()
      default:
        return null
    }
  }

  const data = getData()

  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  )
}
