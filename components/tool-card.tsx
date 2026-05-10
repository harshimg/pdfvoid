import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card className="h-full transition duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <tool.icon className="h-5 w-5" />
            </span>
            {tool.status === "adapter" ? <Badge variant="muted">Adapter</Badge> : null}
          </div>
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
          <span className="inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
            Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </CardHeader>
      </Card>
    </Link>
  );
}
