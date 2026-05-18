import type { ToolSlug } from "@/lib/tools";

export type SeoPage = {
  slug: string;
  toolSlug: ToolSlug;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
};

export const seoPages: SeoPage[] = [
  {
    slug: "merge-pdf",
    toolSlug: "merge",
    title: "Merge PDF Online Free",
    description: "Merge multiple PDF files online for free with PDFVoid. Combine PDFs in your browser and download one clean PDF file.",
    h1: "Merge PDF online",
    intro: "Combine multiple PDF files into one document. Reorder files, preview your PDF, and download the merged result without paid APIs.",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "merge pdf online", "combine pdf files"]
  },
  {
    slug: "combine-pdf",
    toolSlug: "merge",
    title: "Combine PDF Files Online Free",
    description: "Combine PDF files into one PDF document online with a free, privacy-friendly PDF combiner.",
    h1: "Combine PDF files",
    intro: "Upload PDFs, arrange them in the order you want, and combine them into a single file.",
    keywords: ["combine pdf", "combine pdf files", "pdf combiner", "merge pdf files"]
  },
  {
    slug: "split-pdf",
    toolSlug: "split",
    title: "Split PDF Online Free",
    description: "Split PDF pages online for free. Extract selected pages or split a PDF into page ranges.",
    h1: "Split PDF online",
    intro: "Extract pages, split by ranges, or separate every page into individual PDF files.",
    keywords: ["split pdf", "extract pdf pages", "pdf splitter", "split pdf online"]
  },
  {
    slug: "compress-pdf",
    toolSlug: "compress",
    title: "Compress PDF Online Free",
    description: "Compress and optimize PDF files online for free with PDFVoid. Reduce compatible PDF file structure safely.",
    h1: "Compress PDF online",
    intro: "Optimize compatible PDF files and download a lighter copy while keeping the workflow simple.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "compress pdf online"]
  },
  {
    slug: "pdf-to-jpg",
    toolSlug: "pdf-to-images",
    title: "Convert PDF to JPG Online Free",
    description: "Convert PDF pages to JPG images online for free. Export PDF pages as downloadable images.",
    h1: "Convert PDF to JPG",
    intro: "Turn PDF pages into image files for sharing, thumbnails, or reuse in other documents.",
    keywords: ["pdf to jpg", "convert pdf to jpg", "pdf to image", "pdf to jpeg"]
  },
  {
    slug: "pdf-to-png",
    toolSlug: "pdf-to-images",
    title: "Convert PDF to PNG Online Free",
    description: "Convert PDF pages to PNG images online for free with crisp page rendering.",
    h1: "Convert PDF to PNG",
    intro: "Export PDF pages as PNG images when you need crisp text and clean screenshots.",
    keywords: ["pdf to png", "convert pdf to png", "pdf to image", "pdf page to png"]
  },
  {
    slug: "jpg-to-pdf",
    toolSlug: "images-to-pdf",
    title: "Convert JPG to PDF Online Free",
    description: "Convert JPG images to PDF online for free. Upload, reorder, and create one PDF from images.",
    h1: "Convert JPG to PDF",
    intro: "Create a PDF from JPG images in the order you choose.",
    keywords: ["jpg to pdf", "jpeg to pdf", "convert jpg to pdf", "image to pdf"]
  },
  {
    slug: "png-to-pdf",
    toolSlug: "images-to-pdf",
    title: "Convert PNG to PDF Online Free",
    description: "Convert PNG images to PDF online for free. Reorder images and generate a single PDF.",
    h1: "Convert PNG to PDF",
    intro: "Upload PNG files and turn them into a clean PDF document.",
    keywords: ["png to pdf", "convert png to pdf", "image to pdf", "images to pdf"]
  },
  {
    slug: "image-to-pdf",
    toolSlug: "images-to-pdf",
    title: "Images to PDF Online Free",
    description: "Convert JPG and PNG images to a PDF online for free with PDFVoid.",
    h1: "Convert images to PDF",
    intro: "Upload multiple images, reorder them, and download a single PDF.",
    keywords: ["image to pdf", "images to pdf", "photo to pdf", "jpg png to pdf"]
  },
  {
    slug: "rotate-pdf",
    toolSlug: "rotate",
    title: "Rotate PDF Online Free",
    description: "Rotate PDF pages online for free. Rotate all pages or selected pages clockwise.",
    h1: "Rotate PDF pages",
    intro: "Fix sideways pages by rotating all pages or selected pages in your PDF.",
    keywords: ["rotate pdf", "rotate pdf pages", "pdf rotator"]
  },
  {
    slug: "delete-pages-from-pdf",
    toolSlug: "delete-pages",
    title: "Delete Pages from PDF Online Free",
    description: "Remove unwanted pages from a PDF online for free and download the cleaned file.",
    h1: "Delete pages from PDF",
    intro: "Remove extra pages from a PDF while keeping the pages you need.",
    keywords: ["delete pages from pdf", "remove pdf pages", "delete pdf pages"]
  },
  {
    slug: "rearrange-pdf-pages",
    toolSlug: "rearrange-pages",
    title: "Rearrange PDF Pages Online Free",
    description: "Reorder PDF pages online for free. Create a new PDF with your custom page order.",
    h1: "Rearrange PDF pages",
    intro: "Set a custom page order and download a reordered PDF.",
    keywords: ["rearrange pdf pages", "reorder pdf pages", "organize pdf"]
  },
  {
    slug: "add-watermark-to-pdf",
    toolSlug: "watermark",
    title: "Add Watermark to PDF Online Free",
    description: "Add text or image watermarks to PDF pages online for free.",
    h1: "Add watermark to PDF",
    intro: "Stamp text across your PDF pages for drafts, approvals, or internal documents.",
    keywords: ["add watermark to pdf", "watermark pdf", "pdf watermark"]
  },
  {
    slug: "add-page-numbers-to-pdf",
    toolSlug: "page-numbers",
    title: "Add Page Numbers to PDF Online Free",
    description: "Add page numbers to a PDF online for free and download the numbered file.",
    h1: "Add page numbers to PDF",
    intro: "Add simple footer page numbers to make long PDFs easier to reference.",
    keywords: ["add page numbers to pdf", "number pdf pages", "pdf page numbers"]
  },
  {
    slug: "edit-pdf-metadata",
    toolSlug: "metadata",
    title: "Edit PDF Metadata Online Free",
    description: "Edit PDF title, author, subject, and keywords online for free.",
    h1: "Edit PDF metadata",
    intro: "Update document metadata fields such as title, author, subject, and keywords.",
    keywords: ["edit pdf metadata", "pdf metadata editor", "change pdf title"]
  },
  {
    slug: "unlock-pdf",
    toolSlug: "unlock",
    title: "Unlock PDF Online Free",
    description: "Try to normalize unlocked PDF files online with PDFVoid's free PDF unlock workflow.",
    h1: "Unlock PDF",
    intro: "Use the unlock workflow for PDFs you own and are allowed to process.",
    keywords: ["unlock pdf", "remove pdf password", "pdf unlocker"]
  },
  {
    slug: "extract-images-from-pdf",
    toolSlug: "extract-images",
    title: "Extract Images from PDF Online Free",
    description: "Extract PDF pages as image files online for free.",
    h1: "Extract images from PDF",
    intro: "Export PDF pages as downloadable image files for reuse.",
    keywords: ["extract images from pdf", "pdf image extractor", "pdf to images"]
  }
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function getPrimarySeoPage(toolSlug: ToolSlug) {
  return seoPages.find((page) => page.toolSlug === toolSlug);
}

export function getToolHref(toolSlug: ToolSlug) {
  return `/${getPrimarySeoPage(toolSlug)?.slug ?? `tools/${toolSlug}`}`;
}
