"use client";

import { useRef, useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

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
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function processFile(file: File) {
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
      setUploaded(true);

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset so the same file can be re-selected
    e.target.value = "";

    await processFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {/* Drag-and-drop upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          uploaded
            ? "border-[#10b981] bg-[#10b981]/5"
            : dragOver
              ? "border-[#2563eb] bg-[#2563eb]/5"
              : "border-border hover:border-[#2563eb]/50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm font-medium text-muted-foreground">Parsing resume...</p>
          </div>
        ) : uploaded ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-8 w-8 text-[#10b981]" />
            <p className="text-sm font-medium text-[#10b981]">Resume parsed successfully</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb]/10">
              <Upload className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Upload your resume (PDF)</p>
              <p className="mt-1 text-xs text-muted-foreground">or paste it below</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}>
              <FileText className="h-4 w-4" />
              Choose File
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload PDF resume"
      />

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume">Resume Text</Label>
          <span className="text-xs text-muted-foreground">
            {value.length.toLocaleString()} / 15,000
          </span>
        </div>
        <Textarea
          id="resume"
          placeholder="Paste your resume content here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="min-h-[200px] resize-none"
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
