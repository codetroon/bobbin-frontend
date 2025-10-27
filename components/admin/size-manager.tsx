"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Size {
  id: string;
  name: string;
  stock: number;
  productId: string;
}

interface SizeManagerProps {
  productId: string;
}

export function SizeManager({ productId }: SizeManagerProps) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeStock, setNewSizeStock] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const fetchSizes = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSizes(productId);
      setSizes(response.data || []);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Failed to fetch sizes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSizes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleAddSize = async () => {
    if (!newSizeName.trim()) {
      toast.error("Size name is required");
      return;
    }

    if (newSizeStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      setIsAdding(true);
      await apiClient.createSize({
        name: newSizeName,
        stock: newSizeStock,
        productId,
      });
      toast.success("Size added successfully");
      setNewSizeName("");
      setNewSizeStock(0);
      fetchSizes();
    } catch (error: any) {
      console.error("Error adding size:", error);
      toast.error(error.message || "Failed to add size");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSize = async (sizeId: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    try {
      await apiClient.deleteSize(sizeId);
      toast.success("Size deleted successfully");
      fetchSizes();
    } catch (error: any) {
      console.error("Error deleting size:", error);
      toast.error(error.message || "Failed to delete size");
    }
  };

  const handleUpdateStock = async (sizeId: string, newStock: number) => {
    if (newStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      await apiClient.updateSize(sizeId, { stock: newStock });
      toast.success("Stock updated successfully");
      fetchSizes();
    } catch (error: any) {
      console.error("Error updating stock:", error);
      toast.error(error.message || "Failed to update stock");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Sizes & Stock</h3>
      </div>

      {/* Add New Size */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium mb-3">Add New Size</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="sizeName">Size Name</Label>
            <Input
              id="sizeName"
              placeholder="e.g., S, M, L, XL"
              value={newSizeName}
              onChange={(e) => setNewSizeName(e.target.value)}
              disabled={isAdding}
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="0"
              value={newSizeStock}
              onChange={(e) => setNewSizeStock(parseInt(e.target.value) || 0)}
              disabled={isAdding}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddSize}
              disabled={isAdding}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Size
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Sizes */}
      {sizes.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Sizes</h4>
          {sizes.map((size) => (
            <div
              key={size.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-white"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="font-medium min-w-[60px]">{size.name}</div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`stock-${size.id}`} className="text-sm">
                    Stock:
                  </Label>
                  <Input
                    id={`stock-${size.id}`}
                    type="number"
                    min="0"
                    value={size.stock}
                    onChange={(e) =>
                      handleUpdateStock(size.id, parseInt(e.target.value) || 0)
                    }
                    className="w-24"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteSize(size.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">
          No sizes added yet. Add a size above to get started.
        </div>
      )}
    </div>
  );
}
