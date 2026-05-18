import { zipSync } from "fflate";
import { PDFDocument } from "pdf-lib";

export async function renderPdfToImageZip(
  bytes: Uint8Array,
  format: "png" | "jpg" = "png",
  basename = "page"
) {
  await installPdfJsCanvasGlobals();
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("@napi-rs/canvas");
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableWorker: true,
    useSystemFonts: true
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const pdf = await loadingTask.promise;
  const files: Record<string, Uint8Array> = {};

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.7 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const context = canvas.getContext("2d");

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvas: canvas as unknown as HTMLCanvasElement,
        canvasContext: context as unknown as CanvasRenderingContext2D,
        viewport
      }).promise;

      const extension = format === "jpg" ? "jpg" : "png";
      const buffer =
        format === "jpg"
          ? canvas.toBuffer("image/jpeg", 92)
          : canvas.toBuffer("image/png");
      files[`${basename}-${pageNumber}.${extension}`] = buffer as Uint8Array;
      page.cleanup();
    }
  } finally {
    await pdf.destroy();
  }

  return zipSync(files);
}

export async function compressPdfByRasterizing(bytes: Uint8Array) {
  await installPdfJsCanvasGlobals();
  const { createCanvas } = await import("@napi-rs/canvas");
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const output = await PDFDocument.create();
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableWorker: true,
    useSystemFonts: true
  } as Parameters<typeof pdfjs.getDocument>[0]);
  const pdf = await loadingTask.promise;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: getCompressionScale(pdf.numPages) });
    const displayViewport = page.getViewport({ scale: 1 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport
    }).promise;

    const jpegBuffer = canvas.toBuffer("image/jpeg", getCompressionQuality(pdf.numPages));
    const image = await output.embedJpg(jpegBuffer);
    const outputPage = output.addPage([displayViewport.width, displayViewport.height]);

    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: displayViewport.width,
      height: displayViewport.height
    });

    page.cleanup();
  }

  await pdf.destroy();
  return output.save({ useObjectStreams: true, objectsPerTick: 25 });
}

function getCompressionScale(pageCount: number) {
  if (pageCount > 80) return 0.55;
  if (pageCount > 35) return 0.62;
  if (pageCount > 12) return 0.72;
  return 0.82;
}

function getCompressionQuality(pageCount: number) {
  if (pageCount > 35) return 36;
  if (pageCount > 12) return 40;
  return 44;
}

async function installPdfJsCanvasGlobals() {
  const { DOMMatrix, ImageData, Path2D } = await import("@napi-rs/canvas");

  // PDF.js expects these browser canvas classes when rendering in Node.
  Object.assign(globalThis, {
    DOMMatrix: globalThis.DOMMatrix ?? DOMMatrix,
    ImageData: globalThis.ImageData ?? ImageData,
    Path2D: globalThis.Path2D ?? Path2D
  });
}
