import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { calculateDiscountedPrice } from "@/lib/format";
import type { Product } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    Number(product.discount_percent)
  );
  const mainImage = product.main_image[0]?.formats?.medium?.url;

  return (
    <Link href={`/product/${product.documentId}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {mainImage && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${mainImage}`}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            {Number(product.discount_percent) > 0 && (
              <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
                -{product.discount_percent}%
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <h3 className="font-semibold text-sm line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.cloth_type}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{discountedPrice}</span>
            {Number(product.discount_percent) > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
