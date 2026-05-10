import { cn } from "@/lib/utils";

type AdSlotProps = {
  placement: "top-banner" | "sidebar" | "in-content" | "mobile-sticky";
  className?: string;
};

const labels: Record<AdSlotProps["placement"], string> = {
  "top-banner": "Top banner ad placeholder",
  sidebar: "Sidebar ad placeholder",
  "in-content": "In-content ad placeholder",
  "mobile-sticky": "Mobile sticky ad placeholder"
};

export function AdSlot({ placement, className }: AdSlotProps) {
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  if (!enabled) return null;

  return (
    <aside
      className={cn(
        "flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-muted/50 p-4 text-xs text-muted-foreground",
        placement === "mobile-sticky" && "fixed inset-x-3 bottom-3 z-30 md:hidden",
        className
      )}
      data-ad-placement={placement}
    >
      {labels[placement]}
    </aside>
  );
}
