'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Users, MapPin, Bed, DollarSign, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface VillaFiltersProps {
  searchParams: {
    checkIn?: string
    checkOut?: string
    guests?: string
    location?: string
    bedrooms?: string
    priceMin?: string
    priceMax?: string
  }
}

export function VillaFilters({ searchParams }: VillaFiltersProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const [filters, setFilters] = useState({
    checkIn: searchParams.checkIn || '',
    checkOut: searchParams.checkOut || '',
    guests: searchParams.guests || '',
    location: searchParams.location || '',
    bedrooms: searchParams.bedrooms || '',
    priceMin: searchParams.priceMin || '',
    priceMax: searchParams.priceMax || '',
  })

  const today = new Date().toISOString().split('T')[0]

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`/villas?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      checkIn: '',
      checkOut: '',
      guests: '',
      location: '',
      bedrooms: '',
      priceMin: '',
      priceMax: '',
    })
    router.push('/villas')
  }

  const hasActiveFilters = Object.values(filters).some(value => value)

  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleFilterChange('checkIn', e.target.value)}
              min={today}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleFilterChange('checkOut', e.target.value)}
              min={filters.checkIn || today}
              className="pl-10"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tamu</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.guests}
              onChange={(e) => handleFilterChange('guests', e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
            >
              <option value="">Semua</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Tamu' : 'Tamu'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 opacity-0">Search</label>
          <Button onClick={applyFilters} className="w-full h-10">
            <Search className="h-4 w-4 mr-2" />
            Cari Villa
          </Button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#D4AF37] hover:text-[#B8941F] font-medium"
        >
          {isExpanded ? 'Sembunyikan' : 'Tampilkan'} Filter Lanjutan
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Hapus Filter
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Seminyak, Ubud, dll"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kamar Tidur</label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
              >
                <option value="">Semua</option>
                {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}+ Kamar
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Harga per Malam</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="pl-10"
                  type="number"
                />
              </div>
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="pl-10"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            
            let label = ''
            switch (key) {
              case 'checkIn':
                label = `Check-in: ${value}`
                break
              case 'checkOut':
                label = `Check-out: ${value}`
                break
              case 'guests':
                label = `${value} Tamu`
                break
              case 'location':
                label = `Lokasi: ${value}`
                break
              case 'bedrooms':
                label = `${value}+ Kamar`
                break
              case 'priceMin':
                label = `Min: Rp${parseInt(value).toLocaleString()}`
                break
              case 'priceMax':
                label = `Max: Rp${parseInt(value).toLocaleString()}`
                break
            }

            return (
              <div
                key={key}
                className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm flex items-center"
              >
                {label}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 hover:text-[#B8941F]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
