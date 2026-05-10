"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export function PdfPreview({ file }: { file?: File }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file || file.type !== "application/pdf") {
      setUrl(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) {
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

  return (
    <object
      data={url}
      type="application/pdf"
      className="h-[520px] w-full rounded-lg border bg-card"
      aria-label="PDF preview"
    >
      <div className="p-6 text-sm text-muted-foreground">
        Your browser cannot display this PDF preview.
      </div>
    </object>
  );
}
