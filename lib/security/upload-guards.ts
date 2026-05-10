import type { Tool } from "@/lib/tools";

export const MAX_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_FILES = 20;

const pdfMimeTypes = new Set(["application/pdf"]);
const imageMimeTypes = new Set(["image/png", "image/jpeg"]);

export type UploadedInput = {
  name: string;
  type: string;
  bytes: Uint8Array;
};

export async function validateUploads(formData: FormData, tool: Tool) {
  const files = formData.getAll("files");

  if (!files.length) {
    throw new Error("Upload at least one file.");
  }
  if (!tool.multiple && files.length !== 1) {
    throw new Error("This tool expects exactly one file.");
  }
  if (files.length > MAX_FILES) {
    throw new Error(`Upload no more than ${MAX_FILES} files at once.`);
  }

  const inputs: UploadedInput[] = [];
  for (const entry of files) {
    if (!(entry instanceof File)) throw new Error("Invalid upload payload.");
    if (entry.size > MAX_FILE_SIZE) throw new Error(`${entry.name} is larger than 25 MB.`);
    if (!isAllowedType(entry.type, tool.accepts)) throw new Error(`${entry.name} is not a supported file type.`);

    const bytes = new Uint8Array(await entry.arrayBuffer());
    assertFileSignature(bytes, entry.type);
    inputs.push({ name: sanitizeFilename(entry.name), type: entry.type, bytes });
  }

  return inputs;
}

function isAllowedType(type: string, accepts: Tool["accepts"]) {
  if (accepts === "both") return pdfMimeTypes.has(type) || imageMimeTypes.has(type);
  if (accepts === "image") return imageMimeTypes.has(type);
  return pdfMimeTypes.has(type);
}

function assertFileSignature(bytes: Uint8Array, type: string) {
  const header = new TextDecoder().decode(bytes.slice(0, 8));
  const isPdf = type === "application/pdf" && header.startsWith("%PDF-");
  const isPng = type === "image/png" && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e;
  const isJpg = type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8;

  if (!isPdf && !isPng && !isJpg) {
    throw new Error("File signature does not match the uploaded type.");
  }
}

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "upload";
}
