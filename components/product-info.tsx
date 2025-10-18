"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateDiscountedPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store";
import type { Product, ProductWithDetails } from "@/lib/supabase";
import { useState } from "react";
import { FaFacebook, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

type ProductInfoProps = {
  product: ProductWithDetails | Product;
};

type ProductColor = {
  name: string;
  value: string;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  // Handle both Product and ProductWithDetails types
  const productName =
    "title" in product ? product.title : (product as any).name;
  const productPrice =
    "price" in product ? product.price : (product as any).base_price;
  const productDiscount =
    "discount_percent" in product
      ? parseFloat(product.discount_percent) || 0
      : (product as any).discount_percent || 0;
  const productId =
    "documentId" in product
      ? product.documentId
      : (product as any).id?.toString();
  const productCode =
    "code" in product ? product.code : (product as any).product_id;

  const discountedPrice = calculateDiscountedPrice(
    productPrice,
    productDiscount
  );

  // Size order mapping
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  // Mock variants for API products (since they don't have variants yet)
  const mockVariants = [
    { id: "1", size: "S", stock: 10 },
    { id: "2", size: "M", stock: 10 },
    { id: "3", size: "L", stock: 10 },
    { id: "4", size: "XL", stock: 10 },
    { id: "5", size: "2XL", stock: 10 },
  ];

  const variants = "variants" in product ? product.variants : mockVariants;
  const sortedVariants = [...variants].sort((a, b) => {
    return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
  });

  // Mock colors - in real app, this would come from product data
  const availableColors: ProductColor[] = [
    { name: "Dark Slate Blue", value: "dark-slate-blue" },
  ];

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const variant = variants.find((v) => v.size === selectedSize);
    if (!variant || variant.stock < 1) {
      toast.error("Not enough stock available");
      return;
    }

    // Get main image URL
    const mainImage =
      "main_image" in product ? (product.main_image?.[0] as any) : null;
    const imageUrl = mainImage
      ? `${process.env.NEXT_PUBLIC_BASE_URL}${
          mainImage.formats?.medium?.url || mainImage.url
        }`
      : "";

    addItem({
      productId: productId,
      name: productName,
      slug: productId,
      size: selectedSize,
      price: discountedPrice,
      image: imageUrl,
    });

    toast.success("Added to bag");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${productName} on Bobbin`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "messenger":
        window.open(
          `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
            url
          )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{productName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Code: {productCode}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">
          BDT {discountedPrice.toLocaleString()}
        </span>
      </div>

      {/* Color Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Color:{" "}
            <span className="font-normal">
              {selectedColor || availableColors[0]?.name}
            </span>
          </label>
        </div>
        <Select
          value={selectedColor || availableColors[0]?.value}
          onValueChange={setSelectedColor}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {availableColors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                {color.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Select Size</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedVariants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedSize(variant.size)}
              disabled={variant.stock === 0}
              className={`flex h-12 min-w-[60px] items-center justify-center rounded-lg border-2 px-4 transition-all ${
                selectedSize === variant.size
                  ? "border-foreground bg-foreground text-background"
                  : variant.stock === 0
                  ? "cursor-not-allowed border-muted bg-muted text-muted-foreground line-through opacity-50"
                  : "border-input hover:border-foreground"
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToBag}
          size="lg"
          className="w-full bg-foreground text-background hover:bg-foreground/90"
        >
          ADD TO BAG
        </Button>
        <Button variant="outline" size="lg" className="w-full">
          FIND IN STORE
        </Button>
      </div>

      {/* Social Share */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <button
          onClick={() => handleShare("facebook")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare("messenger")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Messenger"
        >
          <FaFacebookMessenger className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare("whatsapp")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Twitter"
        >
          <FaXTwitter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
