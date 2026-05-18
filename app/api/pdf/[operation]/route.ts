import { NextRequest } from "next/server";
import { getTool, type ToolSlug } from "@/lib/tools";
import { binaryResponse } from "@/lib/pdf/respond";
import { processPdfTool } from "@/lib/pdf/operations";
import { parseOptions } from "@/lib/pdf/options";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { validateUploads } from "@/lib/security/upload-guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await context.params;
    const tool = getTool(operation);
    if (!tool || tool.slug === "preview") {
      return Response.json({ error: "Unsupported operation." }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") ?? "local";
    assertRateLimit(`${ip}:${operation}`);

    const formData = await request.formData();
    const files = await validateUploads(formData, tool);
    const options = parseOptions(formData.get("options"));
    if (tool.slug === "watermark") {
      options.watermarkImage = await parseWatermarkImage(formData.get("watermarkImage"));
    }
    const result = await processPdfTool(operation as ToolSlug, files, options);

    return binaryResponse(result.bytes, result.filename, result.contentType);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process PDF.";
    const status = message.includes("Too many") ? 429 : message.includes("Unsupported") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}

async function parseWatermarkImage(entry: FormDataEntryValue | null) {
  if (!(entry instanceof File) || entry.size === 0) return undefined;
  if (entry.size > 10 * 1024 * 1024) {
    throw new Error("Watermark image is larger than 10 MB.");
  }
  if (entry.type !== "image/png" && entry.type !== "image/jpeg") {
    throw new Error("Watermark image must be a PNG or JPG file.");
  }

  const bytes = new Uint8Array(await entry.arrayBuffer());
  const isPng = entry.type === "image/png" && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e;
  const isJpg = entry.type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8;
  if (!isPng && !isJpg) {
    throw new Error("Watermark image signature does not match the uploaded type.");
  }

  return { type: entry.type as "image/png" | "image/jpeg", bytes };
}
