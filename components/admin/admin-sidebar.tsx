"use client";

import bobbinLogo from "@/assets/bobbin-logo.png";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Home,
  HomeIcon,
  Image as ImageIcon,
  Mail,
  Package,
  Ruler,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  className?: string;
  onClose?: () => void;
  mobile?: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Sizes", href: "/admin/sizes", icon: Box },
  { name: "Size Guides", href: "/admin/size-guides", icon: Ruler },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Hero", href: "/admin/hero", icon: ImageIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  className,
  onClose,
  mobile = false,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        mobile ? "translate-x-0" : "",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Image
              src={bobbinLogo.src}
              alt="Bobbin Admin"
              width={32}
              height={32}
            />
          </div>
          <span className="text-xl font-bold text-gray-900">Bobbin Admin</span>
        </div>
        {mobile && (
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-6">
        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={mobile ? onClose : undefined}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-indigo-100 text-bobbinBg border-r-2 border-bobbinBg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive ? "text-bobbinText" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <HomeIcon className="mr-3 h-5 w-5 text-gray-400" />
          Back to Homepage
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin Panel
            </p>
            <p className="text-xs text-gray-500 truncate">Bobbin Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
