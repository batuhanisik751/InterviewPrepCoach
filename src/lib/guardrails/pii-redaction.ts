export interface PIIRedactionResult {
  redactedText: string;
  redactionCounts: Record<string, number>;
  piiDetected: boolean;
}

const PII_PATTERNS: { type: string; placeholder: string; regex: RegExp }[] = [
  {
    type: "SSN",
    placeholder: "[SSN]",
    regex: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
  },
  {
    type: "PHONE",
    placeholder: "[PHONE]",
    regex: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  },
  {
    type: "EMAIL",
    placeholder: "[EMAIL]",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  },
  {
    type: "DOB",
    placeholder: "[DOB]",
    regex:
      /(?:(?:date\s+of\s+birth|DOB|born(?:\s+on)?|birthday)\s*[:\-]?\s*)(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+\w+\s+\d{4})/gi,
  },
  {
    type: "ADDRESS",
    placeholder: "[ADDRESS]",
    regex:
      /\b\d{1,6}\s+(?:[A-Z][a-zA-Z]*\s+){1,3}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|Court|Ct|Place|Pl|Way|Circle|Cir|Terrace|Ter|Trail|Trl|Pike|Highway|Hwy)\.?(?:\s*,?\s*(?:Apt|Suite|Ste|Unit|#)\s*[A-Za-z0-9-]+)?/gi,
  },
];

export function redactPII(text: string): PIIRedactionResult {
  let redactedText = text;
  const redactionCounts: Record<string, number> = {};
  let totalRedactions = 0;

  for (const { type, placeholder, regex } of PII_PATTERNS) {
    regex.lastIndex = 0;

    let count = 0;
    redactedText = redactedText.replace(regex, (match) => {
      if (type === "DOB") {
        const dateMatch = match.match(
          /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+\w+\s+\d{4})$/i
        );
        if (dateMatch) {
          count++;
          return match.replace(dateMatch[1], placeholder);
        }
      }
      count++;
      return placeholder;
    });

    if (count > 0) {
      redactionCounts[type] = count;
      totalRedactions += count;
    }
  }

  return {
    redactedText,
    redactionCounts,
    piiDetected: totalRedactions > 0,
  };
}
