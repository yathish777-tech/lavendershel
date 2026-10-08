-- ====================================================================
-- Lavendershell: Fix Products Table, Storage Bucket & Schema Cache
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ====================================================================

-- 1. Ensure uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure categories table exists
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

-- 3. Ensure products table exists with all required columns
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

-- In case table already existed without certain columns, safely add them:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_subscription BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subscription_plans JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 4. Sync trigger for name <-> title
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

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- 5. Row Level Security policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
    DROP POLICY IF EXISTS "Public can view active products" ON public.products;
    DROP POLICY IF EXISTS "Service role full access on categories" ON public.categories;
    DROP POLICY IF EXISTS "Service role full access on products" ON public.products;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT USING (is_active = TRUE);

-- 6. Storage bucket: product-images (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Public / Admin Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Public / Admin Upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin Delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images');

CREATE POLICY "Admin Update"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'product-images');

-- 7. Permissions: Grant usage & access to PostgREST roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 8. PostgREST Schema Cache Reload
-- Eliminates PGRST205 ("Could not find the table 'public.products' in the schema cache")
NOTIFY pgrst, 'reload schema';
