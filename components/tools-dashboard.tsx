"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, tools, type ToolCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ToolsDashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ToolCategory>("all");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesQuery = `${tool.name} ${tool.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search PDF tools"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((item) => (
            <Button
              key={item.id}
              variant={category === item.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(item.id)}
              className={cn("shrink-0", category === item.id && "shadow-sm")}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      {filteredTools.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed bg-card p-10 text-center">
          <p className="font-medium">No tools found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
