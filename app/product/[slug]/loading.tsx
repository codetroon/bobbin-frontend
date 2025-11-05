import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <nav className="mb-6 flex items-center space-x-2">
          <Skeleton className="h-4 w-12" />
          <span>/</span>
          <Skeleton className="h-4 w-16" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
        </nav>

        {/* Product details skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="h-24 w-full" />

            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            <div className="space-y-4 border-t pt-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <section className="border-t bg-muted/30 py-16 mt-8">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
