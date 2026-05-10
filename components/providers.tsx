"use client";

import type React from "react";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "@/components/command-palette";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <CommandPalette />
    </ThemeProvider>
  );
}
