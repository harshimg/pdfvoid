import type { Tool, ToolSlug } from "@/lib/tools";

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
    slug: "add-hyperlink-to-pdf",
    toolSlug: "pdf-links",
    title: "Add or Remove Hyperlinks in PDF Online Free",
    description: "Add clickable hyperlinks to PDF pages or remove existing PDF link annotations online for free.",
    h1: "Add hyperlinks to PDF",
    intro: "Create clickable link areas on PDF pages or remove existing hyperlink annotations from selected pages.",
    keywords: ["add hyperlink to pdf", "remove hyperlink from pdf", "pdf links", "pdf hyperlink editor"]
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

export function getRelatedSeoPages(currentPage: SeoPage) {
  const preferred = seoPages.filter((page) => page.slug !== currentPage.slug);
  const sameTool = preferred.filter((page) => page.toolSlug === currentPage.toolSlug);
  const commonTools = preferred.filter((page) =>
    ["merge", "split", "compress", "pdf-to-images", "images-to-pdf", "delete-pages"].includes(page.toolSlug)
  );

  return [...sameTool, ...commonTools, ...preferred]
    .filter((page, index, pages) => pages.findIndex((item) => item.slug === page.slug) === index)
    .slice(0, 6);
}

export function getSeoHowToSteps(page: SeoPage, tool: Tool) {
  return [
    {
      title: "Upload your file",
      text: `Choose the PDF or image files you want to use with ${page.title}. The upload area accepts supported files and validates them before processing.`
    },
    {
      title: "Set the options",
      text: `Use the available controls for ${tool.name}, such as page ranges, image format, ordering, watermark settings, or link placement when that tool needs extra input.`
    },
    {
      title: "Preview before processing",
      text: "Check the local PDF preview when available. This helps you confirm pages, order, rotation, and selected areas before downloading the finished file."
    },
    {
      title: "Download the result",
      text: "Run the tool and save the processed PDF or ZIP file. PDFVoid keeps the workflow simple so the result is easy to find and reuse."
    }
  ];
}

export function getSeoFaqs(page: SeoPage, tool: Tool) {
  const primaryKeyword = page.keywords[0] ?? tool.name.toLowerCase();

  return [
    {
      q: `Is ${page.title} free to use?`,
      a: `Yes. PDFVoid provides ${primaryKeyword} as a free online PDF workflow built with open-source libraries and no paid PDF API dependency.`
    },
    {
      q: `Do I need to create an account for ${tool.name}?`,
      a: "No account is required for the current tools. You can open the page, upload supported files, process them, and download the result."
    },
    {
      q: "Are my files sent to an external PDF SaaS service?",
      a: "No. PDFVoid is designed around browser processing and Next.js backend routes using open-source packages, not third-party PDF conversion APIs."
    },
    {
      q: `What files work best with ${tool.name}?`,
      a: `Use valid, non-corrupted files within the upload limit. ${tool.accepts === "image" ? "JPG and PNG files are supported for image workflows." : "PDF files are supported for this workflow."}`
    },
    {
      q: `Can I use ${page.title} on mobile?`,
      a: "Yes. The interface is responsive and works on modern mobile and desktop browsers, though large files are usually easier to manage on desktop."
    }
  ];
}

export function getSeoLongContent(page: SeoPage, tool: Tool) {
  const primaryKeyword = page.keywords[0] ?? tool.name.toLowerCase();
  const secondaryKeywords = page.keywords.slice(1).join(", ");

  return {
    heading: `About ${page.title}`,
    paragraphs: [
      `${page.title} is a focused PDFVoid tool for people who need a fast, browser-friendly way to handle everyday PDF work without installing desktop software. The page is built around the exact task users search for, such as ${primaryKeyword}${secondaryKeywords ? `, ${secondaryKeywords}` : ""}. Instead of sending you through a generic dashboard first, PDFVoid keeps the upload area, preview, settings, and download action on the same page so the workflow is easier to understand and faster to repeat.`,
      `This ${tool.category} tool is part of a larger free PDF toolkit that includes merge, split, compress, PDF to JPG, JPG to PDF, PNG to PDF, rotate, delete pages, watermark, page numbers, metadata editing, and hyperlink tools. Each tool has its own clean URL, title, description, FAQ, and internal links so search engines and AI assistants can understand what the page does. That structure also helps real users land on the right tool from Google, Bing, Gemini, ChatGPT browsing, or direct recommendations.`,
      `PDFVoid is designed as a free-first SaaS-style product, but the initial version avoids paid APIs and external PDF processing services. The codebase uses open-source libraries, typed Next.js routes, reusable components, upload validation, file size limits, clear error messages, and dark-mode friendly UI. For many tools, preview and processing happen locally in the browser; for others, the app uses its own Next.js backend routes. This keeps the project practical for free hosting while leaving space for future accounts, analytics, ads, usage limits, and premium plans.`,
      `When you use ${page.title}, start with clean source files and keep file size reasonable for your browser and connection. If a PDF is scanned, image-heavy, encrypted, damaged, or extremely large, any online tool may need more memory or a different processing strategy. PDFVoid tries to keep the experience honest by showing validation errors instead of silently damaging documents. The goal is not just to create another PDF website, but to build a reliable PDF workspace that beginners can understand and advanced users can trust for common document tasks.`,
      `For best results, bookmark this page and use the related tools below when your workflow needs more than one step. For example, you might merge PDF files, add page numbers, compress the final document, and then convert selected pages to JPG. Internal PDF workflows like that are exactly why PDFVoid uses separate tool pages connected by useful links rather than hiding everything behind one vague page. Over time, these focused pages help PDFVoid build topical authority around free PDF tools and give search engines clearer reasons to show the site for specific PDF searches.`
    ]
  };
}
