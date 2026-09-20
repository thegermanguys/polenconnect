"use client";

import * as React from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getCloudinarySignature } from "@/lib/cloudinary/sign";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  folder: string;
  multiple?: boolean;
  className?: string;
  /** Which server action to call for a signature. Defaults to the admin-gated one. */
  signAction?: (folder: string) => Promise<{ cloudName: string; apiKey: string; timestamp: number; signature: string }>;
}

async function uploadOne(
  file: File,
  folder: string,
  signAction: (folder: string) => Promise<{ cloudName: string; apiKey: string; timestamp: number; signature: string }>
): Promise<string> {
  const { cloudName, apiKey, timestamp, signature } = await signAction(folder);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Drop-in replacement for a plain "image URL" text field. Renders a hidden
 * input under `name` (so existing server actions reading formData.get(name)
 * need no changes) plus a file picker that uploads directly to Cloudinary.
 * With `multiple`, uploaded URLs are joined with commas — matching the
 * existing "Photo URLs (comma-separated)" field format.
 */
export function ImageUploadField({
  label,
  name,
  folder,
  multiple,
  className,
  signAction = getCloudinarySignature,
}: ImageUploadFieldProps) {
  const [urls, setUrls] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const fileArray = Array.from(files);
      const uploaded = await Promise.all(fileArray.map((file) => uploadOne(file, folder, signAction)));
      setUrls((prev) => (multiple ? [...prev, ...uploaded] : uploaded));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={`${name}-picker`}>{label}</Label>
      <input type="hidden" name={name} value={urls.join(",")} />

      {urls.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-border">
              <Image src={url} alt="" fill className="object-cover" sizes="64px" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        htmlFor={`${name}-picker`}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Uploading…" : multiple ? "Add photo(s)" : urls.length > 0 ? "Replace image" : "Upload image"}
        <input
          ref={inputRef}
          id={`${name}-picker`}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
