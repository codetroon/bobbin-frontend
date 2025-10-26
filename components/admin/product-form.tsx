"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  productCode: z.string().min(1, "Product code is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  details: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  materials: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  productData?: any;
}

export function ProductForm({
  onSuccess,
  onCancel,
  productData,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMaterial, setNewMaterial] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: productData || {
      name: "",
      productCode: "",
      description: "",
      price: 0,
      details: "",
      categoryId: "",
      materials: [],
      colors: [],
      images: [],
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      if (productData) {
        await apiClient.updateProduct(productData.id, data);
        toast.success("Product updated successfully");
      } else {
        await apiClient.createProduct(data);
        toast.success("Product created successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      const currentMaterials = form.getValues("materials");
      form.setValue("materials", [...currentMaterials, newMaterial.trim()]);
      setNewMaterial("");
    }
  };

  const removeMaterial = (index: number) => {
    const currentMaterials = form.getValues("materials");
    form.setValue(
      "materials",
      currentMaterials.filter((_, i) => i !== index)
    );
  };

  const addColor = () => {
    if (newColor.trim()) {
      const currentColors = form.getValues("colors");
      form.setValue("colors", [...currentColors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (index: number) => {
    const currentColors = form.getValues("colors");
    form.setValue(
      "colors",
      currentColors.filter((_, i) => i !== index)
    );
  };

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = form.getValues("images");
      form.setValue("images", [...currentImages, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  const materials = form.watch("materials");
  const colors = form.watch("colors");
  const images = form.watch("images");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Premium Cotton T-Shirt"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Code */}
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TSHIRT-001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for this product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the product..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Details */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed information about the product..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Materials */}
        <div className="space-y-3">
          <FormLabel>Materials</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add material (e.g., Cotton, Polyester)"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addMaterial())
              }
            />
            <Button type="button" onClick={addMaterial} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {materials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {material}
                  <button
                    type="button"
                    onClick={() => removeMaterial(index)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <FormLabel>Colors</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add color (e.g., Black, White, Navy)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addColor())
              }
            />
            <Button type="button" onClick={addColor} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-3">
          <FormLabel>Images (URLs)</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImage())
              }
            />
            <Button type="button" onClick={addImage} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {images.length > 0 && (
            <div className="space-y-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      fill
                      className="object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <span className="flex-1 text-sm text-gray-600 truncate">
                    {image}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {productData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{productData ? "Update Product" : "Create Product"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
