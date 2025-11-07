"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  Hash,
  MapPin,
  Package,
  Phone,
  Ruler,
  User,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailsDialogProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const orderStatuses = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const statusObj = orderStatuses.find((s) => s.value === order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Package className="h-6 w-6" />
            Order Details
          </DialogTitle>
          <DialogDescription>Order ID: #{order.id.slice(-8)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={`mt-1 ${statusObj?.color}`}>
                {statusObj?.label || order.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4" />
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Contact Number
                </p>
                <p className="font-medium">{order.contactNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Delivery Address
                </p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </h3>

            {order.products && (
              <div className="border rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  {order.products.images &&
                    order.products.images.length > 0 && (
                      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={order.products.images[0]}
                          alt={order.products.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                    )}

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {order.products.name}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {order.products.productCode}
                      </p>
                    </div>

                    {order.products.category && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Category
                        </p>
                        <Badge variant="outline">
                          {order.products.category.name}
                        </Badge>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          Size
                        </p>
                        <p className="font-semibold text-lg">
                          {order.size || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Quantity
                        </p>
                        <p className="font-semibold text-lg">
                          × {order.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Unit Price
                      </p>
                      <p className="font-medium">
                        ${order.products.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                {order.products.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm mt-1">{order.products.description}</p>
                  </div>
                )}

                {/* Additional Product Info */}
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  {order.products.materials &&
                    order.products.materials.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Materials
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.products.materials.map(
                            (material: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {material}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  {order.products.colors &&
                    order.products.colors.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Colors</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.products.colors.map(
                            (color: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {color}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Order Summary
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({order.quantity || 1} × $
                  {order.products?.price.toFixed(2) || "0.00"})
                </span>
                <span className="font-medium">
                  $
                  {(
                    (order.products?.price || 0) * (order.quantity || 1)
                  ).toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
