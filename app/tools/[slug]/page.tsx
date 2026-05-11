import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPageShell } from "@/components/pdf/tool-page-shell";
import { getPrimarySeoPage } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";
import { getTool, tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const seoPage = getPrimarySeoPage(tool.slug);

  return {
    title: tool.name,
    description: tool.description,
    alternates: {
      canonical: seoPage ? `/${seoPage.slug}` : `/tools/${tool.slug}`
    },
    openGraph: {
      title: `${tool.name} - PDFVoid`,
      description: tool.description,
      url: `${siteConfig.url}${seoPage ? `/${seoPage.slug}` : `/tools/${tool.slug}`}`
    }
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();
  const seoPage = getPrimarySeoPage(tool.slug);

  return <ToolPageShell tool={tool} seoPage={seoPage} pathname={`/tools/${tool.slug}`} />;
}
