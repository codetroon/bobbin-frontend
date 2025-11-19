"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/lib/types";

type ProductDetailsTabsProps = {
  product: Product;
};

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const productDescription = product.description || "";
  const productDetails = product.details || "";
  const productMaterials = product.materials || [];

  // Parse details into lines for bullets. Support several formats:
  // - Newline-separated lines (optionally starting with "• ")
  // - Dash-separated lines (legacy format: "- Item - Item")
  const details: string[] =
    productDetails && typeof productDetails === "string"
      ? // prefer newline-separated or bullet-prefixed content
        productDetails.includes("\n") || productDetails.includes("•")
        ? productDetails
            .split(/\r?\n/)
            .map((l) => l.replace(/^\s*•\s*/, "").trim())
            .filter((item) => item !== "")
        : // fallback to dash-separated
          productDetails
            .split("-")
            .map((l) => l.trim())
            .filter((item) => item !== "")
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
            {productMaterials.map((material: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                <span className="text-muted-foreground">{material}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
