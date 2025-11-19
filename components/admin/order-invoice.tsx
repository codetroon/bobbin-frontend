"use client";

import PrintInvoice from "@/components/invoice/PrintInvoice";
import {
  resetInvoiceData,
  setInvoiceFromOrder,
} from "@/components/invoice/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

interface Order {
  id: string;
  customerName?: string;
  address?: string;
  contactNumber?: string;
  productId?: string;
  totalPrice?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: any;
  items?: any[];
  quantity?: number;
  tax?: number;
  shipping?: number;
}

interface OrderInvoiceProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoice({ order, isOpen, onClose }: OrderInvoiceProps) {
  useEffect(() => {
    if (isOpen && order) {
      setInvoiceFromOrder(order as any);
    }

    return () => {
      // reset to example values to avoid stale data
      resetInvoiceData();
    };
  }, [isOpen, order]);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Invoice</DialogTitle>
        </DialogHeader>

        {/* Render the existing PrintInvoice component. It reads values from components/invoice/data.ts */}
        <div className="p-4">
          <PrintInvoice />
        </div>
      </DialogContent>
    </Dialog>
  );
}
