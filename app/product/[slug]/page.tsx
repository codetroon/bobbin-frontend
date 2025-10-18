import { ProductCard } from "@/components/product-card";
import { ProductDetailsTabs } from "@/components/product-details-tabs";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import type { Product } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      { next: { revalidate: 60 } }
    );
    const { data: products } = await response.json();

    return (
      products?.map((product: Product) => ({ slug: product.documentId })) || []
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

async function getProduct(documentId: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${documentId}?populate=main_image`,
      { next: { revalidate: 60 } }
    );
    const { data } = await response.json();
    return data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?populate=main_image&pagination[limit]=4`,
      { next: { revalidate: 60 } }
    );
    const { data } = await response.json();
    return data || [];
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

  const relatedProducts = await getRelatedProducts();

  // Get main image URL
  const mainImage =
    (product.main_image?.[0] as any)?.formats?.medium?.url ||
    (product.main_image?.[0] as any)?.url;
  const imageUrl = mainImage
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${mainImage}`
    : "";

  // Transform product images for gallery
  const galleryImages =
    product.main_image?.map((img: any, index: number) => ({
      id: `${product.documentId}-${index}`,
      product_id: product.documentId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${
        img.formats?.medium?.url || img.url
      }`,
      alt: product.title,
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
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductGallery images={galleryImages} productName={product.title} />
          <div>
            <ProductInfo product={product as any} />
            <ProductDetailsTabs product={product as any} />
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
