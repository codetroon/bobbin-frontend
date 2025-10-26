"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  order: number;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const handlePrevious = () => {
    setSelectedImage((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={sortedImages[selectedImage].url}
          alt={sortedImages[selectedImage].alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-[3/4] overflow-hidden rounded-lg transition-all ${
                selectedImage === index
                  ? "ring-2 ring-accent ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
