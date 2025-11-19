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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MultiImageUpload } from "./multi-image-upload";

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

  useEffect(() => {
    if (productData) {
      // Reset form with product data when editing
      form.reset({
        name: productData.name || "",
        productCode: productData.productCode || "",
        description: productData.description || "",
        price: productData.price || 0,
        details: productData.details || "",
        categoryId: productData.categoryId || "",
        materials: productData.materials || [],
        colors: productData.colors || [],
        images: productData.images || [],
      });
    }
  }, [productData, form]);

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

  const handleImageUpload = (newUrls: string[]) => {
    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, ...newUrls]);
    toast.success(`${newUrls.length} image(s) added successfully`);
  };

  const removeImage = (url: string) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((img) => img !== url)
    );
  };

  const materials = form.watch("materials");
  const colors = form.watch("colors");
  const images = form.watch("images");

  // materials are handled as an array of strings via the form

  const insertBulletAtCursor = (
    ta: HTMLTextAreaElement,
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!ta) return;
    // use the actual textarea value to avoid stale state
    const current = ta.value ?? "";
    const start = ta.selectionStart ?? current.length;
    const end = ta.selectionEnd ?? start;
    const newValue = current.slice(0, start) + "\n• " + current.slice(end);
    setValue(newValue);

    // move cursor after inserted bullet
    requestAnimationFrame(() => {
      try {
        ta.focus();
        const pos = start + 3; // "\n• " length
        ta.selectionStart = ta.selectionEnd = pos;
      } catch (err) {
        // ignore if element is not available
      }
    });
  };

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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onFocus={(e) => {
                    const ta = e.currentTarget as HTMLTextAreaElement;
                    if (!field.value) {
                      const v = "• ";
                      field.onChange(v);
                      // put cursor at end
                      requestAnimationFrame(() => {
                        try {
                          ta.focus();
                          ta.selectionStart = ta.selectionEnd = ta.value.length;
                        } catch (err) {
                          /* ignore */
                        }
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const ta = e.currentTarget as HTMLTextAreaElement;
                      insertBulletAtCursor(ta, field.value ?? "", (v) =>
                        field.onChange(v)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Materials */}
        <div className="space-y-3">
          <FormLabel>Materials</FormLabel>
          <FormField
            control={form.control}
            name="materials"
            render={() => (
              <div>
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

                {materials && materials.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {materials.map((material: string, index: number) => (
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
            )}
          />
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
          <FormLabel>Product Images</FormLabel>
          <MultiImageUpload
            onUploadComplete={handleImageUpload}
            existingImages={images}
            onRemoveExisting={removeImage}
          />
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
