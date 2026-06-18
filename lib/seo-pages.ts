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
    intro: "Combine multiple PDF files into one document. Reorder files, preview your PDF, and download the merged result.",
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
    slug: "pdf-to-text",
    toolSlug: "pdf-to-text",
    title: "PDF to Text OCR Online Free",
    description: "Convert scanned PDFs and PDF pages to text online for free with PDFVoid OCR. Extract text from PDF using English or Hindi OCR.",
    h1: "PDF to text OCR",
    intro: "Extract readable text from scanned PDFs and image-based PDF pages with browser OCR.",
    keywords: ["pdf to text", "ocr pdf", "extract text from pdf", "pdf ocr", "scanned pdf to text"]
  },
  {
    slug: "ocr-pdf",
    toolSlug: "pdf-to-text",
    title: "OCR PDF Online Free",
    description: "Run OCR on scanned PDF files online for free. Use PDFVoid to recognize English and Hindi text from PDF pages.",
    h1: "OCR PDF online",
    intro: "Recognize text from scanned PDF pages and download the extracted text as a TXT file.",
    keywords: ["ocr pdf", "pdf ocr online", "scan pdf ocr", "recognize text in pdf"]
  },
  {
    slug: "scan-pdf-to-text",
    toolSlug: "pdf-to-text",
    title: "Scan PDF to Text Online Free",
    description: "Convert scanned PDF documents to text online with free browser OCR for English and Hindi documents.",
    h1: "Scan PDF to text",
    intro: "Turn scanned documents, notes, forms, and image-based PDF pages into editable text.",
    keywords: ["scan pdf to text", "scanned pdf to text", "convert scanned pdf to text", "ocr scanned pdf"]
  },
  {
    slug: "image-to-text",
    toolSlug: "pdf-to-text",
    title: "Image to Text OCR Online Free",
    description: "Extract text from JPG and PNG images online for free with PDFVoid browser OCR.",
    h1: "Image to text OCR",
    intro: "Upload an image and extract readable text with free OCR in your browser.",
    keywords: ["image to text", "jpg to text", "png to text", "extract text from image", "ocr image"]
  },
  {
    slug: "hindi-ocr",
    toolSlug: "pdf-to-text",
    title: "Hindi OCR Online Free",
    description: "Extract Hindi text from scanned PDFs and images online for free with PDFVoid OCR.",
    h1: "Hindi OCR online",
    intro: "Recognize Hindi text from scanned documents, images, and PDF pages using browser OCR.",
    keywords: ["hindi ocr", "hindi image to text", "hindi pdf to text", "extract hindi text from image"]
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
    slug: "sign-pdf",
    toolSlug: "sign-pdf",
    title: "Sign PDF Online Free",
    description: "Sign a PDF online for free with PDFVoid. Draw or type a signature, place it on a PDF page, and download the signed file.",
    h1: "Sign PDF online",
    intro: "Draw or type your signature, place it on the PDF preview, and download a signed copy.",
    keywords: ["sign pdf", "sign pdf online", "add signature to pdf", "pdf signature", "esign pdf"]
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
      a: `Yes. PDFVoid provides ${primaryKeyword} as a free online PDF workflow for everyday document tasks.`
    },
    {
      q: `Do I need to create an account for ${tool.name}?`,
      a: "No account is required for the current tools. You can open the page, upload supported files, process them, and download the result."
    },
    {
      q: "Do I need to install software?",
      a: "No. PDFVoid runs in your browser, so you can use the tool online without installing a desktop PDF app."
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
      `${page.title} is a focused PDFVoid tool for people who need a fast, browser-friendly way to handle everyday PDF work without installing desktop software. The page is built around the exact task users search for, such as ${primaryKeyword}${secondaryKeywords ? `, ${secondaryKeywords}` : ""}. The upload area, preview, settings, and download action stay on the same page so the workflow is easy to understand and quick to repeat.`,
      `This ${tool.category} tool is part of a larger free PDF toolkit that includes merge, split, compress, PDF to JPG, JPG to PDF, PNG to PDF, OCR, rotate, delete pages, watermark, page numbers, metadata editing, and hyperlink tools. Each tool has a focused page with clear instructions, FAQs, and related links so users can quickly find the right document workflow.`,
      `PDFVoid is made for common PDF tasks at school, work, and home. The interface keeps controls predictable, uses clear validation messages, and avoids unnecessary steps between upload and download. Many tools include local previews so you can check pages, ordering, rotation, or selected areas before processing the final file.`,
      `When you use ${page.title}, start with clean source files and keep file size reasonable for your browser and connection. If a PDF is scanned, image-heavy, encrypted, damaged, or extremely large, any online tool may need more memory or a different processing strategy. PDFVoid tries to show useful errors instead of silently producing a bad result.`,
      `For best results, bookmark this page and use the related tools below when your workflow needs more than one step. For example, you might merge PDF files, add page numbers, compress the final document, and then convert selected pages to JPG. Focused PDF pages make it easier to move between tools without searching again.`
    ]
  };
}
