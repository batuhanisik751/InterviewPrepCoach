export interface ModerationResult {
  flagged: boolean;
  categories: string[];
  severity: "block" | "warn" | "none";
}

const ALLOWLIST_PHRASES: string[] = [
  "offensive coordinator",
  "offensive line",
  "offensive strategy",
  "penetration testing",
  "penetration tester",
  "pen testing",
  "pen tester",
  "exploitation framework",
  "exploit development",
  "vulnerability exploitation",
  "threat modeling",
  "threat assessment",
  "threat intelligence",
  "threat detection",
  "attack surface",
  "attack vector",
  "kill chain",
  "red team",
  "blue team",
  "war room",
  "war game",
  "master branch",
  "master slave",
  "master node",
  "slave node",
  "suicide prevention",
  "drug testing",
  "drug screening",
  "sexual harassment training",
  "sexual harassment policy",
  "adult education",
  "adult learning",
  "dead letter queue",
  "deadlock",
  "race condition",
];

const TOXICITY_PATTERNS: {
  category: string;
  severity: "block" | "warn";
  patterns: RegExp[];
}[] = [
  {
    category: "hate-speech",
    severity: "block",
    patterns: [
      /\b(?:n[i1]gg[ae3]r|f[a@]gg[o0]t|k[i1]ke|sp[i1]c|ch[i1]nk|w[e3]tb[a@]ck|tr[a@]nny)\b/i,
      /\b(?:white\s+(?:power|supremac)|heil\s+hitler|sieg\s+heil|14\s*88)\b/i,
    ],
  },
  {
    category: "threats",
    severity: "block",
    patterns: [
      /\b(?:i\s+will\s+kill|i'?m\s+going\s+to\s+kill|going\s+to\s+murder|i\s+will\s+hurt)\b/i,
      /\b(?:bomb\s+threat|shoot\s+up|blow\s+up\s+(?:the|your|a))\b/i,
    ],
  },
  {
    category: "sexual-content",
    severity: "block",
    patterns: [
      /\b(?:p[o0]rn(?:ography)?|h[e3]nt[a@]i|xxx|n[u\/]d[e3]s?\b(?!\s+(?:color|palette|lipstick)))/i,
    ],
  },
  {
    category: "profanity",
    severity: "warn",
    patterns: [
      /\b(?:f+u+c+k+|sh[i1]+t+|b[i1]tch|a+ss+h+[o0]+le|d[i1]ck(?:head)?|c[u\/]nt)/i,
    ],
  },
];

function isAllowlisted(
  input: string,
  matchStart: number,
  matchEnd: number
): boolean {
  const lowerInput = input.toLowerCase();
  for (const phrase of ALLOWLIST_PHRASES) {
    let searchFrom = 0;
    while (true) {
      const idx = lowerInput.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      const phraseEnd = idx + phrase.length;
      if (matchStart >= idx && matchEnd <= phraseEnd) {
        return true;
      }
      searchFrom = idx + 1;
    }
  }
  return false;
}

export function moderateContent(text: string): ModerationResult {
  const flaggedCategories: string[] = [];
  let highestSeverity: "block" | "warn" | "none" = "none";

  for (const { category, severity, patterns } of TOXICITY_PATTERNS) {
    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        if (isAllowlisted(text, matchStart, matchEnd)) {
          continue;
        }

        if (!flaggedCategories.includes(category)) {
          flaggedCategories.push(category);
        }

        if (severity === "block") {
          highestSeverity = "block";
        } else if (severity === "warn" && highestSeverity !== "block") {
          highestSeverity = "warn";
        }
      }
    }
  }

  return {
    flagged: flaggedCategories.length > 0,
    categories: flaggedCategories,
    severity: highestSeverity,
  };
}
