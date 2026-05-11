import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPageShell } from "@/components/pdf/tool-page-shell";
import { getSeoPage, seoPages } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";
import { getTool } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return seoPages.map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const seoPage = getSeoPage(seoSlug);
  if (!seoPage) return {};

  return {
    title: seoPage.title,
    description: seoPage.description,
    keywords: seoPage.keywords,
    alternates: {
      canonical: `/${seoPage.slug}`
    },
    openGraph: {
      title: `${seoPage.title} | PDFVoid`,
      description: seoPage.description,
      url: `${siteConfig.url}/${seoPage.slug}`,
      images: [{ url: "/og.svg", width: 1200, height: 630, alt: seoPage.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: seoPage.title,
      description: seoPage.description,
      images: ["/og.svg"]
    }
  };
}

export default async function SeoToolPage({
  params
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;
  const seoPage = getSeoPage(seoSlug);
  if (!seoPage) notFound();

  const tool = getTool(seoPage.toolSlug);
  if (!tool) notFound();

  return <ToolPageShell tool={tool} seoPage={seoPage} pathname={`/${seoPage.slug}`} />;
}
