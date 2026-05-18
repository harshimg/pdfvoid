"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  RotateCw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PdfViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport: (options: { scale: number; rotation?: number }) => PdfViewport;
  render: (options: {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    viewport: unknown;
  }) => { promise: Promise<void>; cancel: () => void };
  cleanup: () => void;
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

export function PdfPreview({ file }: { file?: File }) {
  const [pdf, setPdf] = useState<PdfDocument>();
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let activePdf: PdfDocument | undefined;

    async function loadPdf() {
      if (!file || file.type !== "application/pdf") {
        setPdf(undefined);
        setError(undefined);
        return;
      }

      setIsLoading(true);
      setError(undefined);
      setPageNumber(1);
      setZoom(1);
      setRotation(0);

      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
        const bytes = new Uint8Array(await file.arrayBuffer());
        const loadingTask = pdfjs.getDocument({
          data: bytes,
          isEvalSupported: false,
          useSystemFonts: true
        } as Parameters<typeof pdfjs.getDocument>[0]);
        activePdf = (await loadingTask.promise) as unknown as PdfDocument;

        if (!cancelled) {
          setPdf(activePdf);
        }
      } catch {
        if (!cancelled) {
          setPdf(undefined);
          setError("Unable to open this PDF preview.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      activePdf?.destroy().catch(() => undefined);
    };
  }, [file]);

  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<PdfPage["render"]> | undefined;

    async function renderPage() {
      if (!pdf || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: zoom, rotation });
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.ceil(viewport.width * ratio);
        canvas.height = Math.ceil(viewport.height * ratio);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, viewport.width, viewport.height);

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport
        });
        await renderTask.promise;
        page.cleanup();
      } catch (renderError) {
        if (!cancelled && !(renderError instanceof Error && renderError.name === "RenderingCancelledException")) {
          setError("Unable to render this page.");
        }
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pageNumber, pdf, rotation, zoom]);

  const pageNumbers = useMemo(
    () => Array.from({ length: pdf?.numPages ?? 0 }, (_, index) => index + 1),
    [pdf?.numPages]
  );

  if (!file) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/35 p-6 text-center">
        <FileText className="h-10 w-10 text-muted-foreground" />
        <p className="mt-3 font-medium">Preview appears here</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a PDF to inspect it before processing.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-lg border bg-muted/25">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !pdf) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
        {error ?? "Unable to open this PDF preview."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            Page {pageNumber} of {pdf.numPages}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((value) => Math.max(1, value - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={pageNumber >= pdf.numPages}
            onClick={() => setPageNumber((value) => Math.min(pdf.numPages, value + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={zoom <= 0.6}
            onClick={() => setZoom((value) => Math.max(0.6, Number((value - 0.2).toFixed(1))))}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-14 text-center text-xs font-medium">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            disabled={zoom >= 2.4}
            onClick={() => setZoom((value) => Math.min(2.4, Number((value + 0.2).toFixed(1))))}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRotation((value) => (value + 90) % 360)}
            aria-label="Rotate preview"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid h-[680px] grid-cols-[92px_minmax(0,1fr)] bg-muted/20 sm:grid-cols-[116px_minmax(0,1fr)]">
        <div className="overflow-y-auto border-r bg-background/80 p-2">
          <div className="space-y-2">
            {pageNumbers.map((number) => (
              <ThumbnailButton
                key={number}
                pdf={pdf}
                pageNumber={number}
                active={number === pageNumber}
                onClick={() => setPageNumber(number)}
              />
            ))}
          </div>
        </div>

        <div className="overflow-auto p-4">
          <div className="flex min-h-full items-start justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-none rounded-sm bg-white shadow-xl shadow-black/20"
              aria-label={`PDF page ${pageNumber}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThumbnailButton({
  pdf,
  pageNumber,
  active,
  onClick
}: {
  pdf: PdfDocument;
  pageNumber: number;
  active: boolean;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<PdfPage["render"]> | undefined;

    async function renderThumbnail() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 0.18 });
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.ceil(viewport.width * ratio);
        canvas.height = Math.ceil(viewport.height * ratio);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, viewport.width, viewport.height);

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport
        });
        await renderTask.promise;
        page.cleanup();
      } catch {
        // A thumbnail failing should not block the full reader.
      }
    }

    renderThumbnail();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pageNumber, pdf]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid w-full gap-1 rounded-md border p-1 text-center text-xs transition hover:border-primary/60",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
      )}
      aria-label={`Open page ${pageNumber}`}
    >
      <span className="flex justify-center overflow-hidden rounded bg-white">
        <canvas ref={canvasRef} className="max-w-full" />
      </span>
      <span>{pageNumber}</span>
    </button>
  );
}
