import { ProductCard } from "@/components/product-card";
import { ProductDetailsTabs } from "@/components/product-details-tabs";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { apiClient } from "@/lib/api";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const response = await apiClient.getPublicProducts({ limit: 100 });

    // Handle null response from API client (server-side fallback)
    if (!response) {
      console.warn("Products API not available during static generation");
      return [];
    }

    const products = response.data || [];
    return products.map((product: Product) => ({ slug: product.id })) || [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.getPublicProduct(id);

    // Handle null response from API client (server-side fallback)
    if (!response) {
      console.warn(`Product API not available for id: ${id}`);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(
  categoryId: string,
  currentId: string
): Promise<Product[]> {
  try {
    const response = await apiClient.getPublicProducts({
      categoryId,
      limit: 5,
    });

    // Handle null response from API client (server-side fallback)
    if (!response) {
      console.warn("Related products API not available");
      return [];
    }

    // Filter out current product
    const products = (response.data || []).filter(
      (p: Product) => p.id !== currentId
    );
    return products.slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  // Get main image URL from images array
  const imageUrl =
    product.images && product.images.length > 0 ? product.images[0] : "";

  // Transform product images for gallery
  const galleryImages =
    product.images?.map((url: string, index: number) => ({
      id: `${product.id}-${index}`,
      product_id: product.id,
      url: url,
      alt: product.name,
      order: index,
    })) || [];

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <span>Men</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductGallery images={galleryImages} productName={product.name} />
          <div>
            <ProductInfo product={product} />
            <ProductDetailsTabs product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
