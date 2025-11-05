import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="mb-2 text-2xl font-bold">Category Not Found</h1>

        <p className="mb-6 text-muted-foreground">
          The category you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
