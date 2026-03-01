"use client";

import { Textarea } from "@/components/ui/Textarea";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ResumeInput({ value, onChange, error }: ResumeInputProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Textarea
        id="resume"
        label="Resume"
        placeholder="Paste your resume text here..."
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
