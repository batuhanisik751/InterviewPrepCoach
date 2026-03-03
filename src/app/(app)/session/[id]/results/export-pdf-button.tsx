"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PdfResultsData } from "@/lib/pdf/generate-results-pdf";

interface ExportPdfButtonProps {
  data: PdfResultsData;
}

export function ExportPdfButton({ data }: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const { generateResultsPdf } = await import(
        "@/lib/pdf/generate-results-pdf"
      );
      const doc = generateResultsPdf(data);
      const slug = data.jobTitle
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      doc.save(`interview-results-${slug || "session"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {loading ? "Generating..." : "Export PDF"}
    </Button>
  );
}
