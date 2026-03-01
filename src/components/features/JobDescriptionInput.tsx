"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  companyName: string;
  onCompanyNameChange: (value: string) => void;
  error?: string;
}

export function JobDescriptionInput({
  value,
  onChange,
  jobTitle,
  onJobTitleChange,
  companyName,
  onCompanyNameChange,
  error,
}: JobDescriptionInputProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="jobTitle"
          label="Job Title (optional)"
          placeholder="e.g. Senior Frontend Engineer"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
        />
        <Input
          id="companyName"
          label="Company (optional)"
          placeholder="e.g. Acme Inc."
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>
      <Textarea
        id="jobDescription"
        label="Job Description"
        placeholder="Paste the full job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        rows={12}
        className="flex-1 resize-none"
      />
      <p className="-mt-3 text-right text-xs text-muted">
        {value.length.toLocaleString()} / 10,000 characters
      </p>
    </div>
  );
}
