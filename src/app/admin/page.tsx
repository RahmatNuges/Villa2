import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { isAdmin } from '@/lib/auth'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  if (!isAdmin(user)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kelola villa, booking, dan pengaturan website
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminDashboard />
        </div>
      </section>
    </div>
  )
}
