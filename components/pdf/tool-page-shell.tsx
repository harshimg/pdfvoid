import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { LazyToolRunner } from "@/components/pdf/lazy-tool-runner";
import type { SeoPage } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";
import type { Tool } from "@/lib/tools";

type ToolPageShellProps = {
  tool: Tool;
  seoPage?: SeoPage;
  pathname: string;
};

export function ToolPageShell({ tool, seoPage, pathname }: ToolPageShellProps) {
  const h1 = seoPage?.h1 ?? tool.name;
  const intro = seoPage?.intro ?? tool.description;
  const pageUrl = `${siteConfig.url}${pathname}`;

  return (
    <div className="container py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: h1,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          url: pageUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          provider: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          }
        }}
      />
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <Badge variant={tool.status === "adapter" ? "muted" : "secondary"}>
            {tool.category}
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold">{h1}</h1>
          <p className="mt-3 text-muted-foreground">{intro}</p>
          {seoPage ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Popular searches: {seoPage.keywords.join(", ")}.
            </p>
          ) : null}
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
          <tool.icon className="h-7 w-7" />
        </div>
      </div>
      <LazyToolRunner
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
