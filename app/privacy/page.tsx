import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for PDFVoid, including information about file processing, analytics, advertising placeholders, and contact details.",
  alternates: {
    canonical: "/privacy"
  },
  openGraph: {
    title: "PDFVoid Privacy Policy",
    description: "Learn how PDFVoid handles uploads, analytics, and privacy.",
    url: `${siteConfig.url}/privacy`
  }
};

export default function PrivacyPage() {
  return (
    <div className="container py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: "PDFVoid Privacy Policy",
          url: `${siteConfig.url}/privacy`,
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url
          }
        }}
      />
      <Badge variant="secondary">Privacy</Badge>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Last updated: June 14, 2026
      </p>

      <div className="mt-10 max-w-4xl space-y-8 text-sm leading-7 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
          <p className="mt-3">
            PDFVoid provides free online PDF tools for merging, splitting, converting,
            organizing, and editing PDF files. The app is designed to avoid paid PDF
            APIs and external PDF SaaS processing services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">File uploads and processing</h2>
          <p className="mt-3">
            Some PDFVoid tools process files in your browser. Other tools may send
            files to PDFVoid backend routes for processing with open-source libraries.
            Uploaded files are used to complete the selected PDF operation and return
            the output file. The application is structured around temporary processing,
            upload validation, and file size limits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Analytics</h2>
          <p className="mt-3">
            PDFVoid may use privacy-conscious analytics and Vercel Analytics to
            understand page performance, traffic, and tool usage. Analytics help improve
            the website, fix broken flows, and prioritize new PDF tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Advertising and monetization</h2>
          <p className="mt-3">
            The codebase includes disabled advertising placeholders for future
            monetization, such as banner, sidebar, in-content, and mobile sticky ad
            placements. If advertising is enabled later, this policy should be updated
            with the relevant ad network details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about this policy can be sent through the{" "}
            <Link className="text-primary hover:underline" href="/contact">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
