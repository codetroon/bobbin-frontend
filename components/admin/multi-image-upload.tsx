"use client";

import { Button } from "@/components/ui/button";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface UploadResponse {
  fileId: string;
  name: string;
  size: number;
  filePath: string;
  url: string;
  fileType: string;
  height?: number;
  width?: number;
  thumbnailUrl?: string;
}

interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface MultiImageUploadProps {
  onUploadComplete: (imageUrls: string[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
}

export function MultiImageUpload({
  onUploadComplete,
  existingImages = [],
  onRemoveExisting,
}: MultiImageUploadProps) {
  const [filesProgress, setFilesProgress] = useState<FileUploadProgress[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleUpload = async () => {
    setError(null);
    setUploadedUrls([]);

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    const files = Array.from(fileInput.files);

    const initialProgress: FileUploadProgress[] = files.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "pending",
    }));
    setFilesProgress(initialProgress);

    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setFilesProgress((prev) =>
        prev.map((item, index) =>
          index === i ? { ...item, status: "uploading" } : item
        )
      );

      try {
        const authParams = await authenticator();
        const { signature, expire, token, publicKey } = authParams;

        const abortController = new AbortController();

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
            setFilesProgress((prev) =>
              prev.map((item, index) =>
                index === i ? { ...item, progress: progressPercent } : item
              )
            );
          },
          abortSignal: abortController.signal,
        });

        const response = uploadResponse as UploadResponse;
        uploadedImageUrls.push(response.url);

        setFilesProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: "completed", progress: 100 } : item
          )
        );
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

        setFilesProgress((prev) =>
          prev.map((item, index) =>
            index === i
              ? { ...item, status: "error", error: errorMessage }
              : item
          )
        );
      }
    }

    setUploadedUrls(uploadedImageUrls);
    setIsUploading(false);

    if (uploadedImageUrls.length > 0) {
      onUploadComplete(uploadedImageUrls);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFilesProgress([]);
    } else {
      setError("All uploads failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Current Images:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50"
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {existingImages.length > 0 ? "Add More Images:" : "Upload Images:"}
        </label>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          disabled={isUploading}
        />
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Images"
        )}
      </Button>

      {/* Upload Progress */}
      {filesProgress.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Upload Progress:
          </h3>
          {filesProgress.map((fileProgress, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 truncate">
                  {fileProgress.fileName}
                </span>
                <span
                  className={`font-medium ${
                    fileProgress.status === "completed"
                      ? "text-green-600"
                      : fileProgress.status === "error"
                        ? "text-red-600"
                        : fileProgress.status === "uploading"
                          ? "text-blue-600"
                          : "text-gray-500"
                  }`}
                >
                  {fileProgress.status === "completed"
                    ? "✓ Completed"
                    : fileProgress.status === "error"
                      ? "✗ Failed"
                      : fileProgress.status === "uploading"
                        ? `${Math.round(fileProgress.progress)}%`
                        : "Pending"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    fileProgress.status === "error"
                      ? "bg-red-600"
                      : fileProgress.status === "completed"
                        ? "bg-green-600"
                        : "bg-blue-600"
                  }`}
                  style={{ width: `${fileProgress.progress}%` }}
                />
              </div>
              {fileProgress.error && (
                <p className="text-xs text-red-600">{fileProgress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadedUrls.length > 0 && !isUploading && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600 font-semibold">
            ✓ {uploadedUrls.length}{" "}
            {uploadedUrls.length === 1 ? "image" : "images"} uploaded
            successfully!
          </p>
        </div>
      )}
    </div>
  );
}
