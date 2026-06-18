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
    "Learn about PDFVoid, a free online PDF toolkit for merging, converting, organizing, OCR, watermarking, and editing PDFs.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About PDFVoid",
    description:
      "PDFVoid is a free PDF toolkit focused on useful tools, clear pages, privacy-minded processing, and everyday document tasks.",
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
        PDFVoid is a free online PDF toolkit built for everyday document work:
        merge PDFs, split pages, convert PDF to images, convert JPG or PNG to PDF,
        rotate pages, delete pages, add watermarks, edit metadata, add hyperlinks,
        and preview documents in the browser.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Free to use",
            text: "Open a PDF tool, upload supported files, process your document, and download the result without creating an account."
          },
          {
            title: "Practical PDF tools",
            text: "PDFVoid focuses on common tasks such as merge PDF, PDF to JPG, JPG to PDF, OCR, watermarking, page numbers, and metadata editing."
          },
          {
            title: "Simple experience",
            text: "Each tool page keeps the upload area, options, preview, help text, and download action easy to find."
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
          Many PDF sites are useful, but they can also feel heavy, confusing, or
          crowded. PDFVoid is built as a clean alternative: one memorable domain,
          focused tools, clear pages, and simple document workflows.
        </p>
        <p>
          The goal is to make everyday PDF work easier for students, teachers,
          office users, freelancers, and anyone who needs quick document tools
          without installing desktop software.
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
