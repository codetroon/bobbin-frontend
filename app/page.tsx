import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import type { Product } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.getPublicProducts({ limit: 8 });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getHeroSettings() {
  try {
    const response = await apiClient.getHeroSettings();
    return response.data;
  } catch (error) {
    console.error("Error fetching hero settings:", error);
    return {
      title: "Elevate Your Style",
      subtitle:
        "Discover premium essentials crafted for the modern gentleman. Quality that speaks, comfort that lasts.",
      primaryBtnText: "Shop Now",
      primaryBtnLink: "/products",
      secondaryBtnText: "Learn More",
      secondaryBtnLink: "/about",
      backgroundImage: null,
    };
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const heroSettings = await getHeroSettings();

  return (
    <div>
      {/* Hero Banner */}
      <section
        className={`relative py-20 md:py-32 ${
          heroSettings.backgroundImage
            ? "bg-cover bg-center"
            : "bg-gradient-to-r from-bobbinText to-accent"
        }`}
        style={
          heroSettings.backgroundImage
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroSettings.backgroundImage})`,
              }
            : undefined
        }
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                {heroSettings.title}
              </h1>
              <p className="mb-8 text-lg text-gray-100 md:text-xl">
                {heroSettings.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={heroSettings.primaryBtnLink}>
                  <Button
                    size="lg"
                    className="bg-white text-bobbinText hover:bg-gray-100"
                  >
                    {heroSettings.primaryBtnText}
                  </Button>
                </Link>
                <Link href={heroSettings.secondaryBtnLink}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black hover:text-white hover:bg-white/10"
                  >
                    {heroSettings.secondaryBtnText}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-[400px] w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-40 w-40 rounded-lg bg-white/10 backdrop-blur-sm"></div>
                    <div className="h-40 w-40 rounded-lg bg-white/20 backdrop-blur-sm"></div>
                    <div className="h-40 w-40 rounded-lg bg-white/20 backdrop-blur-sm"></div>
                    <div className="h-40 w-40 rounded-lg bg-white/10 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-bobbinText">
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover our latest collection of premium essentials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-bobbinText">
                Premium Quality
              </h3>
              <p className="text-sm text-muted-foreground text-black">
                Crafted with the finest materials for lasting comfort
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-bobbinText">
                Fast Delivery
              </h3>
              <p className="text-sm text-muted-foreground text-black">
                Quick and reliable shipping across Bangladesh
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-bobbinText">
                Customer Care
              </h3>
              <p className="text-sm text-muted-foreground text-black">
                Dedicated support to ensure your satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
