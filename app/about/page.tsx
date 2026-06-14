import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About PDFVoid",
  description:
    "Learn about PDFVoid, a free-first online PDF toolkit built with open-source libraries for merging, converting, organizing, and editing PDFs.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About PDFVoid",
    description:
      "PDFVoid is a free-first PDF toolkit focused on useful tools, clear SEO pages, privacy-minded processing, and modern web performance.",
    url: `${siteConfig.url}/about`
  }
};

export default function AboutPage() {
  return (
    <div className="container py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About PDFVoid",
          url: `${siteConfig.url}/about`,
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description
          }
        }}
      />
      <Badge variant="secondary">About</Badge>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold">About PDFVoid</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
        PDFVoid is a free-first online PDF toolkit built for everyday document work:
        merge PDFs, split pages, convert PDF to images, convert JPG or PNG to PDF,
        rotate pages, delete pages, add watermarks, edit metadata, add hyperlinks,
        and preview documents in the browser.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Free-first",
            text: "The early product is designed to run without paid PDF APIs or external PDF SaaS services."
          },
          {
            title: "Open-source stack",
            text: "PDFVoid uses Next.js, TypeScript, Tailwind CSS, PDF.js, pdf-lib, and other open-source packages."
          },
          {
            title: "Search-friendly",
            text: "Every major PDF workflow has a focused landing page, FAQ content, schema, and related tool links."
          }
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {item.text}
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-12 max-w-4xl space-y-5 text-sm leading-7 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">Why PDFVoid exists</h2>
        <p>
          Many PDF sites are useful, but they can also be heavy, confusing, covered
          in ads, or dependent on paid APIs behind the scenes. PDFVoid is built as a
          clean alternative: one memorable domain, focused tools, clear pages, and a
          codebase that can grow into a full SaaS product over time.
        </p>
        <p>
          The project is also structured so beginners can continue development. Tools
          share reusable upload, preview, validation, processing, SEO, and UI patterns.
          Future additions such as accounts, usage limits, subscriptions, analytics,
          ads, database storage, and API access can be added without rewriting the
          entire application.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/tools">Open PDF tools</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </div>
  );
}
