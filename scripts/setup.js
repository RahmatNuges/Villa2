#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏖️  Villa Rental Setup Script');
console.log('==============================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env.local from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env.local created successfully!');
    console.log('⚠️  Please edit .env.local and add your Supabase credentials\n');
  } else {
    console.log('❌ env.example not found. Please create .env.local manually.\n');
  }
} else {
  console.log('✅ .env.local already exists\n');
}

console.log('📋 Next steps:');
console.log('1. Edit .env.local with your Supabase credentials');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3000\n');

console.log('🔗 Supabase Setup:');
console.log('1. Create new project at https://supabase.com');
console.log('2. Run SQL from database/schema.sql');
console.log('3. Run SQL from database/seed.sql');
console.log('4. Get credentials from Settings > API\n');

console.log('🚀 Happy coding!');
