import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  code: string;
  cloth_type: string;
  discount_percent: string;
  stock: number;
  product_id: string;
  main_image: Array<{
    formats?: {
      medium?: {
        url: string;
      };
      large?: {
        url: string;
      };
      small?: {
        url: string;
      };
      thumbnail?: {
        url: string;
      };
    };
    url?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  order: number;
};

export type ProductWithDetails = Product & {
  category: Category;
  product_images: ProductImage[];
  variants: Variant[];
  name: string;
  slug: string;
  base_price: number;
  category_id: string;
};

export type Variant = {
  id: string;
  size: string;
  product_id: string;
  extra_price: number;
  stock: number;
};

export type Order = {
  id: string;
  customer_name: string;
  address: string;
  contact: string;
  total: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  qty: number;
  unit_price: number;
  line_total: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_href: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  contact: string;
  message: string;
  created_at: string;
};

export type Setting = {
  id: string;
  store_name: string;
  currency: string;
  theme: string;
  updated_at: string;
};
