const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  console.error('   Please ensure .env.local is configured correctly.')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@villa-rental.com'

  console.log('🔧 Updating admin user metadata...')
  console.log('   Email:', adminEmail)

  try {
    // Get all users
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Error listing users:', listError.message)
      return
    }

    const adminUser = users.find(user => user.email === adminEmail)

    if (!adminUser) {
      console.error('❌ Admin user not found:', adminEmail)
      return
    }

    console.log('👤 Found admin user:', adminUser.id)

    // Update user metadata
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          name: 'Admin',
          role: 'admin'
        },
        app_metadata: {
          role: 'admin'
        }
      }
    )

    if (updateError) {
      console.error('❌ Error updating user:', updateError.message)
      return
    }

    console.log('✅ User metadata updated successfully!')
    console.log('   User ID:', adminUser.id)
    console.log('   Email:', adminEmail)
    console.log('   Role: admin')

    // Also update profile table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ 
        id: adminUser.id, 
        role: 'admin', 
        name: 'Admin' 
      }, { onConflict: 'id' })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Error updating profile:', profileError.message)
      return
    }

    console.log('✅ Profile table updated successfully!')

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
  }
}

updateAdminUser()
