"use client";

import bobbinLogo from "@/assets/bobbin-logo.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface Order {
  id: string;
  customerName: string;
  address: string;
  contactNumber: string;
  productId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  products: {
    id: string;
    name: string;
    productCode: string;
    price: number;
    description?: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

interface OrderInvoiceProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoice({ order, isOpen, onClose }: OrderInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = invoiceRef.current?.innerHTML;
    if (!printContents) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order?.id.slice(-8).toUpperCase()}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              padding: 20px;
              background: white;
              color: #000;
            }
            .invoice-wrapper {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 2px solid #1f2937;
            }
            .logo-section img {
              height: 48px;
              width: auto;
              margin-bottom: 16px;
            }
            .company-info {
              font-size: 14px;
              color: #4b5563;
              line-height: 1.6;
            }
            .company-info .tagline {
              font-weight: 600;
              margin-bottom: 8px;
            }
            .invoice-header {
              text-align: right;
            }
            .invoice-header h1 {
              font-size: 36px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 12px;
            }
            .invoice-details {
              font-size: 14px;
              line-height: 1.8;
            }
            .invoice-details span {
              font-weight: 600;
            }
            .status {
              color: #2563eb;
              text-transform: uppercase;
              font-weight: 600;
            }
            .bill-to {
              margin-bottom: 40px;
            }
            .bill-to h3 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 16px;
              color: #1f2937;
            }
            .customer-info {
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .customer-info p {
              margin-bottom: 8px;
              font-size: 14px;
              color: #374151;
            }
            .customer-name {
              font-weight: 600;
              color: #1f2937 !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            thead {
              background: #1f2937;
              color: white;
            }
            th {
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
            }
            th.text-right {
              text-align: right;
            }
            th.text-center {
              text-align: center;
            }
            tbody tr {
              border-bottom: 1px solid #d1d5db;
            }
            td {
              padding: 12px;
              font-size: 14px;
              color: #374151;
            }
            td.text-right {
              text-align: right;
            }
            td.text-center {
              text-align: center;
            }
            .product-name {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .product-desc {
              font-size: 12px;
              color: #6b7280;
            }
            .totals {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            .totals-table {
              width: 320px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #d1d5db;
            }
            .total-row.final {
              background: #1f2937;
              color: white;
              padding: 12px 16px;
              border-radius: 8px;
              margin-top: 8px;
              font-size: 18px;
              font-weight: bold;
            }
            .payment-info {
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 40px;
            }
            .payment-info h3 {
              font-size: 14px;
              font-weight: bold;
              color: #1e3a8a;
              margin-bottom: 8px;
            }
            .payment-info p {
              font-size: 14px;
              color: #1e40af;
              margin-bottom: 4px;
            }
            .terms {
              border-top: 2px solid #1f2937;
              padding-top: 24px;
              margin-bottom: 40px;
            }
            .terms h3 {
              font-size: 14px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 12px;
            }
            .terms ul {
              list-style: none;
              font-size: 12px;
              color: #4b5563;
              line-height: 1.8;
            }
            .footer {
              text-align: center;
              padding-top: 24px;
              border-top: 1px solid #d1d5db;
            }
            .footer p {
              margin-bottom: 12px;
              font-size: 14px;
              color: #4b5563;
              font-weight: 600;
            }
            .footer img {
              height: 32px;
              width: auto;
              opacity: 0.6;
              margin-bottom: 8px;
            }
            .footer .small {
              font-size: 12px;
              color: #6b7280;
            }
            @media print {
              body { padding: 0; }
              @page { margin: 15mm; size: A4 portrait; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            ${printContents}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    handlePrint(); // Same as print, browser will handle save as PDF
  };

  if (!order) return null;

  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const invoiceNumber = `INV-${order.id.slice(-8).toUpperCase()}`;
  const orderNumber = `ORD-${order.id.slice(-8).toUpperCase()}`;

  // Calculate tax and subtotal (you can adjust these calculations)
  const subtotal = order.totalPrice / 1.1; // Assuming 10% tax included
  const tax = order.totalPrice - subtotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Invoice</span>
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          ref={invoiceRef}
          id="invoice-content"
          className="bg-white p-8 rounded-lg"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-800">
            <div className="flex items-center">
              <Image
                src={bobbinLogo}
                alt="Bobbin Logo"
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <p className="text-sm text-gray-600 font-semibold">
                Bobbin Fashion Store
              </p>
              <p className="text-xs text-gray-500">
                123 Fashion Street, Dhaka, Bangladesh
              </p>
              <p className="text-xs text-gray-500">Phone: +880 1234-567890</p>
              <p className="text-xs text-gray-500">Email: contact@bobbin.com</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Invoice ID:</span>{" "}
                {order.id}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Status:</span>{" "}
                <span className="uppercase font-bold">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Bill To
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {order.customerName}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Phone:</span>{" "}
                {order.contactNumber}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Address:</span> {order.address}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Product Code
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.products?.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.products?.productCode || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    ৳{order.products?.price.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right font-semibold">
                    ৳{order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm text-gray-900 font-semibold">
                  ৳{order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-sm text-gray-600">Shipping:</span>
                <span className="text-sm text-gray-900">৳0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm text-gray-900">৳0.00</span>
              </div>
              <div className="flex justify-between py-3 bg-gray-800 text-white px-4 rounded-lg mt-2">
                <span className="text-base font-bold">Total:</span>
                <span className="text-base font-bold">
                  ৳{order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-900 mb-2">
              PAYMENT INFORMATION
            </h3>
            <p className="text-sm text-blue-800">
              Payment Method: Cash on Delivery (COD)
            </p>
            <p className="text-sm text-blue-800">
              Payment Status:{" "}
              {order.status === "delivered" ? "Paid" : "Pending"}
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="border-t-2 border-gray-800 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              TERMS & CONDITIONS
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• All items are subject to availability.</li>
              <li>
                • Returns are accepted within 7 days of delivery with original
                tags and packaging.
              </li>
              <li>
                • For any queries regarding this invoice, please contact us at
                contact@bobbin.com
              </li>
              <li>• This is a computer-generated invoice.</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600 font-semibold mb-3">
              Thank you for your business!
            </p>
            <div className="flex justify-center mb-2">
              <Image
                src={bobbinLogo}
                alt="Bobbin Logo"
                width={100}
                height={30}
                className="h-8 w-auto opacity-60"
              />
            </div>
            <p className="text-xs text-gray-500">
              Premium Fashion & Apparel | www.bobbin.com
            </p>
          </div>
        </div>
      </DialogContent>

      {/* Remove the inline styles since we're using a new window */}
    </Dialog>
  );
}
