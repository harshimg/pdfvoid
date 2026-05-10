import Link from "next/link";
import { tools } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t bg-background/70">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-semibold">Open PDF Tools</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A free-first PDF toolkit built with open-source libraries and a clean
            Next.js architecture ready for future accounts, limits, ads, and APIs.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Popular tools</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {tools.slice(0, 5).map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="hover:text-foreground">
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
            <Link href="/#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/#faq" className="hover:text-foreground">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
