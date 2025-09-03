# Villa Rental Website

Website sewa villa mewah di Bali dengan fitur booking instan, manajemen admin, dan integrasi WhatsApp. Dibangun dengan Next.js 15, TypeScript, Tailwind CSS, dan Supabase.

## 🚀 Fitur Utama

- **Homepage** dengan hero form booking dan showcase villa
- **Listing Villa** dengan filter dan pencarian
- **Detail Villa** dengan kalender ketersediaan dan harga dinamis
- **Instant Booking** tanpa payment gateway (WhatsApp integration)
- **Admin Panel** untuk CRUD villa, pricing rules, dan manajemen
- **Authentication** dengan Supabase Auth (email OTP + Google)
- **Responsive Design** dengan Tailwind CSS
- **SEO Optimized** dengan JSON-LD schema

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: Zustand
- **Form Validation**: react-hook-form + zod
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase
- Akun Vercel (untuk deployment)

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd villa-rental
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor di Supabase Dashboard
3. Jalankan script SQL dari `database/schema.sql`
4. Jalankan script seed data dari `database/seed.sql`

### 4. Environment Variables

**PENTING**: Buat file `.env.local` di root project sebelum menjalankan aplikasi:

```bash
npm run setup
```

Atau manual:
```bash
cp env.example .env.local
```

Kemudian edit file `.env.local` dan isi dengan data Supabase Anda:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
NEXT_PUBLIC_SITE_NAME=NamaBrandVilla
NEXT_PUBLIC_WA_NUMBER=6281234567890

# Email (Optional)
RESEND_API_KEY=your_resend_api_key_here
```

**Cara mendapatkan Supabase credentials:**
1. Buka project di [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to Settings > API
3. Copy `Project URL` dan `anon public` key
4. Copy `service_role` key (jangan share ke public!)

### 5. Setup Supabase Storage

1. Buka Storage di Supabase Dashboard
2. Buat bucket baru dengan nama `villa-images`
3. Set policy untuk public access:

```sql
-- Allow public access to villa images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'villa-images');
```

### 6. Setup Authentication

1. Buka Authentication di Supabase Dashboard
2. Enable Email provider
3. Enable Google provider (opsional)
4. Set Site URL: `http://localhost:3000` (development)
5. Set Redirect URLs: `http://localhost:3000/auth/callback`

### 7. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🗄️ Database Schema

### Tabel Utama

- **profiles**: Data user dengan role (admin/guest)
- **villas**: Data villa dengan informasi lengkap
- **images**: Gambar villa dengan ordering
- **bookings**: Data booking dengan status
- **pricing_rules**: Rules harga musiman
- **blackout_dates**: Tanggal yang diblokir
- **testimonials**: Testimoni dengan approval

### Row Level Security (RLS)

Semua tabel menggunakan RLS untuk keamanan:
- Public read untuk villa dan images
- User hanya bisa akses data sendiri
- Admin bisa akses semua data

## 🚀 Deployment

### Deploy ke Vercel

1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_WA_NUMBER`
   - `RESEND_API_KEY` (opsional)

4. Deploy!

### Update Supabase Settings

Setelah deploy, update di Supabase Dashboard:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

## 📱 Fitur Admin

### Akses Admin

1. Buat user baru melalui Supabase Auth
2. Update role di tabel `profiles`:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'user-uuid';
```

### Admin Panel Routes

- `/admin` - Dashboard
- `/admin/villas` - CRUD Villa
- `/admin/pricing` - Pricing Rules
- `/admin/availability` - Blackout Dates
- `/admin/bookings` - Manage Bookings
- `/admin/testimonials` - Moderate Testimonials

## 🎨 Customization

### Brand Colors

Update di `tailwind.config.ts`:

```typescript
colors: {
  charcoal: "#111827",    // Primary dark
  ivory: "#FAFAF9",       // Background
  champagne: "#D4AF37",   // Accent gold
  teal: "#14B8A6",        // Secondary
}
```

### Site Name

Update di environment variables:
```env
NEXT_PUBLIC_SITE_NAME=YourBrandName
```

### WhatsApp Number

Update di environment variables:
```env
NEXT_PUBLIC_WA_NUMBER=6281234567890
```

## 📊 SEO Features

- **JSON-LD Schema** untuk villa detail
- **Metadata** per halaman
- **Sitemap** otomatis
- **Robots.txt**
- **Open Graph** tags
- **Twitter Cards**

## 🔧 Development Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## 📁 Project Structure

```
villa-rental/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   ├── forms/          # Form components
│   │   └── villa/          # Villa-specific components
│   ├── lib/                # Utilities & configs
│   └── types/              # TypeScript types
├── database/               # SQL scripts
├── public/                 # Static assets
└── README.md
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🆘 Support

Jika ada pertanyaan atau masalah:

1. Check [Issues](../../issues) untuk solusi yang sudah ada
2. Buat issue baru dengan detail yang jelas
3. Hubungi developer untuk support langsung

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Review system
- [ ] Loyalty program

---

**Happy Coding! 🏖️**