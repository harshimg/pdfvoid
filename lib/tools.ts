import {
  Combine,
  Columns3,
  FileArchive,
  FileImage,
  FileLock2,
  FileOutput,
  FilePenLine,
  FileText,
  Files,
  ImagePlus,
  ListOrdered,
  Link2,
  LockOpen,
  RotateCw,
  Scissors,
  Signature,
  Stamp,
  Trash2
} from "lucide-react";
import type React from "react";

export type ToolCategory = "organize" | "optimize" | "convert" | "edit" | "security";

export type ToolSlug =
  | "merge"
  | "split"
  | "compress"
  | "pdf-to-images"
  | "images-to-pdf"
  | "pdf-to-text"
  | "rotate"
  | "delete-pages"
  | "rearrange-pages"
  | "watermark"
  | "sign-pdf"
  | "pdf-links"
  | "page-numbers"
  | "metadata"
  | "lock"
  | "unlock"
  | "extract-images"
  | "preview";

export type Tool = {
  slug: ToolSlug;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.ComponentType<{ className?: string }>;
  accepts: "pdf" | "image" | "both";
  multiple: boolean;
  output: "pdf" | "zip" | "txt" | "preview";
  status?: "ready" | "adapter";
};

export type ToolClientConfig = Omit<Tool, "icon">;

export const categories: { id: "all" | ToolCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "organize", label: "Organize" },
  { id: "optimize", label: "Optimize" },
  { id: "convert", label: "Convert" },
  { id: "edit", label: "Edit" },
  { id: "security", label: "Security" }
];

export const tools: Tool[] = [
  {
    slug: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one clean document.",
    category: "organize",
    icon: Combine,
    accepts: "pdf",
    multiple: true,
    output: "pdf"
  },
  {
    slug: "split",
    name: "Split PDF",
    description: "Split every page or extract custom page ranges.",
    category: "organize",
    icon: Scissors,
    accepts: "pdf",
    multiple: false,
    output: "zip"
  },
  {
    slug: "compress",
    name: "Compress PDF",
    description: "Re-save and optimize compatible PDF structure.",
    category: "optimize",
    icon: FileArchive,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    description: "Render each PDF page to PNG or JPG images.",
    category: "convert",
    icon: FileImage,
    accepts: "pdf",
    multiple: false,
    output: "zip"
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    description: "Turn JPG and PNG uploads into one PDF.",
    category: "convert",
    icon: ImagePlus,
    accepts: "image",
    multiple: true,
    output: "pdf"
  },
  {
    slug: "pdf-to-text",
    name: "PDF / Image to Text OCR",
    description: "Extract text from scanned PDFs and images with browser OCR.",
    category: "convert",
    icon: FileText,
    accepts: "both",
    multiple: false,
    output: "txt"
  },
  {
    slug: "rotate",
    name: "Rotate PDF",
    description: "Rotate all pages or a selected set of pages.",
    category: "edit",
    icon: RotateCw,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "delete-pages",
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from a document.",
    category: "organize",
    icon: Trash2,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "rearrange-pages",
    name: "Rearrange Pages",
    description: "Create a PDF using a custom page order.",
    category: "organize",
    icon: Columns3,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "watermark",
    name: "Add Watermark",
    description: "Stamp text or image watermarks across selected PDF pages.",
    category: "edit",
    icon: Stamp,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    description: "Draw or type a signature and place it on a PDF page.",
    category: "edit",
    icon: Signature,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "pdf-links",
    name: "PDF Links",
    description: "Add a clickable hyperlink area or remove existing PDF links.",
    category: "edit",
    icon: Link2,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "page-numbers",
    name: "Add Page Numbers",
    description: "Add tidy page numbers to the footer.",
    category: "edit",
    icon: ListOrdered,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "metadata",
    name: "Metadata Editor",
    description: "Update title, author, subject, and keywords.",
    category: "edit",
    icon: FilePenLine,
    accepts: "pdf",
    multiple: false,
    output: "pdf"
  },
  {
    slug: "lock",
    name: "Lock PDF",
    description: "Architecture-ready security adapter for password protection.",
    category: "security",
    icon: FileLock2,
    accepts: "pdf",
    multiple: false,
    output: "pdf",
    status: "adapter"
  },
  {
    slug: "unlock",
    name: "Unlock PDF",
    description: "Attempt to normalize unlocked PDFs with an adapter-ready flow.",
    category: "security",
    icon: LockOpen,
    accepts: "pdf",
    multiple: false,
    output: "pdf",
    status: "adapter"
  },
  {
    slug: "extract-images",
    name: "Extract Images",
    description: "Export page rasters as image files for reuse.",
    category: "convert",
    icon: FileOutput,
    accepts: "pdf",
    multiple: false,
    output: "zip"
  },
  {
    slug: "preview",
    name: "Preview PDF",
    description: "Inspect a PDF in the browser before processing.",
    category: "organize",
    icon: Files,
    accepts: "pdf",
    multiple: false,
    output: "preview"
  }
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
