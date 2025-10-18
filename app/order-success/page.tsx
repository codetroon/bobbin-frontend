'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CircleCheck as CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">Order Placed Successfully!</h1>

        <p className="mb-2 text-muted-foreground">
          Thank you for your order. We&apos;ll process it shortly.
        </p>

        {orderId && (
          <p className="mb-6 text-sm text-muted-foreground">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        )}

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
