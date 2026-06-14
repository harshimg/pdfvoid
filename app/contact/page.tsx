import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact PDFVoid",
  description:
    "Contact PDFVoid for feedback, bug reports, feature requests, partnerships, and questions about the free PDF tools.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact PDFVoid",
    description: "Send feedback, bug reports, and feature requests for PDFVoid.",
    url: `${siteConfig.url}/contact`
  }
};

export default function ContactPage() {
  const contactEmail = siteConfig.contactEmail;

  return (
    <div className="container py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact PDFVoid",
          url: `${siteConfig.url}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            email: contactEmail
          }
        }}
      />
      <Badge variant="secondary">Contact</Badge>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold">Contact PDFVoid</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
        Use this page for feedback, bug reports, feature requests, partnership
        questions, and suggestions for new PDF tools.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Send messages to{" "}
              <a className="font-medium text-primary hover:underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
            <p>
              For a bug report, include the tool name, browser, file type, approximate
              file size, and the error message you saw.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Useful links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Link className="rounded-md border p-3 hover:border-primary/60 hover:text-primary" href="/tools">
              All PDF tools
            </Link>
            <Link className="rounded-md border p-3 hover:border-primary/60 hover:text-primary" href="/privacy">
              Privacy policy
            </Link>
            <Link className="rounded-md border p-3 hover:border-primary/60 hover:text-primary" href="/about">
              About PDFVoid
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Button asChild>
          <Link href="/merge-pdf">Try Merge PDF</Link>
        </Button>
      </div>
    </div>
  );
}
