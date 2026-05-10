"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools";
import { useCommandStore } from "@/lib/state";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const isOpen = useCommandStore((state) => state.isOpen);
  const close = useCommandStore((state) => state.close);
  const toggle = useCommandStore((state) => state.toggle);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm" onClick={close}>
      <Command
        className={cn(
          "mx-auto mt-20 max-w-xl overflow-hidden rounded-lg border bg-card shadow-2xl"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder="Search tools..."
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="p-4 text-sm text-muted-foreground">
            No tool found.
          </Command.Empty>
          {tools.map((tool) => (
            <Command.Item
              key={tool.slug}
              value={`${tool.name} ${tool.description}`}
              className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm aria-selected:bg-muted"
              onSelect={() => {
                router.push(`/tools/${tool.slug}`);
                close();
              }}
            >
              <tool.icon className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">{tool.name}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
