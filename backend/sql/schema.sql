-- ====================================================================
-- Lavendershell Database Schema (PostgreSQL for Supabase)
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories (sort_order);

-- --------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 10)),
    name TEXT NOT NULL,
    title TEXT,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    variants JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    badges TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_subscription BOOLEAN DEFAULT FALSE,
    subscription_plans JSONB DEFAULT '[]'::jsonb,
    stock INT DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to sync title <-> name and touch updated_at
CREATE OR REPLACE FUNCTION public.sync_product_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.title IS NULL OR NEW.title = '' THEN
        NEW.title := NEW.name;
    END IF;
    IF NEW.name IS NULL OR NEW.name = '' THEN
        NEW.name := NEW.title;
    END IF;
    NEW.updated_at := TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_product_fields ON public.products;
CREATE TRIGGER trg_sync_product_fields
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.sync_product_fields();

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- --------------------------------------------------------------------
-- 3. PROFILES TABLE (Linked with auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('customer', 'admin')) DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- Trigger to auto-create profile row on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 4. ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('LS-' || to_char(NOW(), 'YYMM') || '-' || substr(md5(random()::text), 1, 6)),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','failed')) DEFAULT 'pending' NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);

-- --------------------------------------------------------------------
-- 5. ORDER_ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    name_snapshot TEXT NOT NULL,
    price_snapshot NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    variant JSONB
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- --------------------------------------------------------------------
-- 6. CONTACT_MESSAGES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Backend services use the Supabase SERVICE_ROLE_KEY to bypass RLS,
-- but we enforce standard best practices for safety.
-- --------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Categories & Products: anyone can read active rows
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT USING (is_active = TRUE);

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Contact: Anyone can submit a contact message
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT WITH CHECK (true);

-- --------------------------------------------------------------------
-- STORAGE BUCKET: product-images (Public Bucket)
-- In Supabase dashboard: Storage -> New Bucket -> "product-images" (Public)
-- Policy: Allow public read, allow authenticated / service-role insert/delete
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Admin Upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin Delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images');

-- --------------------------------------------------------------------
-- SEED DATA (5 Categories & Products with realistic INR pricing)
-- --------------------------------------------------------------------

INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
('cat-snail-mail', 'Monthly Snail Mail & Letters', 'monthly-snail-mail', 'Mindfully curated wax-sealed letters, guided self-growth prompts, and vintage postage delivered right to your mailbox every month.', 1, TRUE),
('cat-seasonal-editions', 'Seasonal & Special Editions', 'seasonal-special-editions', 'Limited-run solstice and seasonal keepsake boxes adorned with pressed florals, poetic ribbons, and whimsical surprises.', 2, TRUE),
('cat-journaling', 'Journaling & Self-Reflection', 'journaling-self-development', 'Hardcover linen journals, gold foil bookmark ribbons, prompt cards, and habit trackers designed for your cozy morning pages.', 3, TRUE),
('cat-stationery', 'Self-Love Stationery & Stickers', 'self-love-stationery', 'Holographic affirmation stickers, pastel washi tapes, brass wax seal stamps, and fine tip pastel gel ink pens.', 4, TRUE),
('cat-bundles', 'Gift Sets & Cozy Bundles', 'bundles-gift-sets', 'Tied with silk ribbon: the ultimate gift to yourself or a kindred spirit, including our best-loved stationery treasures.', 5, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

INSERT INTO public.products (
    id, name, slug, category_id, description, price, compare_at_price,
    images, variants, tags, badges, is_subscription, subscription_plans,
    stock, is_featured, is_active
) VALUES
(
    'prod-snail-mail-club',
    'The Monthly Snail Mail Club Subscription',
    'monthly-snail-mail-club',
    'cat-snail-mail',
    'A heart-to-heart handwritten-style letter sealed in lavender wax, accompanied by 3 mindful reflection cards, vintage-inspired illustrated botanical stamps, and an exclusive mini vinyl sticker.',
    599.00,
    749.00,
    ARRAY['/illustrations/envelope.svg']::TEXT[],
    '[{"id": "var-lavender", "name": "Dreamy Lavender Wax Seal", "color": "#B9A7E8"}, {"id": "var-rose", "name": "Blush Rose Wax Seal", "color": "#F8C8DC"}, {"id": "var-gold", "name": "Gilded Honeycomb Seal", "color": "#E2A76F"}]'::jsonb,
    ARRAY['Subscription', 'Bestseller', 'Handmade']::TEXT[],
    ARRAY['Bestseller', 'Monthly Delight']::TEXT[],
    TRUE,
    '[{"id": "sub-monthly", "name": "Month-to-Month", "discount": 0, "price": 599.00, "interval": "monthly"}, {"id": "sub-3mo", "name": "3-Month Prepaid", "discount": 10, "price": 539.00, "interval": "every 3 months", "isPopular": true}, {"id": "sub-6mo", "name": "6-Month Prepaid", "discount": 15, "price": 509.00, "interval": "every 6 months"}]'::jsonb,
    45,
    TRUE,
    TRUE
),
(
    'prod-snail-mail-singles',
    'One-Time Cozy Postal Care Parcel',
    'cozy-postal-care-parcel',
    'cat-snail-mail',
    'Want to experience the magic of physical mail without subscribing? Receive this standalone parcel packed with our favorite archival snail mail goodies and soothing tea sachets.',
    799.00,
    949.00,
    ARRAY['/illustrations/parcel.svg']::TEXT[],
    '[{"id": "var-calm", "name": "Calm & Grounded Theme", "color": "#B9A7E8"}, {"id": "var-joy", "name": "Gentle Joy & Bloom Theme", "color": "#F4A6C4"}]'::jsonb,
    ARRAY['One-Time', 'Gift', 'Care Package']::TEXT[],
    ARRAY['Fan Favorite']::TEXT[],
    FALSE,
    '[]'::jsonb,
    30,
    FALSE,
    TRUE
),
(
    'prod-penpal-stationery-pack',
    'The Vintage Penpal Correspondence Set',
    'vintage-penpal-correspondence-set',
    'cat-snail-mail',
    'Everything you need to write enchanting snail mail back to your friends. Includes 10 matching envelopes, 20 sheets of scalloped writing paper, and sealing stickers.',
    699.00,
    849.00,
    ARRAY['/illustrations/letterset.svg']::TEXT[],
    '[{"id": "var-pastel-lavender", "name": "Lilac Wisteria", "color": "#B9A7E8"}, {"id": "var-baby-pink", "name": "Petal Whisper", "color": "#F8C8DC"}]'::jsonb,
    ARRAY['Letter Writing', 'Paper Goods']::TEXT[],
    ARRAY['Back in Stock']::TEXT[],
    FALSE,
    '[]'::jsonb,
    25,
    TRUE,
    TRUE
),
(
    'prod-spring-solstice-edition',
    'Spring Solstice Limited Keepsake Vault',
    'spring-solstice-limited-keepsake-vault',
    'cat-seasonal-editions',
    'Our limited seasonal release celebrating renewal. Housed in a hand-crafted keepsake book box with magnetic closure, pressed lavender sprigs, and custom ceramic stamp rest.',
    1899.00,
    2299.00,
    ARRAY['/illustrations/vault.svg']::TEXT[],
    '[{"id": "var-spring-blossom", "name": "Cherry Blossom & Lilac", "color": "#F8C8DC"}]'::jsonb,
    ARRAY['Limited Edition', 'Keepsake', 'Seasonal']::TEXT[],
    ARRAY['Limited Run', 'Numbered 1/500']::TEXT[],
    FALSE,
    '[]'::jsonb,
    18,
    TRUE,
    TRUE
),
(
    'prod-mindful-morning-journal',
    'Mindful Mornings Guided Self-Reflection Journal',
    'mindful-mornings-guided-journal',
    'cat-journaling',
    '180 days of undated gentle morning prompts, evening gratitude whispers, daily hydration & mood blossoms, and ribbon page markers in signature lavender.',
    999.00,
    1199.00,
    ARRAY['/illustrations/journal.svg']::TEXT[],
    '[{"id": "var-lavender-cloth", "name": "Soft Lilac Linen", "color": "#B9A7E8"}, {"id": "var-cream-cloth", "name": "Vanilla Cream Linen", "color": "#FFF9F4"}, {"id": "var-rose-cloth", "name": "Petal Blush Linen", "color": "#F8C8DC"}]'::jsonb,
    ARRAY['Bestseller', 'Journaling', 'Hardcover']::TEXT[],
    ARRAY['Bestseller']::TEXT[],
    FALSE,
    '[]'::jsonb,
    62,
    TRUE,
    TRUE
),
(
    'prod-affirmation-sticker-book',
    '500+ Holographic Affirmation Sticker Vault',
    'holographic-affirmation-sticker-vault',
    'cat-stationery',
    '24 dreamy pages of iridescent quotes, smiling cloud buddies, vintage postal stamps, washi strips, and gentle reminders for your journals and letters.',
    499.00,
    649.00,
    ARRAY['/illustrations/stickers.svg']::TEXT[],
    '[{"id": "var-soft-dreams", "name": "Pastel Dreamscape", "color": "#E6DEF8"}]'::jsonb,
    ARRAY['Stickers', 'Holographic', 'Affirmations']::TEXT[],
    ARRAY['Staff Pick']::TEXT[],
    FALSE,
    '[]'::jsonb,
    80,
    TRUE,
    TRUE
),
(
    'prod-brass-wax-seal-kit',
    'Heirloom Brass Wax Seal Starter Kit',
    'heirloom-brass-wax-seal-starter-kit',
    'cat-stationery',
    'Everything you need to craft old-world wax seals at home. Includes solid brass stamp with rose quartz handle, melting stove, tea lights, and 120 pastel wax pearls.',
    1199.00,
    1499.00,
    ARRAY['/illustrations/waxkit.svg']::TEXT[],
    '[{"id": "var-seashell-stamp", "name": "Lavendershell Motif", "color": "#B9A7E8"}, {"id": "var-wildflower-stamp", "name": "Wild Lavender Sprig", "color": "#8F7BD1"}, {"id": "var-crescent-stamp", "name": "Crescent & Stars", "color": "#F4A6C4"}]'::jsonb,
    ARRAY['Wax Seal', 'Crafting', 'Gift']::TEXT[],
    ARRAY['Craft Favorite']::TEXT[],
    FALSE,
    '[]'::jsonb,
    35,
    TRUE,
    TRUE
),
(
    'prod-self-love-sanctuary-bundle',
    'The Ultimate Self-Love Sanctuary Gift Box',
    'ultimate-self-love-sanctuary-gift-box',
    'cat-bundles',
    'Our grandest bundle packaged in our signature floral keepsake box. Includes our Guided Linen Journal, Brass Wax Seal Kit, 500+ Sticker Book, Rose Quartz Pen, and 3 months of Snail Mail letters.',
    2499.00,
    2999.00,
    ARRAY['/illustrations/grandbundle.svg']::TEXT[],
    '[{"id": "var-deluxe-lavender", "name": "Lavender Dream Theme", "color": "#B9A7E8"}, {"id": "var-deluxe-blush", "name": "Sweet Peony Theme", "color": "#F8C8DC"}]'::jsonb,
    ARRAY['Bundle', 'Luxury Gift', 'Best Value']::TEXT[],
    ARRAY['Save ₹500', 'Signature Box']::TEXT[],
    FALSE,
    '[]'::jsonb,
    20,
    TRUE,
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    description = EXCLUDED.description;

-- --------------------------------------------------------------------
-- PERMISSIONS: Ensure PostgREST roles (anon, authenticated, service_role)
-- have full operational permissions on the public schema and tables.
-- --------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- POSTGREST SCHEMA CACHE RELOAD
-- Flushes PostgREST schema cache so tables & columns are immediately active
-- and eliminates PGRST205 ("Could not find the table in the schema cache").
-- --------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

