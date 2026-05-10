"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, cn } from "@/lib/utils";

export type QueuedFile = {
  id: string;
  file: File;
};

type FileUploaderProps = {
  files: QueuedFile[];
  onFilesChange: (files: QueuedFile[]) => void;
  accept: "pdf" | "image" | "both";
  multiple: boolean;
};

const acceptMap = {
  pdf: { "application/pdf": [".pdf"] },
  image: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
  both: {
    "application/pdf": [".pdf"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"]
  }
};

export function FileUploader({ files, onFilesChange, accept, multiple }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const next = acceptedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file
      }));
      onFilesChange(multiple ? [...files, ...next] : next.slice(0, 1));
    },
    [files, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: 25 * 1024 * 1024,
    accept: acceptMap[accept]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = files.findIndex((item) => item.id === active.id);
    const newIndex = files.findIndex((item) => item.id === over.id);
    onFilesChange(arrayMove(files, oldIndex, newIndex));
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-card p-8 text-center transition",
          isDragActive && "border-primary bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-9 w-9 text-primary" />
        <p className="mt-4 font-medium">Drop files here or click to browse</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {accept === "image" ? "PNG and JPG" : accept === "pdf" ? "PDF files" : "PDF, PNG, and JPG"} up to 25 MB each
        </p>
      </div>

      {files.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={files.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {files.map((item, index) => (
                <SortableFile
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={() => onFilesChange(files.filter((file) => file.id !== item.id))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/40 p-5 text-center text-sm text-muted-foreground">
          Your upload queue is empty.
        </div>
      )}
    </div>
  );
}

function SortableFile({
  item,
  index,
  onRemove
}: {
  item: QueuedFile;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 rounded-lg border bg-card p-3"
    >
      <button
        className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove file">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
