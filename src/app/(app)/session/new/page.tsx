"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ResumeInput } from "@/components/features/ResumeInput";
import { JobDescriptionInput } from "@/components/features/JobDescriptionInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const steps = [
  { num: 1, label: "Resume", icon: FileText },
  { num: 2, label: "Job Description", icon: Briefcase },
  { num: 3, label: "Generate", icon: Sparkles },
];

export default function NewSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          New Practice Session
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Provide your resume and target job description to get started.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                step === s.num
                  ? "bg-[#2563eb] text-white"
                  : step > s.num
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.num}</span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px ${step > s.num ? "bg-[#10b981]" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      {apiError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {apiError}
        </p>
      )}

      {/* Step 1: Resume */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-semibold">
              <FileText className="w-5 h-5 text-[#2563eb]" />
              Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResumeInput
              value={resumeText}
              onChange={setResumeText}
              error={resumeError}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!resumeText}
                className="gap-2"
              >
                Next: Job Description
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-semibold">
              <Briefcase className="w-5 h-5 text-[#2563eb]" />
              Target Position
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              jobTitle={jobTitle}
              onJobTitleChange={setJobTitle}
              companyName={companyName}
              onCompanyNameChange={setCompanyName}
              error={jdError}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!jobDescription}
                className="gap-2"
              >
                Next: Generate
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Generate */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-5 h-5 text-[#2563eb]" />
              Ready to Generate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Resume</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {resumeText.split("\n")[0] || "Uploaded"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {resumeText.length.toLocaleString()} characters
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  Target Position
                </p>
                <p className="text-sm font-medium text-foreground">
                  {jobTitle || "Not specified"}{" "}
                  {companyName ? `at ${companyName}` : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {jobDescription.length.toLocaleString()} characters
                </p>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">
                The AI will analyze your resume against the job description to:
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {[
                  "Identify skill gaps",
                  "Generate 5 questions",
                  "Create mock interview",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#2563eb]/10 text-[#2563eb] px-3 py-1.5 rounded-full"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="border-white/30 border-t-white" />
                    Generating questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
