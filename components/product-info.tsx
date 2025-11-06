"use client";

import { SizeGuideDialog } from "@/components/size-guide-dialog";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFacebook, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

type ProductInfoProps = {
  product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [sizeGuide, setSizeGuide] = useState<any>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const sizes = product.Size || [];
  const sortedSizes = [...sizes].sort((a, b) => {
    return sizeOrder.indexOf(a.name) - sizeOrder.indexOf(b.name);
  });

  // Fetch size guide for this product's category
  useEffect(() => {
    const fetchSizeGuide = async () => {
      try {
        const response = await apiClient.getSizeGuideByCategory(
          product.categoryId
        );
        if (response?.data) {
          setSizeGuide(response.data);
        }
      } catch (error) {
        console.error("Error fetching size guide:", error);
      }
    };

    if (product.categoryId) {
      fetchSizeGuide();
    }
  }, [product.categoryId]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const size = sizes.find((s) => s.name === selectedSize);
    if (!size || size.stock < 1) {
      toast.error("Not enough stock available");
      return;
    }

    const imageUrl =
      product.images && product.images.length > 0 ? product.images[0] : "";

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.id,
      size: selectedSize,
      price: product.price,
      image: imageUrl,
    });

    toast.success("Added to bag");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.name} on Bobbin`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "messenger":
        window.open(
          `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`,
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
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Code: {product.productCode}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">
          ৳{product.price.toLocaleString()}
        </span>
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Color:{" "}
              <span className="font-normal">
                {selectedColor || product.colors[0]}
              </span>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColor === color ||
                  (!selectedColor && color === product.colors[0])
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-gray-300 hover:border-accent"
                }`}
                title={color}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sortedSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Select Size</label>
            {sizeGuide && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <Ruler className="h-4 w-4 mr-1" />
                Size Guide
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sortedSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.name)}
                disabled={size.stock === 0}
                className={`flex h-12 min-w-[60px] items-center justify-center rounded-lg border-2 px-4 transition-all ${
                  selectedSize === size.name
                    ? "border-foreground bg-foreground text-background"
                    : size.stock === 0
                      ? "cursor-not-allowed border-muted bg-muted text-muted-foreground line-through opacity-50"
                      : "border-input hover:border-foreground"
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleAddToBag}
          size="lg"
          className="w-full bg-foreground text-background hover:bg-foreground/90"
        >
          ADD TO BAG
        </Button>
      </div>

      {product.materials && product.materials.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Materials</h3>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((material, idx) => (
              <span
                key={idx}
                className="text-sm bg-muted px-3 py-1 rounded-full"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 pt-4 border-t">
        <button
          onClick={() => handleShare("facebook")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Facebook"
        >
          <FaFacebook size={24} />
        </button>
        <button
          onClick={() => handleShare("messenger")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Messenger"
        >
          <FaFacebookMessenger size={24} />
        </button>
        <button
          onClick={() => handleShare("whatsapp")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on WhatsApp"
        >
          <FaWhatsapp size={24} />
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Share on Twitter"
        >
          <FaXTwitter size={24} />
        </button>
      </div>

      {/* Size Guide Dialog */}
      <SizeGuideDialog
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        imageUrl={sizeGuide?.imageUrl}
        categoryName={sizeGuide?.category?.name}
      />
    </div>
  );
}
