"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.png";

  const hasDiscount = false; // Backend doesn't have discount, remove or add later
  console.log(imageUrl);
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {hasDiscount && (
              <Badge className="absolute right-2 top-2 bg-red-500">Save</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <div className="w-full">
            <h3 className="line-clamp-1 font-semibold text-bobbinText">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.description || "Premium quality product"}
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-bobbinText">
                ৳{product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
