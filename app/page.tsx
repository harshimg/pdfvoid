import Link from "next/link";
import { ArrowRight, Check, FileCheck2, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/tool-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { getToolHref } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

const highlights = [
  "Free online PDF tools",
  "No signup required",
  "Works on mobile and desktop",
  "Private, browser-friendly workflows"
];

const faqs = [
  {
    q: "Is PDFVoid free to use?",
    a: "Yes. PDFVoid provides free online PDF tools for common tasks like merging, splitting, converting, rotating, and watermarking PDFs."
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can open a tool, upload supported files, process them, and download the result without creating an account."
  },
  {
    q: "Which PDF tools are available?",
    a: "PDFVoid includes tools for merge PDF, split PDF, compress PDF, PDF to JPG, JPG to PDF, watermark, page numbers, metadata, links, OCR, and more."
  }
];

export default function HomePage() {
  const featuredTools = tools.slice(0, 6);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          alternateName: ["PDF Void", "PDFVoid PDF Tools"],
          url: siteConfig.url,
          description: siteConfig.description
        }}
      />
      <AdSlot placement="top-banner" />
      <section className="surface-grid overflow-hidden border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge variant="secondary">Free online PDF tools</Badge>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              PDFVoid
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Merge, split, compress, convert, rotate, watermark, edit, OCR, and
              organize PDFs with simple tools that work directly in your browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/tools">
                  Open tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Explore features</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
            <div className="relative rounded-lg border bg-card/90 p-4 shadow-glow backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredTools.map((tool) => (
                  <Link
                    href={getToolHref(tool.slug)}
                    key={tool.slug}
                    className="rounded-lg border bg-background/70 p-4 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <tool.icon className="h-6 w-6 text-primary" />
                    <p className="mt-4 font-medium">{tool.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="outline">Toolkit</Badge>
            <h2 className="mt-3 text-3xl font-semibold">Everything in one dashboard</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Search for a PDF tool, upload your files, preview pages when needed,
              choose options, and download the finished document from one clean workspace.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/tools">View all tools</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 9).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/35">
        <div className="container grid gap-4 py-14 md:grid-cols-3">
          {[
            { icon: Zap, title: "Fast workflow", text: "Open a tool, upload files, set options, and download the result without unnecessary steps." },
            { icon: Lock, title: "Privacy-minded", text: "PDFVoid is designed for local previews, strict upload validation, and simple file handling." },
            { icon: FileCheck2, title: "Useful PDF tasks", text: "Handle common PDF jobs such as merging, splitting, converting, OCR, watermarking, and page editing." }
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="h-6 w-6 text-primary" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="free-tools" className="container py-16">
        <div className="text-center">
          <Badge variant="secondary">Free tools</Badge>
          <h2 className="mt-3 text-3xl font-semibold">PDF tools without the clutter</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            PDFVoid focuses on quick document tasks, clear controls, mobile-friendly
            layouts, and direct downloads.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Convert</CardTitle>
              <CardDescription>Turn PDFs into images or images into PDFs.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>PDF to JPG</li>
                <li>PDF to PNG</li>
                <li>JPG and PNG to PDF</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organize</CardTitle>
              <CardDescription>Clean up page order and document structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Merge PDF</li>
                <li>Split PDF</li>
                <li>Delete and rearrange pages</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Edit</CardTitle>
              <CardDescription>Add useful finishing touches to your PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Watermark</li>
                <li>Page numbers</li>
                <li>Hyperlinks and metadata</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="border-t bg-muted/35">
        <div className="container py-16">
          <h2 className="text-3xl font-semibold">FAQ</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                  <CardDescription>{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
