import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AccountProfile } from '@/components/account/account-profile'
import { AccountBookings } from '@/components/account/account-bookings'

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Akun Saya
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kelola profil dan lihat riwayat booking villa Anda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile */}
            <div className="lg:col-span-1">
              <AccountProfile user={user} />
            </div>

            {/* Right Column - Bookings */}
            <div className="lg:col-span-2">
              <AccountBookings userId={user.id} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
