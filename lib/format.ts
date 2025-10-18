export function formatBDT(paisa: number): string {
  const taka = paisa / 100;
  return `৳${taka.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateDiscountedPrice(basePrice: number, discountPercent: number): number {
  return Math.round(basePrice * (1 - discountPercent / 100));
}

export function calculateDiscount(basePrice: number, discountPercent: number): number {
  return Math.round(basePrice * (discountPercent / 100));
}
