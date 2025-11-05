import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.getPublicProducts({ limit: 1000 });

    // Handle null response from API client (server-side fallback)
    if (!response) {
      console.warn("Products API not available, returning empty array");
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.getPublicCategories();

    // Handle null response from API client (server-side fallback)
    if (!response) {
      console.warn("Categories API not available, returning empty array");
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function AllProductsPage() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">All Products</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-bobbinText md:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our complete collection of premium essentials
          </p>
          <p className="mt-1 text-sm font-medium text-bobbinText">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link href="/products">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                All Products
              </Button>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/men/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-accent hover:text-accent-foreground"
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              No products available at the moment.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new arrivals!
            </p>
          </div>
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
