import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ToolRunner } from "@/components/pdf/tool-runner";
import { getTool, tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - Open PDF Tools`,
      description: tool.description
    }
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <Badge variant={tool.status === "adapter" ? "muted" : "secondary"}>
            {tool.category}
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold">{tool.name}</h1>
          <p className="mt-3 text-muted-foreground">{tool.description}</p>
        </div>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
          <tool.icon className="h-7 w-7" />
        </div>
      </div>
      <ToolRunner
        tool={{
          slug: tool.slug,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          accepts: tool.accepts,
          multiple: tool.multiple,
          output: tool.output,
          status: tool.status
        }}
      />
    </div>
  );
}
