import {
  degrees,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFString,
  rgb,
  StandardFonts,
  type PDFFont,
  type PDFImage,
  type PDFPage
} from "pdf-lib";
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
    case "pdf-links":
      return pdfResult(await editPdfLinks(files[0].bytes, options), "pdf-links.pdf");
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

async function editPdfLinks(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);

  if (options.linkMode === "remove") {
    const removed = removePdfLinks(input, options);
    if (removed === 0) {
      throw new Error("No hyperlink annotations were found on the selected pages.");
    }
    return input.save({ useObjectStreams: true });
  }

  addPdfLink(input, options);
  return input.save({ useObjectStreams: true });
}

function addPdfLink(input: PDFDocument, options: PdfToolOptions) {
  const pages = input.getPages();
  const pageNumber = Math.trunc(clampNumber(Number(options.linkPage || 1), 1, pages.length, 1));
  const page = pages[pageNumber - 1];
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const url = normalizeLinkUrl(options.linkUrl);

  const rectWidth = Math.max(8, pageWidth * (clampNumber(Number(options.linkWidth || 35), 1, 100, 35) / 100));
  const rectHeight = Math.max(8, pageHeight * (clampNumber(Number(options.linkHeight || 8), 1, 100, 8) / 100));
  const x = clampNumber(
    pageWidth * (clampNumber(Number(options.linkX || 10), 0, 100, 10) / 100),
    0,
    pageWidth - rectWidth,
    0
  );
  const topY = pageHeight * (clampNumber(Number(options.linkY || 20), 0, 100, 20) / 100);
  const y = clampNumber(pageHeight - topY - rectHeight, 0, pageHeight - rectHeight, 0);
  const borderWidth = options.linkBorder === false ? 0 : 1;
  const context = input.context;

  const annotation = context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + rectWidth, y + rectHeight],
    Border: [0, 0, borderWidth],
    C: [0, 0.45, 0.85],
    H: "I",
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url)
    }
  });

  page.node.addAnnot(context.register(annotation));
}

function removePdfLinks(input: PDFDocument, options: PdfToolOptions) {
  const pageIndexes = parsePageSelection(options.linkPages, input.getPageCount());
  let removed = 0;

  for (const pageIndex of pageIndexes) {
    const page = input.getPages()[pageIndex];
    const annots = page.node.Annots();
    if (!annots) continue;

    for (let index = annots.size() - 1; index >= 0; index -= 1) {
      const annotation = input.context.lookupMaybe(annots.get(index), PDFDict);
      const subtype = annotation?.lookupMaybe(PDFName.of("Subtype"), PDFName);

      if (subtype?.decodeText() === "Link") {
        annots.remove(index);
        removed += 1;
      }
    }

    if (annots.size() === 0) {
      page.node.delete(PDFName.Annots);
    }
  }

  return removed;
}

function normalizeLinkUrl(value: string | undefined) {
  const raw = sanitizeText(value ?? "", 2048).trim();
  if (!raw) throw new Error("Enter a hyperlink URL.");

  const urlWithProtocol = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(urlWithProtocol);
    if (!["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
      throw new Error("Unsupported protocol.");
    }
    return parsed.toString();
  } catch {
    throw new Error("Enter a valid URL, email link, or phone link.");
  }
}

async function addWatermark(bytes: Uint8Array, options: PdfToolOptions) {
  const input = await PDFDocument.load(bytes);
  const settings = getWatermarkSettings(options, input.getPageCount());

  if (settings.mode === "image" && !options.watermarkImage) {
    throw new Error("Choose a PNG or JPG image for the watermark.");
  }

  if (settings.layer === "under") {
    const output = await PDFDocument.create();
    const embeddedPages = await output.embedPdf(bytes, input.getPageIndices());
    const resources = await createWatermarkResources(output, options, settings);

    input.getPages().forEach((sourcePage, index) => {
      const { width, height } = sourcePage.getSize();
      const page = output.addPage([width, height]);
      if (settings.pageIndexes.has(index)) drawWatermark(page, resources, settings);
      page.drawPage(embeddedPages[index], { x: 0, y: 0, width, height });
    });

    return output.save({ useObjectStreams: true });
  }

  const resources = await createWatermarkResources(input, options, settings);
  input.getPages().forEach((page, index) => {
    if (settings.pageIndexes.has(index)) drawWatermark(page, resources, settings);
  });

  return input.save({ useObjectStreams: true });
}

type WatermarkPosition = NonNullable<PdfToolOptions["watermarkPosition"]>;

type WatermarkSettings = {
  mode: "text" | "image";
  color: ReturnType<typeof rgb>;
  fontSize: number;
  imageScale: number;
  opacity: number;
  rotation: number;
  position: WatermarkPosition;
  mosaic: boolean;
  underline: boolean;
  xPercent: number;
  yPercent: number;
  layer: "over" | "under";
  pageIndexes: Set<number>;
};

type WatermarkResources =
  | {
      mode: "text";
      font: PDFFont;
      text: string;
    }
  | {
      mode: "image";
      image: PDFImage;
    };

function getWatermarkSettings(options: PdfToolOptions, pageCount: number): WatermarkSettings {
  return {
    mode: options.watermarkMode === "image" ? "image" : "text",
    color: parseHexColor(options.watermarkColor ?? "#0891b2"),
    fontSize: clampNumber(Number(options.watermarkSize ?? 64), 10, 220, 64),
    imageScale: clampNumber(Number(options.watermarkImageScale ?? 28), 4, 90, 28),
    opacity: clampNumber(Number(options.watermarkOpacity ?? 0.22), 0.05, 1, 0.22),
    rotation: clampNumber(Number(options.watermarkRotation ?? -32), -180, 180, -32),
    position: getWatermarkPosition(options.watermarkPosition),
    mosaic: Boolean(options.watermarkMosaic),
    underline: Boolean(options.watermarkUnderline),
    xPercent: clampNumber(Number(options.watermarkX ?? 50), 0, 100, 50),
    yPercent: clampNumber(Number(options.watermarkY ?? 50), 0, 100, 50),
    layer: options.watermarkLayer === "under" ? "under" : "over",
    pageIndexes: getWatermarkPageIndexes(options, pageCount)
  };
}

async function createWatermarkResources(
  document: PDFDocument,
  options: PdfToolOptions,
  settings: WatermarkSettings
): Promise<WatermarkResources> {
  if (settings.mode === "image") {
    const image = options.watermarkImage?.type === "image/png"
      ? await document.embedPng(options.watermarkImage.bytes)
      : await document.embedJpg(options.watermarkImage?.bytes ?? new Uint8Array());
    return { mode: "image", image };
  }

  const font = await document.embedFont(getWatermarkFont(options));
  const text = sanitizeText(options.watermarkText ?? options.watermark ?? "Confidential", 120);
  if (!text.trim()) throw new Error("Enter watermark text.");
  return { mode: "text", font, text };
}

function drawWatermark(page: PDFPage, resources: WatermarkResources, settings: WatermarkSettings) {
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const placements = settings.mosaic
    ? watermarkPositions.filter((position) => position !== "custom")
    : [settings.position];

  for (const position of placements) {
    if (resources.mode === "text") {
      const requestedSize = Math.min(settings.fontSize, Math.min(pageWidth, pageHeight) / 4);
      const textWidthAtRequestedSize = resources.font.widthOfTextAtSize(resources.text, requestedSize);
      const maxWidth = pageWidth * 0.84;
      const fontSize = textWidthAtRequestedSize > maxWidth
        ? Math.max(10, requestedSize * (maxWidth / textWidthAtRequestedSize))
        : requestedSize;
      const textWidth = resources.font.widthOfTextAtSize(resources.text, fontSize);
      const textHeight = fontSize;
      const { x, y } = getWatermarkCoordinates(
        position,
        pageWidth,
        pageHeight,
        textWidth,
        textHeight,
        settings
      );

      page.drawText(resources.text, {
        x,
        y,
        size: fontSize,
        font: resources.font,
        color: settings.color,
        opacity: settings.opacity,
        rotate: degrees(settings.rotation)
      });

      if (settings.underline) {
        drawTextUnderline(page, x, y, textWidth, fontSize, settings);
      }
      continue;
    }

    const imageWidth = Math.min(pageWidth, pageHeight) * (settings.imageScale / 100);
    const imageHeight = imageWidth * (resources.image.height / resources.image.width);
    const { x, y } = getWatermarkCoordinates(
      position,
      pageWidth,
      pageHeight,
      imageWidth,
      imageHeight,
      settings
    );

    page.drawImage(resources.image, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
      opacity: settings.opacity,
      rotate: degrees(settings.rotation)
    });
  }
}

function drawTextUnderline(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  settings: WatermarkSettings
) {
  page.drawRectangle({
    x,
    y: y - fontSize * 0.14,
    width,
    height: Math.max(1, fontSize * 0.035),
    color: settings.color,
    opacity: settings.opacity,
    rotate: degrees(settings.rotation)
  });
}

const watermarkPositions: WatermarkPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

function getWatermarkCoordinates(
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  itemWidth: number,
  itemHeight: number,
  settings: WatermarkSettings
) {
  if (position === "custom") {
    return {
      x: clampNumber((pageWidth * settings.xPercent) / 100 - itemWidth / 2, 0, pageWidth - itemWidth, 0),
      y: clampNumber((pageHeight * settings.yPercent) / 100 - itemHeight / 2, 0, pageHeight - itemHeight, 0)
    };
  }

  const margin = Math.min(pageWidth, pageHeight) * 0.08;
  const [vertical, horizontal] = position.split("-");
  const x = horizontal === "left"
    ? margin
    : horizontal === "right"
      ? pageWidth - itemWidth - margin
      : (pageWidth - itemWidth) / 2;
  const y = vertical === "top"
    ? pageHeight - itemHeight - margin
    : vertical === "bottom"
      ? margin
      : (pageHeight - itemHeight) / 2;

  return {
    x: clampNumber(x, 0, pageWidth - itemWidth, 0),
    y: clampNumber(y, 0, pageHeight - itemHeight, 0)
  };
}

function getWatermarkFont(options: PdfToolOptions) {
  const bold = Boolean(options.watermarkBold);
  const italic = Boolean(options.watermarkItalic);

  if (options.watermarkFont === "times") {
    if (bold && italic) return StandardFonts.TimesRomanBoldItalic;
    if (bold) return StandardFonts.TimesRomanBold;
    if (italic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }

  if (options.watermarkFont === "courier") {
    if (bold && italic) return StandardFonts.CourierBoldOblique;
    if (bold) return StandardFonts.CourierBold;
    if (italic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }

  if (bold && italic) return StandardFonts.HelveticaBoldOblique;
  if (bold) return StandardFonts.HelveticaBold;
  if (italic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

function getWatermarkPosition(position: PdfToolOptions["watermarkPosition"]): WatermarkPosition {
  return position && [...watermarkPositions, "custom"].includes(position) ? position : "middle-center";
}

function getWatermarkPageIndexes(options: PdfToolOptions, pageCount: number) {
  const fromRaw = options.watermarkFromPage?.trim();
  const toRaw = options.watermarkToPage?.trim();
  const fromPage = Math.trunc(clampNumber(Number(fromRaw || 1), 1, pageCount, 1));
  const toPage = Math.trunc(clampNumber(Number(toRaw || pageCount), 1, pageCount, pageCount));
  if (fromPage > toPage) throw new Error("Watermark start page must be before the end page.");

  return new Set(
    Array.from({ length: toPage - fromPage + 1 }, (_, index) => fromPage + index - 1)
  );
}

function parseHexColor(value: string) {
  const match = value.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return rgb(0.03, 0.57, 0.7);
  return rgb(
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255
  );
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
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
