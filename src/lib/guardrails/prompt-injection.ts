export interface InjectionScanResult {
  detected: boolean;
  matchedPatterns: string[];
  sanitized: string;
}

const INJECTION_PATTERNS: { label: string; regex: RegExp }[] = [
  {
    label: "ignore-instructions",
    regex: /ignore\s+(all\s+)?(previous|prior|above|earlier|preceding)\s+(instructions|prompts|rules|directions|context)/i,
  },
  {
    label: "new-role-assignment",
    regex: /you\s+are\s+now\s+/i,
  },
  {
    label: "system-role-prefix",
    regex: /^\s*system\s*:/im,
  },
  {
    label: "assistant-role-prefix",
    regex: /^\s*assistant\s*:/im,
  },
  {
    label: "user-role-prefix",
    regex: /^\s*user\s*:/im,
  },
  {
    label: "xml-closing-resume",
    regex: /<\/resume\s*>/i,
  },
  {
    label: "xml-closing-job-description",
    regex: /<\/job_description\s*>/i,
  },
  {
    label: "xml-closing-candidate-answer",
    regex: /<\/candidate_answer\s*>/i,
  },
  {
    label: "xml-closing-interview-question",
    regex: /<\/interview_question\s*>/i,
  },
  {
    label: "xml-opening-system-tag",
    regex: /<system\s*>/i,
  },
  {
    label: "do-not-follow",
    regex: /do\s+not\s+follow\s+(the\s+)?(previous|above|system)/i,
  },
  {
    label: "disregard",
    regex: /disregard\s+(all\s+)?(previous|prior|above|earlier|system)/i,
  },
  {
    label: "override-instructions",
    regex: /override\s+(the\s+)?(system|instructions|rules|prompt)/i,
  },
  {
    label: "jailbreak-keyword",
    regex: /\b(DAN|jailbreak|bypass\s+filter)\b/i,
  },
  {
    label: "triple-backtick-code-block",
    regex: /```/,
  },
];

export function scanForInjection(input: string): InjectionScanResult {
  const matchedPatterns: string[] = [];

  for (const { label, regex } of INJECTION_PATTERNS) {
    if (regex.test(input)) {
      matchedPatterns.push(label);
    }
  }

  let sanitized = input;
  if (matchedPatterns.length > 0) {
    sanitized = sanitized.replace(
      /<\/?(?:resume|job_description|candidate_answer|interview_question|system)\s*>/gi,
      ""
    );
    sanitized = sanitized.replace(/```/g, "");
    sanitized = sanitized.replace(/^\s*(system|assistant|user)\s*:/gim, "$1 -");
  }

  return {
    detected: matchedPatterns.length > 0,
    matchedPatterns,
    sanitized,
  };
}

export function rejectIfInjection(input: string): {
  rejected: boolean;
  reason?: string;
} {
  const result = scanForInjection(input);
  if (result.detected) {
    return {
      rejected: true,
      reason: `Input contains disallowed patterns: ${result.matchedPatterns.join(", ")}`,
    };
  }
  return { rejected: false };
}
