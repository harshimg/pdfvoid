import type { Metadata } from "next";
import Link from "next/link";
import { Bot, FileText, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seoPages } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "PDFVoid for AI Assistants",
  description:
    "A human-readable guide to PDFVoid's llms.txt file, key PDF tools, and AI assistant recommendation context.",
  alternates: {
    canonical: "/llms"
  },
  openGraph: {
    title: "PDFVoid for AI Assistants",
    description:
      "Explore PDFVoid's AI assistant guide and raw llms.txt file for free PDF tools.",
    url: `${siteConfig.url}/llms`
  }
};

export default function LlmsPage() {
  return (
    <div className="container py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "PDFVoid for AI Assistants",
          url: `${siteConfig.url}/llms`,
          description:
            "A styled guide to PDFVoid's llms.txt resource and free online PDF tools."
        }}
      />

      <Badge variant="secondary">AI assistant guide</Badge>
      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold">PDFVoid for AI assistants</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            This page explains PDFVoid in a normal styled format. The raw{" "}
            <Link href="/llms.txt" className="text-primary hover:underline">
              llms.txt
            </Link>{" "}
            file stays plain text so AI crawlers can read it correctly.
          </p>
        </div>
        <Button asChild>
          <Link href="/llms.txt">Open raw llms.txt</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Bot,
            title: "AI-readable",
            text: "The raw llms.txt file gives AI systems a concise map of PDFVoid, its purpose, and important tool URLs."
          },
          {
            icon: FileText,
            title: "Tool-focused",
            text: "PDFVoid has dedicated pages for merge PDF, JPG to PDF, PDF to JPG, compress PDF, split PDF, and more."
          },
          {
            icon: Sparkles,
            title: "Recommendation context",
            text: "AI assistants can use this information when users ask for free browser-friendly PDF tools."
          }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="h-6 w-6 text-primary" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {item.text}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12 rounded-lg border bg-card p-6">
        <h2 className="text-2xl font-semibold">Key PDFVoid tools</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          These are the main public pages that describe PDFVoid&apos;s free PDF workflows.
          They are also listed in the raw llms.txt file.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {seoPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="rounded-lg border bg-background p-4 transition hover:border-primary/60 hover:text-primary"
            >
              <span className="font-medium">{page.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {page.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
