import Link from "next/link";
import { ArrowRight, Check, Gauge, Lock, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from "@/components/tool-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { tools } from "@/lib/tools";

const highlights = [
  "Open-source PDF processing",
  "No paid APIs or external PDF SaaS",
  "Vercel free-tier ready",
  "Future-ready monetization hooks"
];

const faqs = [
  {
    q: "Is this free to develop and host?",
    a: "Yes. The app uses open-source libraries and is structured for the Vercel free tier while the project is small."
  },
  {
    q: "Do files go to paid PDF services?",
    a: "No. Processing happens through local browser previews and Next.js API routes using open-source packages."
  },
  {
    q: "Can I add accounts or subscriptions later?",
    a: "Yes. Auth, database, limits, API access, analytics, and ad slots are represented as clean placeholders."
  }
];

export default function HomePage() {
  const featuredTools = tools.slice(0, 6);

  return (
    <>
      <AdSlot placement="top-banner" />
      <section className="surface-grid overflow-hidden border-b">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge variant="secondary">Free-first SaaS PDF toolkit</Badge>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              Open PDF Tools
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Merge, split, compress, convert, rotate, watermark, and organize PDFs
              with a modern Next.js platform built for privacy, speed, and future scale.
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
                    href={`/tools/${tool.slug}`}
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
              The tools share upload validation, queue ordering, previews, progress,
              toasts, and API contracts, which keeps new features easy to add.
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
            { icon: Zap, title: "Fast by design", text: "Lazy tool UI, thin API routes, streaming-ready responses, and scoped bundles." },
            { icon: Lock, title: "Privacy-minded", text: "Strict upload validation, size limits, and no external PDF processing services." },
            { icon: Gauge, title: "Scale later", text: "Placeholders for auth, analytics, database, ads, limits, premium, and API access." }
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

      <section id="pricing" className="container py-16">
        <div className="text-center">
          <Badge variant="secondary">Pricing</Badge>
          <h2 className="mt-3 text-3xl font-semibold">Free now, premium-ready later</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            The initial product stays free. The structure leaves room for optional subscriptions,
            heavier limits, team features, and API access when the audience arrives.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For launch and early growth.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">$0</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Core PDF tools</li>
                <li>Open-source processing</li>
                <li>Responsive dashboard</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary/40">
            <CardHeader>
              <Sparkles className="h-6 w-6 text-accent" />
              <CardTitle>Premium placeholder</CardTitle>
              <CardDescription>Designed but disabled until needed.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">Later</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Higher file limits</li>
                <li>Batch jobs and API access</li>
                <li>Account history and team tools</li>
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
