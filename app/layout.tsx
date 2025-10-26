import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutContent } from "./root-layout-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bobbin - Premium Fashion for Men",
  description:
    "Discover premium fashion essentials crafted for the modern gentleman. Shop T-shirts, Punjabi, Joggers, and Hoodies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-bobbinBg"}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
