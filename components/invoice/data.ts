export let companyInfo = {
  name: "Bobbin",
  phone: "01609 469623",
  mail: "info@bobbin.com.bd",
  addressLines: [""],
};

export let invoiceMeta = {
  number: "INV-2025-019",
  date: "19 October 2025",
};

export let recipient = {
  name: "Kazi Md Mostafa Raihan",
  phone: "01313703014",
  address:
    "Flat no: C-1, Dom Inno Abrigo, 20 Gaus Nagar road, New Eskaton ,Dhaka-1000",
};

export let subject = "T-shirt and Documents";

export let tableData = [
  {
    sl: 1,
    description: "Cotton t-shirt",
    itemType: "Garments",
    quantity: 2,
    unitPrice: 300.0,
    total: 600.0,
  },
  {
    sl: 2,
    description: "Agreement Paper",
    itemType: "Documents",
    quantity: 4,
    unitPrice: 50.0,
    total: 200.0,
  },
];

export let totalData = [
  {
    label: "Subtotal",
    value: 800.0,
  },
  {
    label: "Tax",
    value: 0.0,
  },
  {
    label: "Total (BDT)",
    value: 800.0,
  },
];

// Populate exported values from an order object.
// This keeps `PrintInvoice.tsx` unchanged while allowing dynamic data.
export function setInvoiceFromOrder(order: any) {
  if (!order) return;

  invoiceMeta = {
    number: order.id
      ? `INV-${String(order.id).slice(-8).toUpperCase()}`
      : invoiceMeta.number,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : invoiceMeta.date,
  };

  recipient = {
    name: order.customerName || order.recipientName || recipient.name,
    phone: order.contactNumber || recipient.phone,
    address: order.address || recipient.address || "",
  };

  subject =
    order.subject ||
    `Order ${order.id ? String(order.id).slice(-8).toUpperCase() : ""}`;

  // Build table rows from order items or single product info
  const items: any[] = [];
  if (Array.isArray((order as any).items) && (order as any).items.length) {
    (order as any).items.forEach((it: any, idx: number) => {
      const qty = it.qty || it.quantity || 1;
      const unit = it.unitPrice || it.price || 0;
      items.push({
        sl: idx + 1,
        description: it.name || it.description || "-",
        itemType: it.itemType || it.category || "",
        quantity: qty,
        unitPrice: unit,
        total: Number(qty * unit || 0),
      });
    });
  } else {
    const qty = (order as any).quantity || 1;
    const prod = (order as any).products || (order as any).product || null;
    items.push({
      sl: 1,
      description: prod?.name || prod?.title || prod?.description || "-",
      itemType: prod?.category?.name || "",
      quantity: qty,
      unitPrice: prod?.price || (order as any).unitPrice || 0,
      total: Number((prod?.price || (order as any).unitPrice || 0) * qty || 0),
    });
  }

  tableData = items;

  const subtotal = tableData.reduce(
    (s: number, r: any) => s + (Number(r.total) || 0),
    0
  );
  const tax = (order as any).tax || 0;
  const shipping = (order as any).shipping || 0;
  const grand = subtotal + (Number(tax) || 0) + (Number(shipping) || 0);

  totalData = [
    { label: "Subtotal", value: Number(subtotal) || 0 },
    { label: "Tax", value: Number(tax) || 0 },
    { label: "Shipping", value: Number(shipping) || 0 },
    { label: "Total (BDT)", value: Number(grand) || 0 },
  ];
}

export function resetInvoiceData() {
  // Reset to initial example values if needed
  companyInfo = {
    name: "Bobbin",
    phone: "01609 469623",
    mail: "info@bobbin.com.bd",
    addressLines: [""],
  };

  invoiceMeta = {
    number: "INV-2025-019",
    date: "19 October 2025",
  };

  recipient = {
    name: "Kazi Md Mostafa Raihan",
    phone: "01313703014",

    address:
      "Flat no: C-1, Dom Inno Abrigo, 20 Gaus Nagar road, New Eskaton ,Dhaka-1000",
  };

  subject = "T-shirt and Documents";

  tableData = [
    {
      sl: 1,
      description: "Cotton t-shirt",
      itemType: "Garments",
      quantity: 2,
      unitPrice: 300.0,
      total: 600.0,
    },
    {
      sl: 2,
      description: "Agreement Paper",
      itemType: "Documents",
      quantity: 4,
      unitPrice: 50.0,
      total: 200.0,
    },
  ];

  totalData = [
    { label: "Subtotal", value: 800.0 },
    { label: "Tax", value: 0.0 },
    { label: "Total (BDT)", value: 800.0 },
  ];
}
