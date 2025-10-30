import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 ">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-bobbinText">bobbin</h3>
            <p className="text-sm text-black">
              Premium fashion essentials for the modern gentleman.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-bobbinText">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-black">
                <Link
                  href="/men/t-shirt"
                  className="text-black hover:text-foreground transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li className="text-black">
                <Link
                  href="/men/punjabi"
                  className="text-black hover:text-foreground transition-colors"
                >
                  Punjabi
                </Link>
              </li>
              <li className="text-black">
                <Link
                  href="/men/joggers"
                  className="text-black hover:text-foreground transition-colors"
                >
                  Joggers
                </Link>
              </li>
              <li className="text-black">
                <Link
                  href="/men/hoodie"
                  className="text-black hover:text-foreground transition-colors"
                >
                  Hoodies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-bobbinText">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-black">
              <li className="text-black">
                <Link
                  href="/about"
                  className="text-black hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li className="text-black">
                <Link
                  href="/contact"
                  className="text-black hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-bobbinText">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-black hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-black hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-black hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-black">
          <p>&copy; {new Date().getFullYear()} bobbin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
