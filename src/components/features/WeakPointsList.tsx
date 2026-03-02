"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/features/score-bar";
import type { WeakPoint } from "@/types";

interface WeakPointsListProps {
  weakPoints: WeakPoint[];
}

function WeakPointCard({ wp }: { wp: WeakPoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <AlertTriangle
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0",
              wp.gap_severity === "high"
                ? "text-[#ef4444]"
                : wp.gap_severity === "medium"
                  ? "text-[#f59e0b]"
                  : "text-[#3b82f6]"
            )}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{wp.skill}</span>
              <SeverityBadge severity={wp.gap_severity} />
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="pl-7 space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">JD Requires</p>
            <p className="text-foreground">{wp.jd_requirement}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Your Resume</p>
            <p className="text-foreground">{wp.resume_evidence}</p>
          </div>
          <div className="bg-[#2563eb]/5 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" />
              <p className="text-sm text-foreground">{wp.suggestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WeakPointsList({ weakPoints }: WeakPointsListProps) {
  if (weakPoints.length === 0) {
    return null;
  }

  const sorted = [...weakPoints].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.gap_severity] - order[b.gap_severity];
  });

  const highCount = weakPoints.filter((w) => w.gap_severity === "high").length;
  const mediumCount = weakPoints.filter((w) => w.gap_severity === "medium").length;
  const lowCount = weakPoints.filter((w) => w.gap_severity === "low").length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />
          <p className="text-lg font-semibold text-foreground">Gap Analysis</p>
          <span className="text-xs font-medium bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-0.5 rounded-full">
            {weakPoints.length} gaps found
          </span>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          {highCount > 0 && (
            <span className="text-[#ef4444]">{highCount} high</span>
          )}
          {mediumCount > 0 && (
            <span className="text-[#f59e0b]">{mediumCount} medium</span>
          )}
          {lowCount > 0 && (
            <span className="text-[#3b82f6]">{lowCount} low</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((wp, index) => (
          <WeakPointCard key={index} wp={wp} />
        ))}
      </div>
    </div>
  );
}
