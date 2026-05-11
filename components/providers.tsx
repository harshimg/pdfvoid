"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <CommandPalette />
    </ThemeProvider>
  );
}
