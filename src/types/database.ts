export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          role: 'admin' | 'guest'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          role?: 'admin' | 'guest'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          role?: 'admin' | 'guest'
          created_at?: string
          updated_at?: string
        }
      }
      villas: {
        Row: {
          id: string
          slug: string
          name: string
          location: string | null
          bedrooms: number
          bathrooms: number
          max_guests: number
          base_price: number
          description: string
          amenities: string[]
          rating_average: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          location?: string | null
          bedrooms: number
          bathrooms: number
          max_guests: number
          base_price: number
          description: string
          amenities?: string[]
          rating_average?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          location?: string | null
          bedrooms?: number
          bathrooms?: number
          max_guests?: number
          base_price?: number
          description?: string
          amenities?: string[]
          rating_average?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          villa_id: string
          url: string
          alt: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          villa_id: string
          url: string
          alt?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          villa_id?: string
          url?: string
          alt?: string | null
          order_index?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          villa_id: string
          user_id: string | null
          start_date: string
          end_date: string
          guests: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          villa_id: string
          user_id?: string | null
          start_date: string
          end_date: string
          guests: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          villa_id?: string
          user_id?: string | null
          start_date?: string
          end_date?: string
          guests?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
      }
      pricing_rules: {
        Row: {
          id: string
          villa_id: string
          starts_on: string
          ends_on: string
          type: 'percentage' | 'flat'
          value: number
          min_nights: number | null
          max_nights: number | null
          created_at: string
        }
        Insert: {
          id?: string
          villa_id: string
          starts_on: string
          ends_on: string
          type: 'percentage' | 'flat'
          value: number
          min_nights?: number | null
          max_nights?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          villa_id?: string
          starts_on?: string
          ends_on?: string
          type?: 'percentage' | 'flat'
          value?: number
          min_nights?: number | null
          max_nights?: number | null
          created_at?: string
        }
      }
      blackout_dates: {
        Row: {
          id: string
          villa_id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          villa_id: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          villa_id?: string
          date?: string
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          villa_id: string
          name: string
          rating: number
          content: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          villa_id: string
          name: string
          rating: number
          content: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          villa_id?: string
          name?: string
          rating?: number
          content?: string
          approved?: boolean
          created_at?: string
        }
      }
    }
  }
}
