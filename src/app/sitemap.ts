import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://villa-rental.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/villas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Fetch villa pages
    const { data: villas, error } = await supabase
      .from('villas')
      .select('slug, updated_at')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching villas for sitemap:', error)
      return staticPages
    }

    const villaPages: MetadataRoute.Sitemap = (villas || []).map((villa) => ({
      url: `${baseUrl}/villas/${villa.slug}`,
      lastModified: new Date(villa.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...villaPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
