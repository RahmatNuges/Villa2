import { User } from '@supabase/supabase-js'

export function isAdmin(user: User | null): boolean {
  if (!user) return false
  
  return (
    user.user_metadata?.role === 'admin' || 
    user.app_metadata?.role === 'admin'
  )
}

export function isGuest(user: User | null): boolean {
  if (!user) return false
  
  return (
    user.user_metadata?.role === 'guest' || 
    user.app_metadata?.role === 'guest' ||
    (!user.user_metadata?.role && !user.app_metadata?.role)
  )
}

export function getUserRole(user: User | null): string {
  if (!user) return 'guest'
  
  return (
    user.user_metadata?.role || 
    user.app_metadata?.role || 
    'guest'
  )
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest'
  
  return (
    user.user_metadata?.name || 
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User'
  )
}
