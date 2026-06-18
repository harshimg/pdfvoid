import Link from "next/link";
import { getToolHref } from "@/lib/seo-pages";
import { tools } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t bg-background/70">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-semibold">PDFVoid</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Free online PDF tools for merging, converting, organizing, OCR,
            watermarking, and editing everyday documents.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Popular tools</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {tools.slice(0, 5).map((tool) => (
              <Link key={tool.slug} href={getToolHref(tool.slug)} className="hover:text-foreground">
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/#free-tools" className="hover:text-foreground">
              Free tools
            </Link>
            <Link href="/#faq" className="hover:text-foreground">
              FAQ
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Company</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/llms" className="hover:text-foreground">
              AI Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
