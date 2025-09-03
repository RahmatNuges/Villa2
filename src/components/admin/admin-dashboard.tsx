'use client'

import { useState, useEffect } from 'react'
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  Plus, 
  Settings, 
  BarChart3,
  Building2,
  Image,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
  totalVillas: number
  totalBookings: number
  totalUsers: number
  totalRevenue: number
  pendingBookings: number
  confirmedBookings: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVillas: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // In a real app, you would fetch these from your API
    // For now, we'll use mock data
    setStats({
      totalVillas: 4,
      totalBookings: 12,
      totalUsers: 25,
      totalRevenue: 8500000,
      pendingBookings: 3,
      confirmedBookings: 8,
    })
    setLoading(false)
  }

  const adminMenuItems = [
    {
      title: 'Kelola Villa',
      description: 'Tambah, edit, dan hapus villa',
      icon: Building2,
      href: '/admin/villas',
      color: 'bg-blue-500',
    },
    {
      title: 'Kelola Booking',
      description: 'Lihat dan konfirmasi booking',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-green-500',
    },
    {
      title: 'Kelola User',
      description: 'Kelola user dan role',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500',
    },
    {
      title: 'Kelola Gambar',
      description: 'Upload dan kelola gambar villa',
      icon: Image,
      href: '/admin/images',
      color: 'bg-orange-500',
    },
    {
      title: 'Kelola Testimonial',
      description: 'Kelola review dan testimonial',
      icon: Star,
      href: '/admin/testimonials',
      color: 'bg-yellow-500',
    },
    {
      title: 'Pengaturan',
      description: 'Konfigurasi website',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Villa</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVillas}</div>
            <p className="text-xs text-muted-foreground">
              Villa tersedia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingBookings} menunggu konfirmasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              User terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pendapatan total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Villa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => (
            <div
              key={item.title}
              className="group relative bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Booking baru untuk Villa Seminyak</p>
              <p className="text-sm text-gray-600">2 jam yang lalu</p>
            </div>
            <span className="text-sm text-gray-500">Menunggu konfirmasi</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">User baru mendaftar</p>
              <p className="text-sm text-gray-600">4 jam yang lalu</p>
            </div>
            <span className="text-sm text-gray-500">john@example.com</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Testimonial baru ditambahkan</p>
              <p className="text-sm text-gray-600">1 hari yang lalu</p>
            </div>
            <span className="text-sm text-gray-500">Rating: 5/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
