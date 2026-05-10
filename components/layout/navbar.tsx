"use client";

import Link from "next/link";
import { FileText, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandStore } from "@/lib/state";

export function Navbar() {
  const openCommand = useCommandStore((state) => state.open);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </span>
          <span>Open PDF Tools</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/tools" className="hover:text-foreground">
            Tools
          </Link>
          <Link href="/#pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden gap-2 sm:flex" onClick={openCommand}>
            <Search className="h-4 w-4" />
            Search
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Ctrl K
            </kbd>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={openCommand}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
