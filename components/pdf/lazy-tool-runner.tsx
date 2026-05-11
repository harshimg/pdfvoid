"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolClientConfig } from "@/lib/tools";

const ToolRunner = dynamic(
  () => import("@/components/pdf/tool-runner").then((mod) => mod.ToolRunner),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-96 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }
);

export function LazyToolRunner({ tool }: { tool: ToolClientConfig }) {
  return <ToolRunner tool={tool} />;
}
