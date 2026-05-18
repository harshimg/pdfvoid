import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { zipSync } from "fflate";
import type { ToolSlug } from "@/lib/tools";
import type { UploadedInput } from "@/lib/security/upload-guards";
import type { PdfToolOptions } from "@/lib/pdf/options";
import { parsePageOrder, parsePageSelection, parseRanges } from "@/lib/pdf/options";
import { compressPdfByRasterizing, renderPdfToImageZip } from "@/lib/pdf/render";

export type PdfResult = {
  bytes: Uint8Array;
  filename: string;
  contentType: string;
};

const pdfType = "application/pdf";
const zipType = "application/zip";

export async function processPdfTool(
  operation: ToolSlug,
  files: UploadedInput[],
  options: PdfToolOptions
): Promise<PdfResult> {
  switch (operation) {
    case "merge":
      return pdfResult(await mergePdfs(files), "merged.pdf");
    case "split":
      return zipResult(await splitPdf(files[0].bytes, options), "split-pages.zip");
    case "compress":
      return pdfResult(await compressPdf(files[0].bytes), "compressed.pdf");
    case "images-to-pdf":
      return pdfResult(await imagesToPdf(files), "images.pdf");
    case "rotate":
      return pdfResult(await rotatePdf(files[0].bytes, options), "rotated.pdf");
    case "delete-pages":
      return pdfResult(await deletePages(files[0].bytes, options), "pages-deleted.pdf");
    case "rearrange-pages":
      return pdfResult(await rearrangePages(files[0].bytes, options), "rearranged.pdf");
    case "watermark":
      return pdfResult(await addWatermark(files[0].bytes, options), "watermarked.pdf");
    case "page-numbers":
      return pdfResult(await addPageNumbers(files[0].bytes), "page-numbers.pdf");
    case "metadata":
      return pdfResult(await editMetadata(files[0].bytes, options), "metadata-updated.pdf");
    case "pdf-to-images":
      return zipResult(await renderPdfToImageZip(files[0].bytes, options.imageFormat, "page"), "pdf-pages.zip");
    case "extract-images":
      return zipResult(await renderPdfToImageZip(files[0].bytes, options.imageFormat, "extracted-page"), "extracted-images.zip");
    case "unlock":
      return pdfResult(await unlockBestEffort(files[0].bytes), "unlocked.pdf");
    case "lock":
      throw new Error("Password locking is coming soon.");
    default:
      throw new Error("Unsupported PDF operation.");
  }
}

async function mergePdfs(files: UploadedInput[]) {
  const output = await PDFDocument.create();
  for (const file of files) {
    const input = await PDFDocument.load(file.bytes);
    const pages = await output.copyPages(input, input.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }
  return output.save({ useObjectStreams: true });
}

async function splitPdf(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const ranges = parseRanges(options.ranges, input.getPageCount());
  const files: Record<string, Uint8Array> = {};

  for (const [rangeIndex, range] of ranges.entries()) {
    const output = await PDFDocument.create();
    const pages = await output.copyPages(input, range);
    pages.forEach((page) => output.addPage(page));
    files[`split-${rangeIndex + 1}.pdf`] = await output.save({ useObjectStreams: true });
  }

  return zipSync(files);
}

async function compressPdf(bytes: Uint8Array) {
  const input = await PDFDocument.load(bytes);
  const losslessBytes = await input.save({ useObjectStreams: true, objectsPerTick: 50 });
  const rasterBytes = await compressPdfByRasterizing(bytes);

  if (rasterBytes.length < bytes.length || rasterBytes.length < losslessBytes.length) {
    return rasterBytes;
  }

  if (losslessBytes.length < bytes.length) return losslessBytes;

  throw new Error(
    "This PDF is already optimized or cannot be reduced safely with browser-compatible compression."
  );
}

async function imagesToPdf(files: UploadedInput[]) {
  const output = await PDFDocument.create();

  for (const file of files) {
    const image = file.type === "image/png" ? await output.embedPng(file.bytes) : await output.embedJpg(file.bytes);
    const page = output.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return output.save({ useObjectStreams: true });
}

async function rotatePdf(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const selected = new Set(parsePageSelection(options.pages, input.getPageCount()));
  const rotation = Number(options.rotation ?? 90);
  if (!Number.isInteger(rotation)) throw new Error("Rotation must be a number.");

  input.getPages().forEach((page, index) => {
    if (selected.has(index)) {
      page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
    }
  });

  return input.save({ useObjectStreams: true });
}

async function deletePages(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const selected = new Set(parsePageSelection(options.pages, input.getPageCount()));
  if (selected.size >= input.getPageCount()) throw new Error("At least one page must remain.");

  const output = await PDFDocument.create();
  const keep = input.getPageIndices().filter((index) => !selected.has(index));
  const pages = await output.copyPages(input, keep);
  pages.forEach((page) => output.addPage(page));
  return output.save({ useObjectStreams: true });
}

async function rearrangePages(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const order = parsePageOrder(options.order, input.getPageCount());
  const output = await PDFDocument.create();
  const pages = await output.copyPages(input, order);
  pages.forEach((page) => output.addPage(page));
  return output.save({ useObjectStreams: true });
}

async function addWatermark(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const font = await input.embedFont(StandardFonts.HelveticaBold);
  const text = sanitizeText(options.watermark ?? "Confidential", 80);

  input.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.18,
      y: height * 0.48,
      size: Math.min(width, height) / 12,
      font,
      color: rgb(0.08, 0.56, 0.72),
      opacity: 0.22,
      rotate: degrees(-32)
    });
  });

  return input.save({ useObjectStreams: true });
}

async function addPageNumbers(bytes: Uint8Array) {
  const input = await PDFDocument.load(bytes);
  const font = await input.embedFont(StandardFonts.Helvetica);
  const pages = input.getPages();

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${pages.length}`;
    page.drawText(label, {
      x: width / 2 - 18,
      y: 24,
      size: 10,
      font,
      color: rgb(0.2, 0.24, 0.28)
    });
  });

  return input.save({ useObjectStreams: true });
}

async function editMetadata(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  if (options.title) input.setTitle(sanitizeText(options.title, 120));
  if (options.author) input.setAuthor(sanitizeText(options.author, 120));
  if (options.subject) input.setSubject(sanitizeText(options.subject, 180));
  if (options.keywords) {
    input.setKeywords(
      options.keywords
        .split(",")
        .map((keyword) => sanitizeText(keyword.trim(), 40))
        .filter(Boolean)
    );
  }
  input.setModificationDate(new Date());
  return input.save({ useObjectStreams: true });
}

async function unlockBestEffort(bytes: Uint8Array) {
  const input = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return input.save({ useObjectStreams: true });
}

function sanitizeText(value: string, maxLength: number) {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, maxLength);
}

function pdfResult(bytes: Uint8Array, filename: string): PdfResult {
  return { bytes, filename, contentType: pdfType };
}

function zipResult(bytes: Uint8Array, filename: string): PdfResult {
  return { bytes, filename, contentType: zipType };
}
