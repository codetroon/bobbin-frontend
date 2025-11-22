"use client";

import { ProductForm } from "@/components/admin/product-form";
import { SizeManager } from "@/components/admin/size-manager";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api";
import { Edit, PackageOpen, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  productCode: string;
  description?: string;
  price: number;
  details?: string;
  materials?: string[];
  colors?: string[];
  images: string[];
  categoryId: string;
  category?: { id: string; name: string };
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [selectedProductForSizes, setSelectedProductForSizes] =
    useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getProducts({ page, limit });

      let productsData: Product[] = [];
      let meta: any = null;

      if (!response) {
        productsData = [];
      } else if (response.data?.data) {
        // shape: { data: { data: [], meta: {} } }
        productsData = response.data.data;
        meta = response.data.meta || response.meta;
      } else if (Array.isArray(response.data)) {
        // shape: { data: [] }
        productsData = response.data;
        meta = response.meta || response.data?.meta;
      } else if (response?.data) {
        productsData = response.data;
        meta = response.meta || response.data?.meta;
      } else {
        productsData = response || [];
        meta = response?.meta || null;
      }

      // If page returned empty but previous page exists, go back a page
      if (productsData.length === 0 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
        return;
      }

      setProducts(productsData);

      const computedTotal =
        meta?.total ||
        meta?.totalDocs ||
        meta?.count ||
        meta?.itemsCount ||
        productsData.length;
      if (meta) {
        setTotal(computedTotal);
        setTotalPages(
          meta.totalPages || Math.max(1, Math.ceil(computedTotal / limit))
        );
      } else {
        setTotal(productsData.length);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiClient.deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    // Transform product data to match form expectations
    const formattedProduct: Product = {
      ...product,
      categoryId: product.categoryId || product.category?.id || "",
      materials: product.materials || [],
      colors: product.colors || [],
      images: product.images || [],
    };
    setEditingProduct(formattedProduct);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleCloseDialog();
    fetchProducts();
  };

  const handleManageSizes = (product: Product) => {
    setSelectedProductForSizes(product);
    setIsSizeDialogOpen(true);
  };

  const handleCloseSizeDialog = () => {
    setIsSizeDialogOpen(false);
    setSelectedProductForSizes(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Products
          </h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            className="flex items-center space-x-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the product information"
                  : "Create a new product for your store"}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              productData={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
          <CardDescription>
            Find products by name or product code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.productCode}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category?.name || "No category"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManageSizes(product)}
                        title="Manage Sizes"
                      >
                        <PackageOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchQuery
                  ? "No products found matching your search."
                  : "No products found."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Size Management Dialog */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Sizes - {selectedProductForSizes?.name}
            </DialogTitle>
            <DialogDescription>
              Add, update, or remove sizes and manage stock levels for this
              product
            </DialogDescription>
          </DialogHeader>
          {selectedProductForSizes && (
            <SizeManager productId={selectedProductForSizes.id} />
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={handleCloseSizeDialog}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
