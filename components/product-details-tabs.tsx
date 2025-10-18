"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, ProductWithDetails } from "@/lib/supabase";

type ProductDetailsTabsProps = {
  product: ProductWithDetails | Product;
};

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  // Handle both Product and ProductWithDetails types
  const productDescription =
    "description" in product ? product.description : "";
  const productDetails = "details" in product ? product.details : "";
  const productMaterials = "materials" in product ? product.materials : "";

  // Split details and materials by "-" to create bullet points
  const details: string[] =
    productDetails && typeof productDetails === "string"
      ? productDetails.split("-").filter((item: string) => item.trim() !== "")
      : [];

  const materials: string[] =
    productMaterials && typeof productMaterials === "string"
      ? productMaterials.split("-").filter((item: string) => item.trim() !== "")
      : [];

  return (
    <div className="border-t pt-8 mt-8">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="materials"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="py-6 space-y-4">
          <h3 className="text-lg font-semibold">
            Elite expressions of refinement!
          </h3>
          {productDescription && (
            <p className="text-muted-foreground leading-relaxed">
              {productDescription}
            </p>
          )}
        </TabsContent>

        <TabsContent value="details" className="py-6">
          <ul className="space-y-3">
            {details.map((detail: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{detail.trim()}</span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="materials" className="py-6">
          <ul className="space-y-3">
            {materials.map((material: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{material.trim()}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
