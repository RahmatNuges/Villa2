-- Fix RLS policies untuk memungkinkan akses public ke pricing_rules dan blackout_dates
-- untuk perhitungan harga

-- Hapus policy lama untuk pricing_rules
DROP POLICY IF EXISTS "Only admins can manage pricing rules" ON pricing_rules;

-- Tambahkan policy baru untuk pricing_rules
CREATE POLICY "Pricing rules are viewable by everyone" ON pricing_rules FOR SELECT USING (true);
CREATE POLICY "Only admins can insert pricing rules" ON pricing_rules FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Only admins can update pricing rules" ON pricing_rules FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Only admins can delete pricing rules" ON pricing_rules FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Hapus policy lama untuk blackout_dates
DROP POLICY IF EXISTS "Only admins can manage blackout dates" ON blackout_dates;

-- Tambahkan policy baru untuk blackout_dates
CREATE POLICY "Blackout dates are viewable by everyone" ON blackout_dates FOR SELECT USING (true);
CREATE POLICY "Only admins can insert blackout dates" ON blackout_dates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Only admins can update blackout dates" ON blackout_dates FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Only admins can delete blackout dates" ON blackout_dates FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Hapus policy lama untuk bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;

-- Tambahkan policy baru untuk bookings (untuk cek konflik)
CREATE POLICY "Bookings are viewable by everyone for availability check" ON bookings FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can insert bookings" ON bookings FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
CREATE POLICY "Admins can delete bookings" ON bookings FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
