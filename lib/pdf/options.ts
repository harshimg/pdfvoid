export type PdfToolOptions = {
  ranges?: string;
  pages?: string;
  order?: string;
  rotation?: string;
  watermark?: string;
  watermarkMode?: "text" | "image";
  watermarkText?: string;
  watermarkFont?: "helvetica" | "times" | "courier";
  watermarkColor?: string;
  watermarkBold?: boolean;
  watermarkItalic?: boolean;
  watermarkUnderline?: boolean;
  watermarkSize?: string;
  watermarkPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "middle-center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "custom";
  watermarkMosaic?: boolean;
  watermarkX?: string;
  watermarkY?: string;
  watermarkOpacity?: string;
  watermarkRotation?: string;
  watermarkFromPage?: string;
  watermarkToPage?: string;
  watermarkLayer?: "over" | "under";
  watermarkImageScale?: string;
  watermarkImage?: {
    type: "image/png" | "image/jpeg";
    bytes: Uint8Array;
  };
  linkMode?: "add" | "remove";
  linkUrl?: string;
  linkPage?: string;
  linkPages?: string;
  linkX?: string;
  linkY?: string;
  linkWidth?: string;
  linkHeight?: string;
  linkBorder?: boolean;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  imageFormat?: "png" | "jpg";
  password?: string;
};

export function parseOptions(value: FormDataEntryValue | null): PdfToolOptions {
  if (typeof value !== "string" || !value) return {};
  try {
    return JSON.parse(value) as PdfToolOptions;
  } catch {
    throw new Error("Invalid options payload.");
  }
}

export function parsePageSelection(input: string | undefined, pageCount: number): number[] {
  if (!input?.trim()) return Array.from({ length: pageCount }, (_, index) => index);

  const selected = new Set<number>();
  for (const token of input.split(",")) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    const [startRaw, endRaw] = trimmed.split("-");
    const start = Number(startRaw);
    const end = Number(endRaw ?? startRaw);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > pageCount) {
      throw new Error(`Invalid page selection: ${trimmed}`);
    }
    for (let page = start; page <= end; page += 1) selected.add(page - 1);
  }

  return [...selected].sort((a, b) => a - b);
}

export function parsePageOrder(input: string | undefined, pageCount: number): number[] {
  if (!input?.trim()) return Array.from({ length: pageCount }, (_, index) => index);
  const pages = input.split(",").map((value) => Number(value.trim()));
  if (pages.some((page) => !Number.isInteger(page) || page < 1 || page > pageCount)) {
    throw new Error("Page order contains an invalid page number.");
  }
  return pages.map((page) => page - 1);
}

export function parseRanges(input: string | undefined, pageCount: number): number[][] {
  if (!input?.trim()) {
    return Array.from({ length: pageCount }, (_, index) => [index]);
  }

  return input.split(",").map((token) => parsePageSelection(token, pageCount));
}
