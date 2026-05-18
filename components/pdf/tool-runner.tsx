"use client";

import type React from "react";
import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Download, Info, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { recordToolIntent } from "@/app/actions";
import { AdSlot } from "@/components/ads/ad-slot";
import { FileUploader, type QueuedFile } from "@/components/pdf/file-uploader";
import { PdfPreview } from "@/components/pdf/pdf-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ToolClientConfig } from "@/lib/tools";
import { downloadBlob } from "@/lib/utils";

type ToolOptions = {
  ranges: string;
  pages: string;
  order: string;
  rotation: string;
  watermark: string;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  imageFormat: "png" | "jpg";
  password: string;
};

const defaultOptions: ToolOptions = {
  ranges: "",
  pages: "",
  order: "",
  rotation: "90",
  watermark: "Confidential",
  title: "",
  author: "",
  subject: "",
  keywords: "",
  imageFormat: "png",
  password: ""
};

export function ToolRunner({ tool }: { tool: ToolClientConfig }) {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [options, setOptions] = useState(defaultOptions);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);

  const canProcess = useMemo(() => {
    if (tool.slug === "lock") return false;
    if (tool.output === "preview") return files.length > 0;
    if (tool.multiple) return files.length >= 1;
    return files.length === 1;
  }, [files.length, tool.multiple, tool.output, tool.slug]);

  async function processFiles() {
    if (!canProcess) {
      toast.error("Add the required files first.");
      return;
    }

    if (tool.output === "preview") {
      toast.success("Preview loaded locally in your browser.");
      return;
    }

    setIsProcessing(true);
    setProgress(20);

    startTransition(() => {
      recordToolIntent(tool.slug).catch(() => undefined);
    });

    try {
      if (tool.slug === "merge") {
        await mergePdfsInBrowser(files, setProgress);
        toast.success("Merged PDF is ready.");
        return;
      }

      if (tool.slug === "compress") {
        await compressPdfInBrowser(files[0].file, setProgress);
        toast.success("Compressed PDF is ready.");
        return;
      }

      const formData = new FormData();
      files.forEach((item) => formData.append("files", item.file));
      formData.append("options", JSON.stringify(options));
      setProgress(45);

      const response = await fetch(`/api/pdf/${tool.slug}`, {
        method: "POST",
        body: formData
      });
      setProgress(75);

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Processing failed" }));
        throw new Error(payload.error ?? "Processing failed");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") ?? "";
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `pdfvoid-${tool.slug}.${tool.output}`;
      downloadBlob(blob, filename);
      setProgress(100);
      toast.success("Your file is ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to process file.");
    } finally {
      setTimeout(() => setProgress(0), 700);
      setIsProcessing(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          accept={tool.accepts}
          multiple={tool.multiple}
        />
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Only the fields relevant to this tool are sent to the API.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToolOptionsForm tool={tool} options={options} setOptions={setOptions} />
          </CardContent>
        </Card>
        <AdSlot placement="in-content" />
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Preview uses your local browser object URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <PdfPreview file={files[0]?.file} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Run tool</CardTitle>
            <CardDescription>
              Files are validated and processed through the app route.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tool.status === "adapter" ? (
              <div className="flex gap-2 rounded-lg border bg-muted/45 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Password-grade PDF encryption needs a qpdf-compatible adapter for
                production. This route is kept adapter-ready and fails safely.
              </div>
            ) : null}
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Button className="w-full gap-2" disabled={!canProcess || isProcessing || isPending} onClick={processFiles}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : tool.output === "preview" ? <Wand2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
              {tool.slug === "lock" ? "Coming soon" : tool.output === "preview" ? "Load preview" : "Process and download"}
            </Button>
          </CardContent>
        </Card>
        <AdSlot placement="sidebar" />
      </aside>
      <AdSlot placement="mobile-sticky" />
    </motion.div>
  );
}

function ToolOptionsForm({
  tool,
  options,
  setOptions
}: {
  tool: ToolClientConfig;
  options: ToolOptions;
  setOptions: (options: ToolOptions) => void;
}) {
  const update = (key: keyof ToolOptions, value: string) =>
    setOptions({ ...options, [key]: value });

  if (tool.slug === "compress") {
    return (
      <p className="text-sm text-muted-foreground">
        Compression runs in your browser and rebuilds pages as optimized JPEG-backed
        PDF pages. Best for scanned PDFs and photo-heavy PDFs.
      </p>
    );
  }

  if (tool.slug === "preview" || tool.slug === "merge") {
    return <p className="text-sm text-muted-foreground">No extra options needed.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tool.slug === "split" ? (
        <Field label="Ranges" hint="Example: 1-3,5,8-10">
          <Input value={options.ranges} onChange={(event) => update("ranges", event.target.value)} placeholder="Leave blank to split every page" />
        </Field>
      ) : null}
      {["rotate", "delete-pages"].includes(tool.slug) ? (
        <Field label="Pages" hint="Example: 1,2,5-7. Leave blank for all pages.">
          <Input value={options.pages} onChange={(event) => update("pages", event.target.value)} placeholder="1,3-5" />
        </Field>
      ) : null}
      {tool.slug === "rotate" ? (
        <Field label="Rotation" hint="Degrees clockwise">
          <Input value={options.rotation} onChange={(event) => update("rotation", event.target.value)} placeholder="90" />
        </Field>
      ) : null}
      {tool.slug === "rearrange-pages" ? (
        <Field label="New page order" hint="Example: 3,1,2,4">
          <Input value={options.order} onChange={(event) => update("order", event.target.value)} placeholder="3,1,2" />
        </Field>
      ) : null}
      {tool.slug === "watermark" ? (
        <Field label="Watermark text" hint="Text is applied to every page.">
          <Textarea value={options.watermark} onChange={(event) => update("watermark", event.target.value)} />
        </Field>
      ) : null}
      {tool.slug === "metadata" ? (
        <>
          <Field label="Title">
            <Input value={options.title} onChange={(event) => update("title", event.target.value)} />
          </Field>
          <Field label="Author">
            <Input value={options.author} onChange={(event) => update("author", event.target.value)} />
          </Field>
          <Field label="Subject">
            <Input value={options.subject} onChange={(event) => update("subject", event.target.value)} />
          </Field>
          <Field label="Keywords" hint="Comma-separated">
            <Input value={options.keywords} onChange={(event) => update("keywords", event.target.value)} />
          </Field>
        </>
      ) : null}
      {["pdf-to-images", "extract-images"].includes(tool.slug) ? (
        <Field label="Image format" hint="Use PNG for crisp text or JPG for smaller files.">
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={options.imageFormat}
            onChange={(event) => update("imageFormat", event.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </Field>
      ) : null}
      {["lock", "unlock"].includes(tool.slug) ? (
        <Field label="Password">
          <Input type="password" value={options.password} onChange={(event) => update("password", event.target.value)} />
        </Field>
      ) : null}
    </div>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

async function mergePdfsInBrowser(
  files: QueuedFile[],
  setProgress: (progress: number) => void
) {
  const { PDFDocument } = await import("pdf-lib");
  const output = await PDFDocument.create();

  for (const [index, item] of files.entries()) {
    if (item.file.type !== "application/pdf") {
      throw new Error(`${item.file.name} is not a PDF file.`);
    }

    const bytes = new Uint8Array(await item.file.arrayBuffer());
    const header = new TextDecoder().decode(bytes.slice(0, 8));
    if (!header.startsWith("%PDF-")) {
      throw new Error(`${item.file.name} does not look like a valid PDF.`);
    }

    const input = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await output.copyPages(input, input.getPageIndices());
    pages.forEach((page) => output.addPage(page));
    setProgress(20 + Math.round(((index + 1) / files.length) * 65));
  }

  const mergedBytes = await output.save({ useObjectStreams: true });
  downloadBlob(
    new Blob([mergedBytes as BlobPart], { type: "application/pdf" }),
    "merged.pdf"
  );
  setProgress(100);
}

async function compressPdfInBrowser(
  file: File,
  setProgress: (progress: number) => void
) {
  if (file.type !== "application/pdf") {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const header = new TextDecoder().decode(bytes.slice(0, 8));
  if (!header.startsWith("%PDF-")) {
    throw new Error(`${file.name} does not look like a valid PDF.`);
  }

  const [{ PDFDocument }, pdfjs] = await Promise.all([
    import("pdf-lib"),
    import("pdfjs-dist")
  ]);

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const loadingTask = pdfjs.getDocument({
    data: bytes,
    useSystemFonts: true,
    isEvalSupported: false
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const input = await loadingTask.promise;
  const output = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= input.numPages; pageNumber += 1) {
    const page = await input.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = getBrowserCompressionScale(input.numPages);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      throw new Error("Your browser could not create a canvas for compression.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvas,
      canvasContext: context,
      viewport
    }).promise;

    const jpegBytes = new Uint8Array(
      await canvasToArrayBuffer(canvas, getBrowserCompressionQuality(input.numPages))
    );
    const image = await output.embedJpg(jpegBytes);
    const outputPage = output.addPage([baseViewport.width, baseViewport.height]);

    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: baseViewport.width,
      height: baseViewport.height
    });

    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;
    setProgress(20 + Math.round((pageNumber / input.numPages) * 70));
  }

  await input.destroy();
  const compressedBytes = await output.save({ useObjectStreams: true, objectsPerTick: 25 });

  if (compressedBytes.length >= bytes.length) {
    throw new Error(
      "This PDF is already optimized or cannot be reduced with browser compression."
    );
  }

  downloadBlob(
    new Blob([compressedBytes as BlobPart], { type: "application/pdf" }),
    "compressed.pdf"
  );
  setProgress(100);
}

function canvasToArrayBuffer(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("Unable to encode compressed page image."));
          return;
        }
        resolve(await blob.arrayBuffer());
      },
      "image/jpeg",
      quality
    );
  });
}

function getBrowserCompressionScale(pageCount: number) {
  if (pageCount > 80) return 0.5;
  if (pageCount > 35) return 0.58;
  if (pageCount > 12) return 0.68;
  return 0.78;
}

function getBrowserCompressionQuality(pageCount: number) {
  if (pageCount > 35) return 0.34;
  if (pageCount > 12) return 0.38;
  return 0.42;
}
