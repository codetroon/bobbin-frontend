"use client";

import { SingleImageUpload } from "@/components/admin/single-image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api";
import { Edit, Eye, Plus, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface SizeGuide {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

export default function SizeGuidesPage() {
  const [sizeGuides, setSizeGuides] = useState<SizeGuide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingSizeGuide, setEditingSizeGuide] = useState<SizeGuide | null>(
    null
  );
  const [viewingSizeGuide, setViewingSizeGuide] = useState<SizeGuide | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSizeGuides();
    fetchCategories();
  }, []);

  const fetchSizeGuides = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSizeGuides();
      if (response?.data) {
        setSizeGuides(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching size guides:", error);
      toast.error(error.message || "Failed to fetch size guides");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast.error(error.message || "Failed to fetch categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.imageUrl || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingSizeGuide) {
        await apiClient.updateSizeGuide(editingSizeGuide.id, formData);
        toast.success("Size guide updated successfully");
      } else {
        await apiClient.createSizeGuide(formData);
        toast.success("Size guide created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSizeGuides();
    } catch (error: any) {
      console.error("Error saving size guide:", error);
      toast.error(error.message || "Failed to save size guide");
    }
  };

  const handleEdit = (sizeGuide: SizeGuide) => {
    setFormData({
      name: sizeGuide.name,
      imageUrl: sizeGuide.imageUrl,
      categoryId: sizeGuide.categoryId,
      isActive: sizeGuide.isActive,
    });
    setEditingSizeGuide(sizeGuide);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteSizeGuide(id);
      toast.success("Size guide deleted successfully");
      fetchSizeGuides();
    } catch (error: any) {
      console.error("Error deleting size guide:", error);
      toast.error(error.message || "Failed to delete size guide");
    }
  };

  const handleView = (sizeGuide: SizeGuide) => {
    setViewingSizeGuide(sizeGuide);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
      categoryId: "",
      isActive: true,
    });
    setEditingSizeGuide(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Size Guides
          </h1>
          <p className="text-gray-600 mt-2">
            Manage size guides for different product categories
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={fetchSizeGuides}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Size Guide
          </Button>
        </div>
      </div>

      {/* Size Guides Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Size Guides ({sizeGuides.length})</CardTitle>
          <CardDescription>
            Category-specific size guides for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sizeGuides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No size guides found.</p>
              <Button onClick={handleCreateNew} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create your first size guide
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeGuides.map((sizeGuide) => (
                  <TableRow key={sizeGuide.id}>
                    <TableCell>
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={sizeGuide.imageUrl}
                          alt={sizeGuide.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {sizeGuide.name}
                    </TableCell>
                    <TableCell>{sizeGuide.category.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sizeGuide.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sizeGuide.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(sizeGuide.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(sizeGuide)}
                          title="View Size Guide"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sizeGuide)}
                          title="Edit Size Guide"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete Size Guide"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Size Guide
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this size guide?
                                This action cannot be undone.
                                <br />
                                <br />
                                <strong>Name:</strong> {sizeGuide.name}
                                <br />
                                <strong>Category:</strong>{" "}
                                {sizeGuide.category.name}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sizeGuide.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Size Guide
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSizeGuide ? "Edit Size Guide" : "Create Size Guide"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter size guide name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size Guide Image *</Label>
              <SingleImageUpload
                onUploadSuccess={(url: string) =>
                  setFormData({ ...formData, imageUrl: url })
                }
                currentImage={formData.imageUrl}
                onRemove={() => setFormData({ ...formData, imageUrl: "" })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSizeGuide ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {viewingSizeGuide?.name} - {viewingSizeGuide?.category.name}
            </DialogTitle>
          </DialogHeader>

          {viewingSizeGuide && (
            <div className="relative w-full">
              <Image
                src={viewingSizeGuide.imageUrl}
                alt={viewingSizeGuide.name}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
