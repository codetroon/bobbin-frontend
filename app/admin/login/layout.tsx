import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Bobbin",
  description: "Admin login page for Bobbin store management",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
