"use client";

import { Button } from "@/components/ui/button";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface SingleImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  currentImage?: string;
  onRemove?: () => void;
}

export function SingleImageUpload({
  onUploadSuccess,
  currentImage,
  onRemove,
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const authParams = await authenticator();
      const { signature, expire, token, publicKey } = authParams;

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: process.env.NEXT_PUBLIC_IMAGEKIT_DEFAULT_FOLDER || "/",
        onProgress: (event) => {
          const progressPercent = (event.loaded / event.total) * 100;
          setProgress(progressPercent);
        },
      });

      if (uploadResponse.url) {
        onUploadSuccess(uploadResponse.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("No URL returned from upload");
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      let errorMessage = "Upload failed";

      if (error instanceof ImageKitAbortError) {
        errorMessage = `Upload aborted: ${error.reason}`;
      } else if (error instanceof ImageKitInvalidRequestError) {
        errorMessage = `Invalid request: ${error.message}`;
      } else if (error instanceof ImageKitUploadNetworkError) {
        errorMessage = `Network error: ${error.message}`;
      } else if (error instanceof ImageKitServerError) {
        errorMessage = `Server error: ${error.message}`;
      }

      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImage && !isUploading && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={currentImage}
            alt="Current image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="hero-image-upload"
        />
        <label htmlFor="hero-image-upload" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
            asChild
          >
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {currentImage ? "Change Image" : "Upload Image"}
                </>
              )}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
