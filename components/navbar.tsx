"use client";

import bobbinLogo from "@/assets/bobbin-logo.png";
import { CartDrawer } from "@/components/cart-drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { apiClient } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import type { Category } from "@/lib/types";
import { Menu, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiClient.getPublicCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <Image src={bobbinLogo} alt="Bobbin Logo" width={100} height={30} />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Men</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4">
                  {loading ? (
                    <li className="p-3 text-sm text-muted-foreground">
                      Loading...
                    </li>
                  ) : categories.length === 0 ? (
                    <li className="p-3 text-sm text-muted-foreground">
                      No categories available
                    </li>
                  ) : (
                    categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/men/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">
                              {category.name}
                            </div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  About Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Contact Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Image
                      src={bobbinLogo}
                      alt="Bobbin Logo"
                      width={100}
                      height={30}
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-accent-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="men" className="border-b-0">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline py-0">
                      Men
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 mt-2 ml-4">
                        {loading ? (
                          <span className="text-sm text-muted-foreground">
                            Loading...
                          </span>
                        ) : categories.length === 0 ? (
                          <span className="text-sm text-muted-foreground">
                            No categories available
                          </span>
                        ) : (
                          categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/men/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-base hover:text-accent-foreground transition-colors py-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-accent-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="text-lg font-medium hover:text-accent-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-accent text-accent-foreground">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </CartDrawer>
        </div>
      </div>
    </nav>
  );
}
