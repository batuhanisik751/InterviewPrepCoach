"use client";

import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title (optional)</Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Frontend Engineer"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company (optional)</Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Inc."
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="jobDescription">Job Description</Label>
          <span className="text-xs text-muted-foreground">
            {value.length.toLocaleString()} / 10,000
          </span>
        </div>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="min-h-[200px] flex-1 resize-none"
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
