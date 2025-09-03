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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  const adminEmail = process.argv[2] || 'admin@villa-rental.com'
  const adminPassword = process.argv[3] || 'admin123456'
  const adminName = process.argv[4] || 'Admin Villa'

  console.log('🔧 Creating admin account...')
  console.log('   Email:', adminEmail)
  console.log('   Name:', adminName)
  console.log('   Password:', adminPassword)

  try {
    // 1. Create auth user
    console.log('\n📝 Step 1: Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: adminName,
        role: 'admin'
      },
      app_metadata: {
        role: 'admin'
      }
    })

    if (authError) {
      console.error('❌ Auth error:', authError.message)
      return
    }

    console.log('✅ Auth user created:', authData.user.id)

    // 2. Create profile in profiles table
    console.log('\n📝 Step 2: Creating profile...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: adminName,
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Profile error:', profileError.message)
      return
    }

    console.log('✅ Profile created:', profileData.id)

    console.log('\n🎉 Admin account created successfully!')
    console.log('   You can now login with:')
    console.log('   Email:', adminEmail)
    console.log('   Password:', adminPassword)
    console.log('\n   Admin dashboard: /admin')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the script
createAdmin()
