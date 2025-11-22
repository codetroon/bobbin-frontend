"use client";

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Size {
  id: string;
  name: string;
  stock: number;
  productId: string;
  product: {
    name: string;
    productCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  productCode: string;
}

const sizeSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  stock: z.number().min(0, "Stock must be a positive number"),
  productId: z.string().min(1, "Product is required"),
});

type SizeFormData = z.infer<typeof sizeSchema>;

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: "",
      stock: 0,
      productId: "",
    },
  });

  useEffect(() => {
    fetchSizes();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    if (editingSize) {
      form.reset({
        name: editingSize.name,
        stock: editingSize.stock,
        productId: editingSize.productId,
      });
    } else {
      form.reset({
        name: "",
        stock: 0,
        productId: "",
      });
    }
  }, [editingSize, form]);

  const fetchSizes = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSizes({ page, limit });

      // Response shape can vary. Handle common shapes:
      // 1. { data: { data: Size[], meta: { total, page, limit, totalPages } } }
      // 2. { data: Size[] }
      let sizesData: Size[] = [];
      let meta: any = null;

      if (!response) {
        sizesData = [];
      } else if (response.data?.data) {
        // shape: { data: { data: [], meta: {} } }
        sizesData = response.data.data;
        meta = response.data.meta || response.meta;
      } else if (Array.isArray(response.data)) {
        // shape: { data: [] }
        sizesData = response.data;
        meta = response.meta || response.data?.meta;
      } else if (response?.data) {
        // fallback if data is present but not in the expected place
        sizesData = response.data;
        meta = response.meta || response.data?.meta;
      } else {
        // fallback to top-level array or meta
        sizesData = response || [];
        meta = response?.meta || null;
      }

      // If requested page returned empty but there are previous pages, go back one page
      if (sizesData.length === 0 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
        return;
      }

      setSizes(sizesData || []);

      const computedTotal =
        meta?.total ||
        meta?.totalDocs ||
        meta?.count ||
        meta?.itemsCount ||
        sizesData.length;
      if (meta) {
        setTotal(computedTotal);
        setTotalPages(
          meta.totalPages || Math.max(1, Math.ceil(computedTotal / limit))
        );
      } else {
        setTotal(sizesData.length);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error("Failed to fetch sizes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts({ limit: 1000 });
      setProducts(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const onSubmit = async (data: SizeFormData) => {
    try {
      if (editingSize) {
        await apiClient.updateSize(editingSize.id, {
          name: data.name,
          stock: data.stock,
        });
        toast.success("Size updated successfully");
      } else {
        await apiClient.createSize(data);
        toast.success("Size created successfully");
      }

      setIsDialogOpen(false);
      setEditingSize(null);
      form.reset();
      fetchSizes();
    } catch (error) {
      toast.error(`Failed to ${editingSize ? "update" : "create"} size`);
    }
  };

  const handleDeleteSize = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    try {
      await apiClient.deleteSize(id);
      toast.success("Size deleted successfully");
      // refetch after delete; fetchSizes will adjust page if needed
      fetchSizes();
    } catch (error) {
      toast.error("Failed to delete size");
    }
  };

  const handleEditSize = (size: Size) => {
    setEditingSize(size);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSize(null);
    form.reset();
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (stock < 10)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
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
            Sizes & Stock
          </h1>
          <p className="text-gray-600 mt-2">
            Manage product sizes and inventory levels
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Size</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSize ? "Edit Size" : "Add New Size"}
              </DialogTitle>
              <DialogDescription>
                {editingSize
                  ? "Update the size information and stock level"
                  : "Create a new size variant for a product"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!!editingSize}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.productCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., S, M, L, XL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter stock quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSize ? "Update" : "Create"} Size
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sizes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {sizes.filter((size) => size.stock < 10 && size.stock > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {sizes.filter((size) => size.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing page {page} of {totalPages} ({total} items)
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="rounded-md border px-2 py-1 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant={page < totalPages ? undefined : "outline"}
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={
                page < totalPages
                  ? "bg-accent text-white hover:bg-accent/90"
                  : ""
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Sizes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Sizes ({sizes.length})</CardTitle>
          <CardDescription>
            Manage sizes and stock levels for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((size) => {
                const stockStatus = getStockStatus(size.stock);
                return (
                  <TableRow key={size.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{size.product?.name}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {size.product?.productCode}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{size.name}</TableCell>
                    <TableCell className="font-medium">{size.stock}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}
                      >
                        {stockStatus.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(size.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(size.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSize(size)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSize(size.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sizes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                No sizes found. Create your first size variant to get started.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
