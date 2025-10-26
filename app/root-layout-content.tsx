"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bobbinBg">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
