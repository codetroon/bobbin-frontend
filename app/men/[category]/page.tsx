import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Product = {
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
  main_image: Array<any>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  details?: string;
  materials?: string;
};

type CategoryData = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  products: Product[];
};

async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?filters[slug][$eq]=${slug}&populate=products.main_image`,
      { next: { revalidate: 60 } }
    );
    const { data } = await response.json();
    return data?.[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getAllCategories() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      { next: { revalidate: 60 } }
    );
    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat: CategoryData) => ({ category: cat.slug })) || [];
}

type PageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const products = category.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="mb-4 flex items-center space-x-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <span>Men</span>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold md:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
