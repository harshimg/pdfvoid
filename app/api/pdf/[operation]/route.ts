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
    const result = await processPdfTool(operation as ToolSlug, files, options);

    return binaryResponse(result.bytes, result.filename, result.contentType);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process PDF.";
    const status = message.includes("Too many") ? 429 : message.includes("Unsupported") ? 404 : 400;
    return Response.json({ error: message }, { status });
  }
}
