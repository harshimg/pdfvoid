"use client";

import type React from "react";
import { useMemo, useRef, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Check,
  Download,
  Image as ImageIcon,
  Info,
  Italic,
  Layers,
  Link2,
  Loader2,
  Signature as SignatureIcon,
  Type,
  Underline,
  Unlink
} from "lucide-react";
import { toast } from "sonner";
import { recordToolIntent } from "@/app/actions";
import { AdSlot } from "@/components/ads/ad-slot";
import { FileUploader, type QueuedFile } from "@/components/pdf/file-uploader";
import { PdfPreview, type PdfAreaSelection } from "@/components/pdf/pdf-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ToolClientConfig } from "@/lib/tools";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type ToolOptions = {
  ranges: string;
  pages: string;
  order: string;
  rotation: string;
  watermark: string;
  watermarkMode: "text" | "image";
  watermarkText: string;
  watermarkFont: "helvetica" | "times" | "courier";
  watermarkColor: string;
  watermarkBold: boolean;
  watermarkItalic: boolean;
  watermarkUnderline: boolean;
  watermarkSize: string;
  watermarkPosition:
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
  watermarkMosaic: boolean;
  watermarkX: string;
  watermarkY: string;
  watermarkOpacity: string;
  watermarkRotation: string;
  watermarkFromPage: string;
  watermarkToPage: string;
  watermarkLayer: "over" | "under";
  watermarkImageScale: string;
  signatureMode: "draw" | "type";
  signatureText: string;
  signaturePage: string;
  signatureX: string;
  signatureY: string;
  signatureWidth: string;
  signatureHeight: string;
  signatureColor: string;
  linkMode: "add" | "remove";
  linkUrl: string;
  linkPage: string;
  linkPages: string;
  linkX: string;
  linkY: string;
  linkWidth: string;
  linkHeight: string;
  linkApplyAll: boolean;
  linkFullPage: boolean;
  linkBorder: boolean;
  ocrLanguage: "eng" | "hin" | "eng+hin";
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
  watermarkMode: "text",
  watermarkText: "Confidential",
  watermarkFont: "helvetica",
  watermarkColor: "#0891b2",
  watermarkBold: true,
  watermarkItalic: false,
  watermarkUnderline: false,
  watermarkSize: "64",
  watermarkPosition: "middle-center",
  watermarkMosaic: false,
  watermarkX: "50",
  watermarkY: "50",
  watermarkOpacity: "0.22",
  watermarkRotation: "-32",
  watermarkFromPage: "1",
  watermarkToPage: "",
  watermarkLayer: "over",
  watermarkImageScale: "28",
  signatureMode: "draw",
  signatureText: "",
  signaturePage: "1",
  signatureX: "58",
  signatureY: "78",
  signatureWidth: "30",
  signatureHeight: "9",
  signatureColor: "#111827",
  linkMode: "add",
  linkUrl: "",
  linkPage: "1",
  linkPages: "",
  linkX: "",
  linkY: "",
  linkWidth: "",
  linkHeight: "",
  linkApplyAll: false,
  linkFullPage: false,
  linkBorder: true,
  ocrLanguage: "eng",
  title: "",
  author: "",
  subject: "",
  keywords: "",
  imageFormat: "png",
  password: ""
};

const compressionProfiles = [
  { name: "balanced", scale: 0.72, quality: 0.38, grayscale: false },
  { name: "strong", scale: 0.52, quality: 0.3, grayscale: false },
  { name: "smaller", scale: 0.38, quality: 0.24, grayscale: false },
  { name: "smallest", scale: 0.28, quality: 0.2, grayscale: true },
  { name: "extreme", scale: 0.2, quality: 0.16, grayscale: true }
];

const ghostscriptCompressionProfiles = [
  {
    name: "ebook",
    pdfSettings: "/ebook",
    imageResolution: "144",
    monoResolution: "200",
    targetRatio: 0.6
  },
  {
    name: "strong",
    pdfSettings: "/screen",
    imageResolution: "96",
    monoResolution: "150",
    targetRatio: 0.45
  },
  {
    name: "maximum",
    pdfSettings: "/screen",
    imageResolution: "72",
    monoResolution: "120",
    targetRatio: 0.3
  }
];

type GhostscriptFileSystem = {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string, options?: { encoding?: "binary" }) => Uint8Array;
};

type GhostscriptModule = {
  arguments: string[];
  preRun: Array<() => void>;
  postRun: Array<() => void>;
  locateFile: (path: string) => string;
  print: (text: string) => void;
  printErr: (text: string) => void;
  setStatus: (text: string) => void;
  totalDependencies: number;
};

type GhostscriptWindow = Window & {
  FS?: GhostscriptFileSystem;
  Module?: GhostscriptModule;
};

export function ToolRunner({ tool }: { tool: ToolClientConfig }) {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [options, setOptions] = useState(defaultOptions);
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const linkSelection = useMemo<PdfAreaSelection | null>(() => {
    if (tool.slug !== "pdf-links" || options.linkMode !== "add") return null;

    if (options.linkFullPage) {
      return {
        page: Number(options.linkPage) || 1,
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };
    }

    const x = Number(options.linkX);
    const y = Number(options.linkY);
    const width = Number(options.linkWidth);
    const height = Number(options.linkHeight);
    const page = Number(options.linkPage);

    if (![x, y, width, height, page].every(Number.isFinite) || width <= 0 || height <= 0) {
      return null;
    }

    return { page, x, y, width, height };
  }, [
    options.linkFullPage,
    options.linkHeight,
    options.linkMode,
    options.linkPage,
    options.linkWidth,
    options.linkX,
    options.linkY,
    tool.slug
  ]);
  const signatureSelection = useMemo<PdfAreaSelection | null>(() => {
    if (tool.slug !== "sign-pdf") return null;

    const x = Number(options.signatureX);
    const y = Number(options.signatureY);
    const width = Number(options.signatureWidth);
    const height = Number(options.signatureHeight);
    const page = Number(options.signaturePage);

    if (![x, y, width, height, page].every(Number.isFinite) || width <= 0 || height <= 0) {
      return null;
    }

    return { page, x, y, width, height };
  }, [
    options.signatureHeight,
    options.signaturePage,
    options.signatureWidth,
    options.signatureX,
    options.signatureY,
    tool.slug
  ]);

  const canProcess = useMemo(() => {
    if (tool.slug === "lock") return false;
    if (tool.slug === "watermark" && options.watermarkMode === "image" && !watermarkImageFile) return false;
    if (tool.slug === "pdf-links" && options.linkMode === "add" && (!options.linkUrl.trim() || !linkSelection)) return false;
    if (tool.slug === "sign-pdf") {
      const hasSignature = options.signatureMode === "type" ? options.signatureText.trim() : signatureDataUrl;
      if (!hasSignature || !signatureSelection) return false;
    }
    if (tool.output === "preview") return files.length > 0;
    if (tool.multiple) return files.length >= 1;
    return files.length === 1;
  }, [
    files.length,
    options.linkMode,
    options.linkUrl,
    options.signatureMode,
    options.signatureText,
    options.watermarkMode,
    linkSelection,
    signatureDataUrl,
    signatureSelection,
    tool.multiple,
    tool.output,
    tool.slug,
    watermarkImageFile
  ]);

  function updateLinkSelection(selection: PdfAreaSelection) {
    setOptions((current) => ({
      ...current,
      linkPage: String(selection.page),
      linkX: selection.x.toFixed(2),
      linkY: selection.y.toFixed(2),
      linkWidth: selection.width.toFixed(2),
      linkHeight: selection.height.toFixed(2),
      linkFullPage: false
    }));
  }

  function updateSignatureSelection(selection: PdfAreaSelection) {
    setOptions((current) => ({
      ...current,
      signaturePage: String(selection.page),
      signatureX: selection.x.toFixed(2),
      signatureY: selection.y.toFixed(2),
      signatureWidth: selection.width.toFixed(2),
      signatureHeight: selection.height.toFixed(2)
    }));
  }

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

      if (tool.slug === "pdf-to-images") {
        await convertPdfToImagesInBrowser(files[0].file, options.imageFormat, setProgress);
        toast.success("PDF pages are ready.");
        return;
      }

      if (tool.slug === "pdf-to-text") {
        const text = await extractTextWithOcrInBrowser(files[0].file, options.ocrLanguage, setProgress);
        setOcrText(text);
        downloadBlob(
          new Blob([text], { type: "text/plain;charset=utf-8" }),
          "pdfvoid-ocr-text.txt"
        );
        toast.success("OCR text is ready.");
        return;
      }

      if (tool.slug === "sign-pdf") {
        await signPdfInBrowser(files[0].file, options, signatureDataUrl, setProgress);
        toast.success("Signed PDF is ready.");
        return;
      }

      const formData = new FormData();
      files.forEach((item) => formData.append("files", item.file));
      if (tool.slug === "watermark" && watermarkImageFile) {
        formData.append("watermarkImage", watermarkImageFile);
      }
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
      className={
        tool.slug === "preview"
          ? "mt-8 space-y-6"
          : "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]"
      }
    >
      <div className="space-y-6">
        <FileUploader
          files={files}
          onFilesChange={setFiles}
          accept={tool.accepts}
          multiple={tool.multiple}
        />
        {tool.slug !== "preview" ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
                <CardDescription>Only the fields relevant to this tool are sent to the API.</CardDescription>
              </CardHeader>
              <CardContent>
                <ToolOptionsForm
                  tool={tool}
                  options={options}
                  setOptions={setOptions}
                  watermarkImageFile={watermarkImageFile}
                  setWatermarkImageFile={setWatermarkImageFile}
                  signatureDataUrl={signatureDataUrl}
                  setSignatureDataUrl={setSignatureDataUrl}
                />
              </CardContent>
            </Card>
            {tool.slug === "pdf-to-text" && ocrText ? (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted text</CardTitle>
                  <CardDescription>Review the OCR result before using it elsewhere.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-64 font-mono text-sm"
                    readOnly
                    value={ocrText}
                  />
                </CardContent>
              </Card>
            ) : null}
            <AdSlot placement="in-content" />
          </>
        ) : null}
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{tool.slug === "preview" ? "Read PDF" : "Preview"}</CardTitle>
            <CardDescription>
              {tool.slug === "preview"
                ? "Open pages locally with thumbnails, zoom, and rotation."
                : "Preview renders locally in your browser."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfPreview
              file={files[0]?.file}
              areaSelection={tool.slug === "sign-pdf" ? signatureSelection : linkSelection}
              areaSelectionAppliesToAll={tool.slug === "pdf-links" && options.linkApplyAll}
              selectionMode={
                tool.slug === "sign-pdf" ||
                (tool.slug === "pdf-links" && options.linkMode === "add" && !options.linkFullPage)
              }
              onAreaSelectionChange={tool.slug === "sign-pdf" ? updateSignatureSelection : updateLinkSelection}
            />
          </CardContent>
        </Card>
        {tool.slug !== "preview" ? (
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
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {tool.slug === "lock" ? "Coming soon" : "Process and download"}
              </Button>
            </CardContent>
          </Card>
        ) : null}
        <AdSlot placement="sidebar" />
      </aside>
      <AdSlot placement="mobile-sticky" />
    </motion.div>
  );
}

function ToolOptionsForm({
  tool,
  options,
  setOptions,
  watermarkImageFile,
  setWatermarkImageFile,
  signatureDataUrl,
  setSignatureDataUrl
}: {
  tool: ToolClientConfig;
  options: ToolOptions;
  setOptions: React.Dispatch<React.SetStateAction<ToolOptions>>;
  watermarkImageFile: File | null;
  setWatermarkImageFile: (file: File | null) => void;
  signatureDataUrl: string;
  setSignatureDataUrl: (value: string) => void;
}) {
  const update = <Key extends keyof ToolOptions>(key: Key, value: ToolOptions[Key]) =>
    setOptions((current) => ({ ...current, [key]: value }));

  if (tool.slug === "compress") {
    return (
      <p className="text-sm text-muted-foreground">
        Compression runs in your browser with free Ghostscript WASM first, then
        falls back to page raster compression when needed. Best for scanned and
        image-heavy PDFs.
      </p>
    );
  }

  if (tool.slug === "preview" || tool.slug === "merge") {
    return <p className="text-sm text-muted-foreground">No extra options needed.</p>;
  }

  if (tool.slug === "pdf-to-text") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="OCR language"
          hint="English is fastest. Hindi and combined OCR need larger language data."
        >
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={options.ocrLanguage}
            onChange={(event) => update("ocrLanguage", event.target.value as ToolOptions["ocrLanguage"])}
          >
            <option value="eng">English</option>
            <option value="hin">Hindi</option>
            <option value="eng+hin">English + Hindi</option>
          </select>
        </Field>
        <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
          OCR runs locally in your browser with Tesseract.js. The first run may
          download language data, then the browser can cache it.
        </div>
      </div>
    );
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
        <WatermarkOptions
          options={options}
          update={update}
          imageFile={watermarkImageFile}
          setImageFile={setWatermarkImageFile}
        />
      ) : null}
      {tool.slug === "sign-pdf" ? (
        <SignatureOptions
          options={options}
          update={update}
          signatureDataUrl={signatureDataUrl}
          setSignatureDataUrl={setSignatureDataUrl}
        />
      ) : null}
      {tool.slug === "pdf-links" ? (
        <PdfLinkOptions options={options} update={update} />
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
            onChange={(event) => update("imageFormat", event.target.value as ToolOptions["imageFormat"])}
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

type ToolOptionUpdater = <Key extends keyof ToolOptions>(
  key: Key,
  value: ToolOptions[Key]
) => void;

function PdfLinkOptions({
  options,
  update
}: {
  options: ToolOptions;
  update: ToolOptionUpdater;
}) {
  return (
    <div className="space-y-6 md:col-span-2">
      <div className="grid overflow-hidden rounded-lg border md:grid-cols-2">
        <button
          type="button"
          className={cn(
            "relative flex min-h-24 flex-col items-center justify-center gap-2 border-b bg-background p-4 text-sm transition-colors md:border-b-0 md:border-r",
            options.linkMode === "add" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("linkMode", "add")}
        >
          {options.linkMode === "add" ? <ModeCheck /> : null}
          <Link2 className="h-9 w-9" />
          <span className="font-medium">Add hyperlink</span>
        </button>
        <button
          type="button"
          className={cn(
            "relative flex min-h-24 flex-col items-center justify-center gap-2 bg-background p-4 text-sm transition-colors",
            options.linkMode === "remove" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("linkMode", "remove")}
        >
          {options.linkMode === "remove" ? <ModeCheck /> : null}
          <Unlink className="h-9 w-9" />
          <span className="font-medium">Remove hyperlinks</span>
        </button>
      </div>

      {options.linkMode === "add" ? (
        <>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
            <Field label="Hyperlink URL">
              <Input
                value={options.linkUrl}
                onChange={(event) => update("linkUrl", event.target.value)}
                placeholder="https://example.com"
              />
            </Field>
            <Field label="Page">
              <Input
                min="1"
                type="number"
                value={options.linkPage}
                onChange={(event) => update("linkPage", event.target.value)}
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <input
              className="mt-0.5 h-5 w-5 accent-primary"
              type="checkbox"
              checked={options.linkFullPage}
              onChange={(event) => {
                update("linkFullPage", event.target.checked);

                if (event.target.checked) {
                  update("linkX", "0");
                  update("linkY", "0");
                  update("linkWidth", "100");
                  update("linkHeight", "100");
                } else {
                  update("linkX", "");
                  update("linkY", "");
                  update("linkWidth", "");
                  update("linkHeight", "");
                }
              }}
            />
            <span>
              <span className="block font-medium">Make the full page clickable</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Use 100% of the PDF page as the hyperlink area.
              </span>
            </span>
          </label>

          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Link area</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {options.linkFullPage
                    ? `Full page on page ${options.linkPage || 1}`
                    : options.linkWidth && options.linkHeight
                    ? `${Number(options.linkWidth).toFixed(1)}% x ${Number(options.linkHeight).toFixed(1)}% on page ${options.linkPage}`
                    : "Select an area on the PDF preview."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!options.linkWidth || !options.linkHeight}
                onClick={() => {
                  update("linkX", "");
                  update("linkY", "");
                  update("linkWidth", "");
                  update("linkHeight", "");
                  update("linkFullPage", false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <input
              className="h-5 w-5 accent-primary"
              type="checkbox"
              checked={options.linkApplyAll}
              onChange={(event) => update("linkApplyAll", event.target.checked)}
            />
            Apply this link area to every page
          </label>

          <label className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <input
              className="h-5 w-5 accent-primary"
              type="checkbox"
              checked={options.linkBorder}
              onChange={(event) => update("linkBorder", event.target.checked)}
            />
            Show a thin border around the clickable area
          </label>
        </>
      ) : (
        <Field label="Pages" hint="Example: 1,2,5-7. Leave blank to remove links from every page.">
          <Input
            value={options.linkPages}
            onChange={(event) => update("linkPages", event.target.value)}
            placeholder="All pages"
          />
        </Field>
      )}
    </div>
  );
}

function SignatureOptions({
  options,
  update,
  signatureDataUrl,
  setSignatureDataUrl
}: {
  options: ToolOptions;
  update: ToolOptionUpdater;
  signatureDataUrl: string;
  setSignatureDataUrl: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const point = getPoint(event);
    context.strokeStyle = options.signatureColor;
    context.lineWidth = 4;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function finishDrawing() {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawingRef.current) return;

    isDrawingRef.current = false;
    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl("");
  }

  return (
    <div className="space-y-6 md:col-span-2">
      <div className="grid overflow-hidden rounded-lg border md:grid-cols-2">
        <button
          type="button"
          className={cn(
            "relative flex min-h-24 flex-col items-center justify-center gap-2 border-b bg-background p-4 text-sm transition-colors md:border-b-0 md:border-r",
            options.signatureMode === "draw" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("signatureMode", "draw")}
        >
          {options.signatureMode === "draw" ? <ModeCheck /> : null}
          <SignatureIcon className="h-9 w-9" />
          <span className="font-medium">Draw signature</span>
        </button>
        <button
          type="button"
          className={cn(
            "relative flex min-h-24 flex-col items-center justify-center gap-2 bg-background p-4 text-sm transition-colors",
            options.signatureMode === "type" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("signatureMode", "type")}
        >
          {options.signatureMode === "type" ? <ModeCheck /> : null}
          <Type className="h-9 w-9" />
          <span className="font-medium">Type signature</span>
        </button>
      </div>

      {options.signatureMode === "draw" ? (
        <Field label="Draw your signature" hint="Use mouse, touch, or stylus. Drag on the PDF preview to place the signature.">
          <div className="rounded-lg border bg-white p-3">
            <canvas
              ref={canvasRef}
              width={640}
              height={220}
              className="h-44 w-full touch-none rounded-md border border-dashed border-slate-300 bg-white"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={finishDrawing}
              onPointerCancel={finishDrawing}
              aria-label="Draw signature"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {signatureDataUrl ? "Signature captured." : "Draw inside the box."}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                Clear
              </Button>
            </div>
          </div>
        </Field>
      ) : (
        <Field label="Typed signature">
          <Input
            value={options.signatureText}
            onChange={(event) => update("signatureText", event.target.value)}
            placeholder="Your name"
          />
        </Field>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Page" hint="Drag on the PDF preview to choose placement.">
          <Input
            min="1"
            type="number"
            value={options.signaturePage}
            onChange={(event) => update("signaturePage", event.target.value)}
          />
        </Field>
        <Field label="Color">
          <div className="flex h-10 items-center gap-3 rounded-md border bg-background px-3">
            <input
              className="h-6 w-8"
              type="color"
              value={options.signatureColor}
              onChange={(event) => update("signatureColor", event.target.value)}
              aria-label="Signature color"
            />
            <span className="text-sm text-muted-foreground">{options.signatureColor}</span>
          </div>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="X">
          <Input value={options.signatureX} onChange={(event) => update("signatureX", event.target.value)} />
        </Field>
        <Field label="Y">
          <Input value={options.signatureY} onChange={(event) => update("signatureY", event.target.value)} />
        </Field>
        <Field label="Width">
          <Input value={options.signatureWidth} onChange={(event) => update("signatureWidth", event.target.value)} />
        </Field>
        <Field label="Height">
          <Input value={options.signatureHeight} onChange={(event) => update("signatureHeight", event.target.value)} />
        </Field>
      </div>
    </div>
  );
}

const watermarkPositionOptions: Array<{
  value: ToolOptions["watermarkPosition"];
  label: string;
}> = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "middle-left", label: "Middle left" },
  { value: "middle-center", label: "Center" },
  { value: "middle-right", label: "Middle right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" }
];

function WatermarkOptions({
  options,
  update,
  imageFile,
  setImageFile
}: {
  options: ToolOptions;
  update: ToolOptionUpdater;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}) {
  return (
    <div className="space-y-6 md:col-span-2">
      <div className="grid overflow-hidden rounded-lg border md:grid-cols-2">
        <button
          type="button"
          className={cn(
            "relative flex min-h-28 flex-col items-center justify-center gap-2 border-b bg-background p-4 text-sm transition-colors md:border-b-0 md:border-r",
            options.watermarkMode === "text" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("watermarkMode", "text")}
        >
          {options.watermarkMode === "text" ? <ModeCheck /> : null}
          <Type className="h-10 w-10" strokeWidth={2.5} />
          <span className="font-medium">Place text</span>
        </button>
        <button
          type="button"
          className={cn(
            "relative flex min-h-28 flex-col items-center justify-center gap-2 bg-background p-4 text-sm transition-colors",
            options.watermarkMode === "image" ? "text-foreground" : "text-muted-foreground hover:bg-muted/60"
          )}
          onClick={() => update("watermarkMode", "image")}
        >
          {options.watermarkMode === "image" ? <ModeCheck /> : null}
          <ImageIcon className="h-10 w-10" strokeWidth={2.2} />
          <span className="font-medium">Place image</span>
        </button>
      </div>

      {options.watermarkMode === "text" ? (
        <div className="space-y-4">
          <Field label="Text">
            <Textarea
              value={options.watermarkText}
              onChange={(event) => update("watermarkText", event.target.value)}
              rows={3}
            />
          </Field>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px]">
            <Field label="Text format">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                  value={options.watermarkFont}
                  onChange={(event) => update("watermarkFont", event.target.value as ToolOptions["watermarkFont"])}
                >
                  <option value="helvetica">Arial</option>
                  <option value="times">Times</option>
                  <option value="courier">Courier</option>
                </select>
                <Input
                  className="w-20"
                  min="10"
                  max="220"
                  type="number"
                  value={options.watermarkSize}
                  onChange={(event) => update("watermarkSize", event.target.value)}
                  aria-label="Watermark text size"
                />
                <FormatButton
                  active={options.watermarkBold}
                  label="Bold"
                  onClick={() => update("watermarkBold", !options.watermarkBold)}
                >
                  <Bold className="h-4 w-4" />
                </FormatButton>
                <FormatButton
                  active={options.watermarkItalic}
                  label="Italic"
                  onClick={() => update("watermarkItalic", !options.watermarkItalic)}
                >
                  <Italic className="h-4 w-4" />
                </FormatButton>
                <FormatButton
                  active={options.watermarkUnderline}
                  label="Underline"
                  onClick={() => update("watermarkUnderline", !options.watermarkUnderline)}
                >
                  <Underline className="h-4 w-4" />
                </FormatButton>
              </div>
            </Field>
            <Field label="Color">
              <div className="flex h-10 overflow-hidden rounded-md border bg-background">
                <input
                  className="h-full w-14 cursor-pointer border-0 bg-transparent p-1"
                  type="color"
                  value={/^#[0-9a-f]{6}$/i.test(options.watermarkColor) ? options.watermarkColor : "#000000"}
                  onChange={(event) => update("watermarkColor", event.target.value)}
                  aria-label="Watermark text color"
                />
                <Input
                  className="h-full rounded-none border-0 font-mono uppercase focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={options.watermarkColor}
                  onChange={(event) => update("watermarkColor", event.target.value)}
                />
              </div>
            </Field>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
          <Field label="Image">
            <label className="flex min-h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed bg-muted/35 px-4 text-center text-sm transition-colors hover:bg-muted/60">
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
              <span>
                {imageFile ? `${imageFile.name} (${formatBytes(imageFile.size)})` : "Choose PNG or JPG"}
              </span>
            </label>
          </Field>
          <Field label="Image size">
            <div className="flex h-10 items-center gap-3 rounded-md border bg-background px-3">
              <input
                className="w-full accent-primary"
                min="4"
                max="90"
                type="range"
                value={options.watermarkImageScale}
                onChange={(event) => update("watermarkImageScale", event.target.value)}
                aria-label="Watermark image size"
              />
              <span className="w-10 text-right text-sm tabular-nums">{options.watermarkImageScale}%</span>
            </div>
          </Field>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Field label="Position">
          <div className="flex flex-wrap items-start gap-4">
            <div className="grid h-[108px] w-[108px] grid-cols-3 overflow-hidden rounded-md border bg-background">
              {watermarkPositionOptions.map((position) => (
                <button
                  key={position.value}
                  type="button"
                  aria-label={position.label}
                  className={cn(
                    "grid place-items-center border-r border-t transition-colors first:border-t-0 [&:nth-child(-n+3)]:border-t-0 [&:nth-child(3n)]:border-r-0",
                    options.watermarkPosition === position.value && !options.watermarkMosaic
                      ? "bg-primary/15"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    update("watermarkPosition", position.value);
                    update("watermarkMosaic", false);
                  }}
                >
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full",
                      options.watermarkPosition === position.value && !options.watermarkMosaic
                        ? "bg-primary"
                        : "bg-muted-foreground/35"
                    )}
                  />
                </button>
              ))}
            </div>
            <label className="flex h-10 items-center gap-3 text-sm">
              <input
                className="h-5 w-5 accent-primary"
                type="checkbox"
                checked={options.watermarkMosaic}
                onChange={(event) => update("watermarkMosaic", event.target.checked)}
              />
              Mosaic
            </label>
          </div>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Custom X">
            <div className="flex h-10 items-center gap-3 rounded-md border bg-background px-3">
              <input
                className="w-full accent-primary"
                min="0"
                max="100"
                type="range"
                value={options.watermarkX}
                onChange={(event) => {
                  update("watermarkX", event.target.value);
                  update("watermarkPosition", "custom");
                  update("watermarkMosaic", false);
                }}
              />
              <span className="w-10 text-right text-sm tabular-nums">{options.watermarkX}%</span>
            </div>
          </Field>
          <Field label="Custom Y">
            <div className="flex h-10 items-center gap-3 rounded-md border bg-background px-3">
              <input
                className="w-full accent-primary"
                min="0"
                max="100"
                type="range"
                value={options.watermarkY}
                onChange={(event) => {
                  update("watermarkY", event.target.value);
                  update("watermarkPosition", "custom");
                  update("watermarkMosaic", false);
                }}
              />
              <span className="w-10 text-right text-sm tabular-nums">{options.watermarkY}%</span>
            </div>
          </Field>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Transparency">
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={options.watermarkOpacity}
            onChange={(event) => update("watermarkOpacity", event.target.value)}
          >
            <option value="1">No transparency</option>
            <option value="0.55">Light transparency</option>
            <option value="0.3">Medium transparency</option>
            <option value="0.15">High transparency</option>
          </select>
        </Field>
        <Field label="Rotation">
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={options.watermarkRotation}
            onChange={(event) => update("watermarkRotation", event.target.value)}
          >
            <option value="0">Do not rotate</option>
            <option value="-32">Rotate left</option>
            <option value="32">Rotate right</option>
            <option value="-45">45 degrees left</option>
            <option value="45">45 degrees right</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Pages">
          <div className="grid grid-cols-2 overflow-hidden rounded-md border bg-background">
            <Input
              className="rounded-none border-0 border-r focus-visible:ring-0 focus-visible:ring-offset-0"
              min="1"
              type="number"
              value={options.watermarkFromPage}
              onChange={(event) => update("watermarkFromPage", event.target.value)}
              aria-label="Watermark from page"
            />
            <Input
              className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              min="1"
              type="number"
              placeholder="Last"
              value={options.watermarkToPage}
              onChange={(event) => update("watermarkToPage", event.target.value)}
              aria-label="Watermark to page"
            />
          </div>
        </Field>
        <Field label="Layer">
          <div className="grid grid-cols-2 gap-2">
            <LayerButton
              active={options.watermarkLayer === "over"}
              label="Over PDF content"
              onClick={() => update("watermarkLayer", "over")}
            />
            <LayerButton
              active={options.watermarkLayer === "under"}
              label="Below PDF content"
              onClick={() => update("watermarkLayer", "under")}
            />
          </div>
        </Field>
      </div>
    </div>
  );
}

function ModeCheck() {
  return (
    <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-secondary text-secondary-foreground">
      <Check className="h-4 w-4" />
    </span>
  );
}

function FormatButton({
  active,
  label,
  children,
  onClick
}: {
  active: boolean;
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function LayerButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border bg-muted/35 p-3 text-center text-sm transition-colors",
        active ? "border-primary text-primary" : "text-muted-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <Layers className="h-7 w-7" />
      <span className="leading-tight">{label}</span>
    </button>
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
    <div className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
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

async function signPdfInBrowser(
  file: File,
  options: ToolOptions,
  signatureDataUrl: string,
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

  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const document = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = document.getPages();
  const pageIndex = Math.trunc(clampClientNumber(Number(options.signaturePage || 1), 1, pages.length, 1)) - 1;
  const page = pages[pageIndex];
  const { width: pageWidth, height: pageHeight } = page.getSize();
  const rectWidth = Math.max(24, pageWidth * (clampClientNumber(Number(options.signatureWidth), 2, 100, 30) / 100));
  const rectHeight = Math.max(12, pageHeight * (clampClientNumber(Number(options.signatureHeight), 2, 100, 9) / 100));
  const x = clampClientNumber(pageWidth * (clampClientNumber(Number(options.signatureX), 0, 100, 58) / 100), 0, pageWidth - rectWidth, 0);
  const topY = pageHeight * (clampClientNumber(Number(options.signatureY), 0, 100, 78) / 100);
  const y = clampClientNumber(pageHeight - topY - rectHeight, 0, pageHeight - rectHeight, 0);

  setProgress(45);

  if (options.signatureMode === "draw") {
    if (!signatureDataUrl) throw new Error("Draw your signature first.");
    const signatureBytes = new Uint8Array(await (await fetch(signatureDataUrl)).arrayBuffer());
    const signatureImage = await document.embedPng(signatureBytes);
    page.drawImage(signatureImage, {
      x,
      y,
      width: rectWidth,
      height: rectHeight
    });
  } else {
    const text = options.signatureText.trim();
    if (!text) throw new Error("Type your signature first.");
    const font = await document.embedFont(StandardFonts.TimesRomanItalic);
    const color = parseClientHexColor(options.signatureColor, rgb) as ReturnType<typeof rgb>;
    const requestedSize = rectHeight * 0.72;
    const textWidth = font.widthOfTextAtSize(text, requestedSize);
    const fontSize = textWidth > rectWidth
      ? Math.max(8, requestedSize * (rectWidth / textWidth))
      : requestedSize;

    page.drawText(text, {
      x,
      y: y + (rectHeight - fontSize) / 2,
      size: fontSize,
      font,
      color
    });
  }

  setProgress(75);
  const signedBytes = await document.save({ useObjectStreams: true });
  downloadBlob(
    new Blob([signedBytes as BlobPart], { type: "application/pdf" }),
    "signed.pdf"
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

  const ghostscriptBytes = await compressWithGhostscriptWasm(bytes, setProgress).catch(() => undefined);

  if (ghostscriptBytes && ghostscriptBytes.length < bytes.length) {
    downloadBlob(
      new Blob([ghostscriptBytes as BlobPart], { type: "application/pdf" }),
      "compressed.pdf"
    );
    setProgress(100);
    const percent = Math.max(1, Math.round((1 - ghostscriptBytes.length / bytes.length) * 100));
    toast.success(`Reduced by ${percent}% with maximum browser compression.`);
    return;
  }

  setProgress(22);
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
  let bestBytes: Uint8Array | undefined;
  let bestProfileName = "";
  const targetBytes = bytes.length * 0.48;

  try {
    for (const [profileIndex, profile] of compressionProfiles.entries()) {
      const output = await PDFDocument.create();

      for (let pageNumber = 1; pageNumber <= input.numPages; pageNumber += 1) {
        const page = await input.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: profile.scale });
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

        if (profile.grayscale) {
          convertCanvasToGrayscale(context, canvas.width, canvas.height);
        }

        const jpegBytes = new Uint8Array(
          await canvasToArrayBuffer(canvas, profile.quality)
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
        const completedProfiles = profileIndex / compressionProfiles.length;
        const completedPages = pageNumber / input.numPages / compressionProfiles.length;
        setProgress(20 + Math.round((completedProfiles + completedPages) * 70));
      }

      const candidateBytes = await output.save({
        useObjectStreams: true,
        objectsPerTick: 25
      });

      if (!bestBytes || candidateBytes.length < bestBytes.length) {
        bestBytes = candidateBytes;
        bestProfileName = profile.name;
      }

      if (candidateBytes.length < targetBytes) break;
    }
  } finally {
    await input.destroy();
  }

  if (!bestBytes || bestBytes.length >= bytes.length) {
    throw new Error(
      "This PDF is already optimized for the free browser compressor. Try a scanned or image-heavy PDF for bigger reductions."
    );
  }

  downloadBlob(
    new Blob([bestBytes as BlobPart], { type: "application/pdf" }),
    "compressed.pdf"
  );
  setProgress(100);
  const percent = Math.max(1, Math.round((1 - bestBytes.length / bytes.length) * 100));
  toast.success(`Reduced by ${percent}% using ${bestProfileName} compression.`);
}

async function compressWithGhostscriptWasm(
  inputBytes: Uint8Array,
  setProgress: (progress: number) => void
) {
  if (typeof window === "undefined") return undefined;

  let bestBytes: Uint8Array | undefined;

  for (const [index, profile] of ghostscriptCompressionProfiles.entries()) {
    const progressStart = 20 + Math.round((index / ghostscriptCompressionProfiles.length) * 58);
    const progressEnd = 20 + Math.round(((index + 1) / ghostscriptCompressionProfiles.length) * 58);
    setProgress(progressStart);

    const candidateBytes = await runGhostscriptCompression(inputBytes, profile, (ratio) => {
      setProgress(progressStart + Math.round((progressEnd - progressStart) * ratio));
    });

    if (!bestBytes || candidateBytes.length < bestBytes.length) {
      bestBytes = candidateBytes;
    }

    if (candidateBytes.length <= inputBytes.length * profile.targetRatio) {
      break;
    }
  }

  return bestBytes;
}

async function runGhostscriptCompression(
  inputBytes: Uint8Array,
  profile: (typeof ghostscriptCompressionProfiles)[number],
  onProgress: (ratio: number) => void
) {
  const ghostscriptWindow = window as GhostscriptWindow;
  const outputFileName = `compressed-${profile.name}.pdf`;
  const script = document.createElement("script");

  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=${profile.pdfSettings}`,
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    "-dSAFER",
    "-dDetectDuplicateImages=true",
    "-dCompressFonts=true",
    "-dSubsetFonts=true",
    "-dEmbedAllFonts=true",
    "-dColorImageDownsampleType=/Bicubic",
    `-dColorImageResolution=${profile.imageResolution}`,
    "-dGrayImageDownsampleType=/Bicubic",
    `-dGrayImageResolution=${profile.imageResolution}`,
    "-dMonoImageDownsampleType=/Subsample",
    `-dMonoImageResolution=${profile.monoResolution}`,
    `-sOutputFile=${outputFileName}`,
    "input.pdf"
  ];

  return new Promise<Uint8Array>((resolve, reject) => {
    let finished = false;

    const cleanup = () => {
      finished = true;
      clearTimeout(timeoutId);
      script.remove();
      delete ghostscriptWindow.Module;
    };

    const fail = (error: unknown) => {
      if (finished) return;
      cleanup();
      reject(error instanceof Error ? error : new Error("Ghostscript compression failed."));
    };

    ghostscriptWindow.Module = {
      arguments: args,
      locateFile: (path) => `/ghostscript/${path}`,
      preRun: [
        () => {
          const fs = ghostscriptWindow.FS;
          if (!fs) throw new Error("Ghostscript filesystem is not ready.");
          fs.writeFile("input.pdf", inputBytes);
        }
      ],
      postRun: [
        () => {
          const fs = ghostscriptWindow.FS;
          if (!fs) {
            fail(new Error("Ghostscript output filesystem is not ready."));
            return;
          }

          try {
            const outputBytes = fs.readFile(outputFileName, { encoding: "binary" });
            cleanup();
            resolve(outputBytes);
          } catch (error) {
            fail(error);
          }
        }
      ],
      print: () => undefined,
      printErr: () => undefined,
      setStatus: (text) => {
        const match = text.match(/\((\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\)/);
        if (!match) return;

        const current = Number(match[1]);
        const total = Number(match[2]);
        if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
          onProgress(Math.min(0.95, current / total));
        }
      },
      totalDependencies: 0
    };

    script.async = true;
    script.src = `/ghostscript/gs.js?v=${Date.now()}-${profile.name}`;
    script.onerror = () => fail(new Error("Unable to load Ghostscript compression engine."));
    const timeoutId = setTimeout(
      () => fail(new Error("Ghostscript compression timed out.")),
      120000
    );
    document.body.appendChild(script);
  });
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

function convertCanvasToGrayscale(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const gray = Math.round(
      data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114
    );
    data[index] = gray;
    data[index + 1] = gray;
    data[index + 2] = gray;
  }

  context.putImageData(imageData, 0, 0);
}

async function convertPdfToImagesInBrowser(
  file: File,
  format: "png" | "jpg",
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

  const [pdfjs, { zipSync }] = await Promise.all([
    import("pdfjs-dist"),
    import("fflate")
  ]);

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const loadingTask = pdfjs.getDocument({
    data: bytes,
    isEvalSupported: false,
    useSystemFonts: true
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const pdf = await loadingTask.promise;
  const filesToZip: Record<string, Uint8Array> = {};
  const extension = format === "jpg" ? "jpg" : "png";
  const mime = format === "jpg" ? "image/jpeg" : "image/png";

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      canvas.style.width = `${Math.ceil(viewport.width)}px`;
      canvas.style.height = `${Math.ceil(viewport.height)}px`;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        throw new Error("Your browser could not create a canvas for image export.");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, viewport.width, viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport
      }).promise;

      const imageBytes = new Uint8Array(
        await canvasToImageArrayBuffer(canvas, mime, format === "jpg" ? 0.92 : undefined)
      );
      filesToZip[`page-${String(pageNumber).padStart(3, "0")}.${extension}`] = imageBytes;

      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
      setProgress(20 + Math.round((pageNumber / pdf.numPages) * 70));
    }
  } finally {
    await pdf.destroy();
  }

  const zipBytes = zipSync(filesToZip, { level: 6 });
  downloadBlob(
    new Blob([zipBytes as BlobPart], { type: "application/zip" }),
    `pdf-pages-${extension}.zip`
  );
  setProgress(100);
}

async function extractTextWithOcrInBrowser(
  file: File,
  language: ToolOptions["ocrLanguage"],
  setProgress: (progress: number) => void
) {
  if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a supported PDF or image file.`);
  }

  const [{ createWorker, PSM }, pdfjs] = await Promise.all([
    import("tesseract.js"),
    file.type === "application/pdf" ? import("pdfjs-dist") : Promise.resolve(undefined)
  ]);

  let progressStart = 25;
  let progressSpan = 60;
  const worker = await createWorker(language, undefined, {
    logger: (message) => {
      if (message.status !== "recognizing text") return;
      setProgress(progressStart + Math.round(message.progress * progressSpan));
    }
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
    preserve_interword_spaces: "1",
    user_defined_dpi: "220"
  });

  const output: string[] = [];

  try {
    if (file.type.startsWith("image/")) {
      setProgress(25);
      progressStart = 30;
      progressSpan = 60;
      const result = await worker.recognize(file);
      output.push(result.data.text.trim());
      return buildOcrTextOutput(file.name, output);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const header = new TextDecoder().decode(bytes.slice(0, 8));
    if (!header.startsWith("%PDF-")) {
      throw new Error(`${file.name} does not look like a valid PDF.`);
    }

    if (!pdfjs) {
      throw new Error("PDF renderer could not be loaded for OCR.");
    }

    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
    const loadingTask = pdfjs.getDocument({
      data: bytes,
      isEvalSupported: false,
      useSystemFonts: true
    } as Parameters<typeof pdfjs.getDocument>[0]);
    const pdf = await loadingTask.promise;

    try {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d", { alpha: false });

        if (!context) {
          throw new Error("Your browser could not create a canvas for OCR.");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvas,
          canvasContext: context,
          viewport
        }).promise;

        progressStart = 20 + Math.round(((pageNumber - 1) / pdf.numPages) * 72);
        progressSpan = Math.max(8, Math.round(72 / pdf.numPages));
        const result = await worker.recognize(canvas);
        const text = result.data.text.trim();
        output.push(`--- Page ${pageNumber} ---\n${text || "[No text detected]"}`);

        page.cleanup();
        canvas.width = 0;
        canvas.height = 0;
      }
    } finally {
      await pdf.destroy();
    }
  } finally {
    await worker.terminate();
  }

  return buildOcrTextOutput(file.name, output);
}

function buildOcrTextOutput(filename: string, pages: string[]) {
  const text = pages.join("\n\n").trim();

  if (!text) {
    throw new Error("No readable text was detected. Try a clearer scan or another OCR language.");
  }

  return [
    `PDFVoid OCR result`,
    `Source: ${filename}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    text
  ].join("\n");
}

function canvasToImageArrayBuffer(
  canvas: HTMLCanvasElement,
  mime: "image/png" | "image/jpeg",
  quality?: number
) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("Unable to encode page image."));
          return;
        }
        resolve(await blob.arrayBuffer());
      },
      mime,
      quality
    );
  });
}

function clampClientNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function parseClientHexColor(
  value: string,
  rgb: (red: number, green: number, blue: number) => unknown
) {
  const match = value.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return rgb(0.07, 0.09, 0.15);
  return rgb(
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255
  );
}
