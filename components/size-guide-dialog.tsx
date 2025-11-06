"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface SizeGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  categoryName?: string;
}

export function SizeGuideDialog({
  isOpen,
  onClose,
  imageUrl,
  categoryName,
}: SizeGuideDialogProps) {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Size Guide {categoryName && `- ${categoryName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full">
          <Image
            src={imageUrl}
            alt={`Size guide for ${categoryName || "products"}`}
            width={800}
            height={600}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        </div>

        <div className="text-sm text-muted-foreground text-center">
          Use this guide to find your perfect size. If you&apos;re between
          sizes, we recommend going up one size.
        </div>
      </DialogContent>
    </Dialog>
  );
}
