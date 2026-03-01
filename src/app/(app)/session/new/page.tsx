"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeInput } from "@/components/features/ResumeInput";
import { JobDescriptionInput } from "@/components/features/JobDescriptionInput";
import { Button } from "@/components/ui/Button";

export default function NewSessionPage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [resumeError, setResumeError] = useState<string>();
  const [jdError, setJdError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    let valid = true;
    setResumeError(undefined);
    setJdError(undefined);

    if (resumeText.length < 50) {
      setResumeError("Resume must be at least 50 characters");
      valid = false;
    } else if (resumeText.length > 15000) {
      setResumeError("Resume must be under 15,000 characters");
      valid = false;
    }

    if (jobDescription.length < 50) {
      setJdError("Job description must be at least 50 characters");
      valid = false;
    } else if (jobDescription.length > 10000) {
      setJdError("Job description must be under 10,000 characters");
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle || undefined,
          companyName: companyName || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/session/${data.sessionId}`);
    } catch {
      setApiError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New Session</h1>
        <p className="mt-1 text-muted">
          Paste your resume and the job description to get started.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResumeInput
          value={resumeText}
          onChange={setResumeText}
          error={resumeError}
        />
        <JobDescriptionInput
          value={jobDescription}
          onChange={setJobDescription}
          jobTitle={jobTitle}
          onJobTitleChange={setJobTitle}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          error={jdError}
        />
      </div>

      {apiError && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {apiError}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating session..." : "Generate Questions"}
        </Button>
      </div>
    </div>
  );
}
