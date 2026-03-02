"use client";

import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function ResumeInput({ value, onChange, error }: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset so the same file can be re-selected
    e.target.value = "";

    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File must be under 5 MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Failed to parse PDF.");
        return;
      }

      onChange(data.text);

      if (data.truncated) {
        setUploadError(
          `Resume was truncated from ${data.originalLength.toLocaleString()} to 15,000 characters.`
        );
      }
    } catch {
      setUploadError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-1 flex items-center justify-between">
        <label
          htmlFor="resume"
          className="text-sm font-medium text-foreground"
        >
          Resume
        </label>
        <Button
          type="button"
          variant="secondary"
          className="h-8 gap-1.5 px-3 text-xs"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Spinner size="sm" />
              Parsing...
            </>
          ) : (
            "Upload PDF"
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload PDF resume"
        />
      </div>

      {uploadError && (
        <p className="mb-1 text-sm text-danger">{uploadError}</p>
      )}

      <Textarea
        id="resume"
        placeholder="Paste your resume text here or upload a PDF..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        rows={16}
        className="flex-1 resize-none"
      />
      <p className="mt-1 text-right text-xs text-muted">
        {value.length.toLocaleString()} / 15,000 characters
      </p>
    </div>
  );
}
