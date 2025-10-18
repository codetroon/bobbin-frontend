/*
  # Bobbin E-commerce Database Schema

  ## Overview
  Complete database schema for Bobbin e-commerce platform with categories, products,
  variants, orders, banners, messages, and settings.

  ## Tables Created

  ### 1. categories
  Hierarchical category structure for organizing products
  - `id` (uuid, primary key)
  - `name` (text) - Category display name
  - `slug` (text, unique) - URL-friendly identifier
  - `parent_id` (uuid, nullable) - Self-referencing for hierarchy
  - `created_at`, `updated_at` (timestamptz)

  ### 2. products
  Core product information
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly identifier
  - `product_id` (text, unique) - SKU/product code
  - `description` (text) - Product description
  - `cloth_type` (text) - Fabric type (Cotton, Linen, etc.)
  - `base_price` (integer) - Price in paisa (e.g., 159900 = ৳1599.00)
  - `discount_percent` (integer, default 0) - Discount percentage
  - `stock` (integer, default 0) - Total stock count
  - `status` (text, default 'published') - draft or published
  - `category_id` (uuid, foreign key) - Links to categories
  - `created_at`, `updated_at` (timestamptz)

  ### 3. product_images
  Multiple images per product
  - `id` (uuid, primary key)
  - `url` (text) - Image path or URL
  - `alt` (text, nullable) - Alt text for accessibility
  - `product_id` (uuid, foreign key)
  - `order` (integer, default 0) - Display order

  ### 4. variants
  Size variants for each product
  - `id` (uuid, primary key)
  - `size` (text) - S, M, L, XL, XXL
  - `product_id` (uuid, foreign key)
  - `extra_price` (integer, default 0) - Additional price for this size
  - `stock` (integer, default 0) - Stock for this specific size

  ### 5. orders
  Customer orders
  - `id` (uuid, primary key)
  - `customer_name` (text)
  - `address` (text)
  - `contact` (text)
  - `total` (integer) - Total in paisa
  - `status` (text, default 'received') - Order status
  - `created_at` (timestamptz)

  ### 6. order_items
  Line items within each order
  - `id` (uuid, primary key)
  - `order_id` (uuid, foreign key)
  - `product_id` (uuid, foreign key)
  - `size` (text)
  - `qty` (integer)
  - `unit_price` (integer)
  - `line_total` (integer)

  ### 7. banners
  Hero/promotional banners for homepage
  - `id` (uuid, primary key)
  - `title` (text)
  - `subtitle` (text, nullable)
  - `cta_text` (text, nullable) - Call-to-action button text
  - `cta_href` (text, nullable) - CTA link
  - `active` (boolean, default true)
  - `created_at`, `updated_at` (timestamptz)

  ### 8. messages
  Contact form submissions
  - `id` (uuid, primary key)
  - `name` (text)
  - `contact` (text)
  - `message` (text)
  - `created_at` (timestamptz)

  ### 9. settings
  Global store settings
  - `id` (uuid, primary key)
  - `store_name` (text, default 'bobbin')
  - `currency` (text, default 'BDT')
  - `theme` (text, default 'silver-gold-black')
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for storefront data (categories, products, banners, settings)
  - Public write access for orders and messages (no auth for demo)
  - Admin operations are open for demo purposes (would require auth in production)

  ## Notes
  - All prices stored in paisa (multiply by 100 from BDT)
  - No authentication implemented (demo only)
  - In production: Add RLS policies with proper auth checks for admin operations
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  product_id text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  cloth_type text NOT NULL DEFAULT 'Cotton',
  base_price integer NOT NULL,
  discount_percent integer DEFAULT 0,
  stock integer DEFAULT 0,
  status text DEFAULT 'published',
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "order" integer DEFAULT 0
);

-- Create variants table
CREATE TABLE IF NOT EXISTS variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  size text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  extra_price integer DEFAULT 0,
  stock integer DEFAULT 0
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  address text NOT NULL,
  contact text NOT NULL,
  total integer NOT NULL,
  status text DEFAULT 'received',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size text NOT NULL,
  qty integer NOT NULL,
  unit_price integer NOT NULL,
  line_total integer NOT NULL
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cta_text text,
  cta_href text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'bobbin',
  currency text DEFAULT 'BDT',
  theme text DEFAULT 'silver-gold-black',
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (storefront)
CREATE POLICY "Public can view published categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Public can view variants"
  ON variants FOR SELECT
  USING (true);

CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

-- RLS Policies for order creation (no auth for demo)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- RLS Policies for contact messages
CREATE POLICY "Anyone can submit messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Admin policies (open for demo - would require auth in production)
CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage product images"
  ON product_images FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage variants"
  ON variants FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Admin can update order status"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage banners"
  ON banners FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);