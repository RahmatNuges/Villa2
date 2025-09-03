'use client'

import { useState } from 'react'
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

interface AccountProfileProps {
  user: {
    id: string
    email: string
    user_metadata?: {
      name?: string
      role?: string
    }
    created_at: string
  }
}

export function AccountProfile({ user }: AccountProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: user.user_metadata?.name || '',
    email: user.email,
  })

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
        }
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Profil berhasil diperbarui!')
        setIsEditing(false)
      }
    } catch (error) {
      setMessage('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.user_metadata?.name || '',
      email: user.email,
    })
    setIsEditing(false)
    setMessage('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profil</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              size="sm"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('berhasil') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="pl-10"
                placeholder="Masukkan nama lengkap"
              />
            ) : (
              <div className="flex items-center h-10 px-3 pl-10 text-gray-900">
                {formData.name || 'Belum diisi'}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="flex items-center h-10 px-3 pl-10 text-gray-900">
              {formData.email}
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="flex items-center h-10 px-3 pl-10">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.user_metadata?.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.user_metadata?.role === 'admin' ? 'Admin' : 'Guest'}
              </span>
            </div>
          </div>
        </div>

        {/* Member Since */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Bergabung Sejak</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="flex items-center h-10 px-3 pl-10 text-gray-900">
              {new Date(user.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
