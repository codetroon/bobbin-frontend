// Types based on backend Prisma schema

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  Product?: Product[];
};

export type Size = {
  id: string;
  name: string;
  stock: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  productCode: string;
  description: string | null;
  price: number;
  details: string | null;
  materials: string[];
  colors: string[];
  images: string[];
  categoryId: string;
  category?: Category;
  Size?: Size[];
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  customerName: string;
  address: string;
  contactNumber: string;
  productId: string;
  products?: Product;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "super_admin" | "admin" | "user";
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};
