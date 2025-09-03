-- Insert sample villas
INSERT INTO villas (slug, name, location, bedrooms, bathrooms, max_guests, base_price, description, amenities) VALUES
(
  'villa-seminyak-luxury',
  'Villa Seminyak Luxury',
  'Seminyak, Bali',
  3,
  3,
  6,
  2500000,
  'Villa mewah dengan kolam renang pribadi dan pemandangan sawah yang menakjubkan. Dilengkapi dengan fasilitas modern dan pelayanan terbaik untuk pengalaman liburan yang tak terlupakan.',
  ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Garden', 'BBQ Area', 'Daily Cleaning']
),
(
  'villa-ubud-tropical',
  'Villa Ubud Tropical',
  'Ubud, Bali',
  2,
  2,
  4,
  1800000,
  'Villa tropis yang tenang di tengah alam Ubud. Dikelilingi oleh hutan dan sungai, memberikan ketenangan dan kedamaian untuk relaksasi sempurna.',
  ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Garden', 'River View', 'Yoga Deck']
),
(
  'villa-canggu-beachfront',
  'Villa Canggu Beachfront',
  'Canggu, Bali',
  4,
  4,
  8,
  3500000,
  'Villa beachfront eksklusif dengan akses langsung ke pantai. Cocok untuk keluarga besar atau grup yang ingin menikmati keindahan pantai Canggu.',
  ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Beach Access', 'BBQ Area', 'Daily Cleaning', 'Concierge']
),
(
  'villa-sanur-family',
  'Villa Sanur Family',
  'Sanur, Bali',
  3,
  3,
  6,
  2200000,
  'Villa keluarga yang nyaman dengan taman luas dan area bermain anak. Lokasi strategis dekat dengan berbagai atraksi wisata Sanur.',
  ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Garden', 'Kids Playground', 'Family Room']
);

-- Insert sample images for each villa
INSERT INTO images (villa_id, url, alt, order_index) VALUES
-- Villa Seminyak Luxury
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Seminyak Luxury - Exterior View', 0),
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Seminyak Luxury - Living Room', 1),
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Seminyak Luxury - Private Pool', 2),

-- Villa Ubud Tropical
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Ubud Tropical - Exterior View', 0),
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Ubud Tropical - Bedroom', 1),
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Ubud Tropical - Garden View', 2),

-- Villa Canggu Beachfront
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Canggu Beachfront - Exterior View', 0),
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Canggu Beachfront - Beach View', 1),
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Canggu Beachfront - Master Bedroom', 2),

-- Villa Sanur Family
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Sanur Family - Exterior View', 0),
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Sanur Family - Family Room', 1),
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'Villa Sanur Family - Kids Playground', 2);

-- Insert sample pricing rules (high season)
INSERT INTO pricing_rules (villa_id, starts_on, ends_on, type, value) VALUES
-- High season pricing (December - January): +50%
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), '2024-12-01', '2025-01-31', 'percentage', 50),
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), '2024-12-01', '2025-01-31', 'percentage', 50),
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), '2024-12-01', '2025-01-31', 'percentage', 50),
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), '2024-12-01', '2025-01-31', 'percentage', 50),

-- Peak season pricing (July - August): +30%
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), '2024-07-01', '2024-08-31', 'percentage', 30),
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), '2024-07-01', '2024-08-31', 'percentage', 30),
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), '2024-07-01', '2024-08-31', 'percentage', 30),
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), '2024-07-01', '2024-08-31', 'percentage', 30);

-- Insert sample testimonials
INSERT INTO testimonials (villa_id, name, rating, content, approved) VALUES
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), 'Sarah Johnson', 5, 'Villa yang sangat indah dan nyaman. Pelayanan staff sangat baik dan lokasi strategis. Pasti akan kembali lagi!', true),
((SELECT id FROM villas WHERE slug = 'villa-seminyak-luxury'), 'Michael Chen', 5, 'Pengalaman menginap yang luar biasa. Kolam renang pribadi dan pemandangan sawah sangat menenangkan.', true),
((SELECT id FROM villas WHERE slug = 'villa-ubud-tropical'), 'Emma Wilson', 5, 'Villa tropis yang sempurna untuk relaksasi. Suasana tenang dan alam yang indah membuat liburan menjadi berkesan.', true),
((SELECT id FROM villas WHERE slug = 'villa-canggu-beachfront'), 'David Brown', 5, 'Villa beachfront yang menakjubkan! Akses langsung ke pantai dan fasilitas yang lengkap. Highly recommended!', true),
((SELECT id FROM villas WHERE slug = 'villa-sanur-family'), 'Lisa Anderson', 5, 'Sempurna untuk keluarga! Taman luas dan area bermain anak membuat anak-anak betah. Villa yang sangat family-friendly.', true);
