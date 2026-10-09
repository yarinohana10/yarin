-- ============================================
-- Lian & Eli Hinna - Supabase Setup
-- ============================================
-- Copy ALL of this SQL and paste it into the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kwfdltzpxczqmyacmlui/sql/new
-- Then click "Run" to execute.
-- ============================================

-- 1. Create wedding_events table
CREATE TABLE IF NOT EXISTS wedding_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'admin',
  couple_names TEXT NOT NULL,
  wedding_date TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_map_link TEXT,
  waze_link TEXT,
  bit_number TEXT,
  bank_number TEXT,
  bank_branch TEXT,
  bank_account_number TEXT,
  bank_account_holder TEXT,
  background_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create guests table (for RSVP responses)
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES wedding_events(id),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  status TEXT DEFAULT 'pending',
  guest_count INTEGER DEFAULT 1,
  meal_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create bank_transfers table (optional, for payment info)
CREATE TABLE IF NOT EXISTS bank_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES wedding_events(id),
  bank_account_holder TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_branch TEXT NOT NULL,
  bank_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Enable Row Level Security
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - Allow public access (needed for the RSVP form)
CREATE POLICY "Allow public read wedding_events" ON wedding_events FOR SELECT USING (true);
CREATE POLICY "Allow public update wedding_events" ON wedding_events FOR UPDATE USING (true);
CREATE POLICY "Allow public insert wedding_events" ON wedding_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read guests" ON guests FOR SELECT USING (true);
CREATE POLICY "Allow public insert guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update guests" ON guests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete guests" ON guests FOR DELETE USING (true);

CREATE POLICY "Allow public read bank_transfers" ON bank_transfers FOR SELECT USING (true);
CREATE POLICY "Allow public insert bank_transfers" ON bank_transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bank_transfers" ON bank_transfers FOR UPDATE USING (true);

-- 6. Insert the initial Hinna event for Lian & Eli
-- (venue details are empty for now - update them from the admin panel later)
INSERT INTO wedding_events (
  user_id,
  couple_names,
  wedding_date,
  venue_name,
  venue_address,
  venue_map_link,
  waze_link,
  bit_number,
  background_image
) VALUES (
  'admin',
  'ליאן & אלי',
  '2026-11-03T19:00:00',
  'עדכן דרך מסך ניהול',
  'עדכן דרך מסך ניהול',
  '',
  '',
  '',
  ''
);

-- 7. Output the new wedding event ID (you'll need this!)
SELECT id, couple_names, wedding_date FROM wedding_events;
