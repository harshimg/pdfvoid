export type PdfToolOptions = {
  ranges?: string;
  pages?: string;
  order?: string;
  rotation?: string;
  watermark?: string;
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
