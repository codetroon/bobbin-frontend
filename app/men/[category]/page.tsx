import { ProductCard } from "@/components/product-card";
import { apiClient } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getCategoryByName(
  slug: string
): Promise<{ category: Category; products: Product[] } | null> {
  try {
    // Get all categories
    const categoriesResponse = await apiClient.getPublicCategories();
    const categories = categoriesResponse.data || [];

    // Find category by slug (name converted to lowercase with dashes)
    const category = categories.find(
      (cat: Category) => cat.name.toLowerCase().replace(/\s+/g, "-") === slug
    );

    if (!category) return null;

    // Get products for this category
    const productsResponse = await apiClient.getPublicProducts({
      categoryId: category.id,
      limit: 100,
    });

    return {
      category,
      products: productsResponse.data || [],
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.getPublicCategories();
    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return (
    categories.map((cat: Category) => ({
      category: cat.name.toLowerCase().replace(/\s+/g, "-"),
    })) || []
  );
}

type PageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: PageProps) {
  const result = await getCategoryByName(params.category);

  if (!result) {
    notFound();
  }

  const { category, products } = result;

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
