import { zipSync } from "fflate";

export async function renderPdfToImageZip(
  bytes: Uint8Array,
  format: "png" | "jpg" = "png",
  basename = "page"
) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("@napi-rs/canvas");
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    useSystemFonts: true
  });
  const pdf = await loadingTask.promise;
  const files: Record<string, Uint8Array> = {};

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.7 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    await page.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport
    }).promise;

    const extension = format === "jpg" ? "jpg" : "png";
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const buffer =
      format === "jpg"
        ? canvas.toBuffer("image/jpeg")
        : canvas.toBuffer(mime as unknown as "image/jpeg");
    files[`${basename}-${pageNumber}.${extension}`] = buffer as Uint8Array;
  }

  return zipSync(files);
}
