import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
import { LazyToolRunner } from "@/components/pdf/lazy-tool-runner";
import { getRelatedSeoPages, getSeoFaqs, getSeoHowToSteps, getSeoLongContent, type SeoPage } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";
import { tools, type Tool } from "@/lib/tools";
import Link from "next/link";

type ToolPageShellProps = {
  tool: Tool;
  seoPage?: SeoPage;
  pathname: string;
};

export function ToolPageShell({ tool, seoPage, pathname }: ToolPageShellProps) {
  const h1 = seoPage?.title ?? tool.name;
  const intro = seoPage?.intro ?? tool.description;
  const pageUrl = `${siteConfig.url}${pathname}`;
  const faqs = seoPage ? getSeoFaqs(seoPage, tool) : [];
  const howToSteps = seoPage ? getSeoHowToSteps(seoPage, tool) : [];
  const longContent = seoPage ? getSeoLongContent(seoPage, tool) : undefined;
  const relatedPages = seoPage ? getRelatedSeoPages(seoPage) : [];

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
      {seoPage ? (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "PDF Tools",
                  item: `${siteConfig.url}/tools`
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: h1,
                  item: pageUrl
                }
              ]
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a
                }
              }))
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: h1,
              description: seoPage.description,
              step: howToSteps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step.title,
                text: step.text
              }))
            }}
          />
        </>
      ) : null}
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
      {seoPage && longContent ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-semibold">{longContent.heading}</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                {longContent.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-semibold">How to use this PDF tool</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {howToSteps.map((step, index) => (
                  <div key={step.title} className="rounded-lg border bg-muted/25 p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <h3 className="mt-3 font-medium">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-semibold">FAQ</h2>
              <div className="mt-5 grid gap-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related PDF tools</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {relatedPages.map((page) => {
                  const relatedTool = tools.find((item) => item.slug === page.toolSlug);
                  return (
                    <Link
                      key={page.slug}
                      href={`/${page.slug}`}
                      className="rounded-lg border bg-background p-3 text-sm transition hover:border-primary/60 hover:text-primary"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {relatedTool ? <relatedTool.icon className="h-4 w-4" /> : null}
                        {page.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {page.description}
                      </span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why PDFVoid?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>PDFVoid keeps common PDF tools simple, fast, and easy to use from any modern browser.</p>
                <p>Each tool page includes clear controls, helpful instructions, related PDF workflows, and direct downloads.</p>
              </CardContent>
            </Card>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
