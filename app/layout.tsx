import type { Metadata, Viewport } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Open PDF Tools - Free PDF Toolkit",
    template: "%s | Open PDF Tools"
  },
  description:
    "Merge, split, compress, convert, watermark, rotate, reorder, and edit PDFs with a privacy-friendly toolkit built on open-source libraries.",
  keywords: [
    "free pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "pdf to images",
    "images to pdf",
    "open source pdf"
  ],
  authors: [{ name: "Open PDF Tools" }],
  creator: "Open PDF Tools",
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "Open PDF Tools",
    title: "Open PDF Tools - Free PDF Toolkit",
    description:
      "A modern free PDF toolkit with open-source processing and Vercel-ready architecture.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Open PDF Tools" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Open PDF Tools",
    description: "Free PDF toolkit for everyday document work.",
    images: ["/og.svg"]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
