import { jsPDF } from "jspdf";

export interface PdfResultsData {
  jobTitle: string;
  companyName: string | null;
  overallScore: number;
  avgClarity: number;
  avgStructure: number;
  avgDepth: number;
  answeredCount: number;
  totalQuestions: number;
  weakPoints: Array<{
    skill: string;
    severity: "high" | "medium" | "low";
    suggestion: string;
  }>;
  questions: Array<{
    number: number;
    questionText: string;
    questionType: string;
    difficulty: string;
    targetSkill: string;
    answerText: string | null;
    evaluation: {
      overallScore: number;
      clarityScore: number;
      structureScore: number;
      depthScore: number;
      feedback: string;
      starDetected: boolean;
      starBreakdown: {
        situation: { present: boolean; score: number };
        task: { present: boolean; score: number };
        action: { present: boolean; score: number };
        result: { present: boolean; score: number };
      } | null;
    } | null;
  }>;
}

const COLORS = {
  green: [16, 185, 129] as const,
  amber: [245, 158, 11] as const,
  red: [239, 68, 68] as const,
  blue: [37, 99, 235] as const,
  gray: [107, 114, 128] as const,
  lightGray: [229, 231, 235] as const,
  dark: [30, 30, 30] as const,
  muted: [100, 100, 100] as const,
};

function getScoreColor(score: number): readonly [number, number, number] {
  if (score >= 7) return COLORS.green;
  if (score >= 4) return COLORS.amber;
  return COLORS.red;
}

function getSeverityColor(
  severity: "high" | "medium" | "low"
): readonly [number, number, number] {
  if (severity === "high") return COLORS.red;
  if (severity === "medium") return COLORS.amber;
  return COLORS.green;
}

export function generateResultsPdf(data: PdfResultsData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > 277) {
      doc.addPage();
      y = margin;
    }
  }

  function drawScoreBar(
    x: number,
    yPos: number,
    label: string,
    value: number,
    weight: string
  ) {
    const barWidth = 90;
    const barHeight = 5;

    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, yPos);

    doc.setTextColor(...COLORS.gray);
    doc.text(weight, x + 30, yPos);

    // Background bar
    const barX = x + 42;
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(barX, yPos - 3.5, barWidth, barHeight, 1, 1, "F");

    // Filled bar
    const fillWidth = (value / 10) * barWidth;
    const color = getScoreColor(value);
    doc.setFillColor(...color);
    doc.roundedRect(barX, yPos - 3.5, fillWidth, barHeight, 1, 1, "F");

    // Score text
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.dark);
    doc.setFont("helvetica", "bold");
    doc.text(`${value}/10`, barX + barWidth + 4, yPos);
  }

  // ─── HEADER ───
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.setFont("helvetica", "normal");
  doc.text("INTERVIEW PREP COACH", margin, y);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin, y, {
    align: "right",
  });
  y += 4;

  // Divider
  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ─── TITLE ───
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.dark);
  doc.setFont("helvetica", "bold");
  doc.text("Session Results", margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  const subtitle =
    data.jobTitle + (data.companyName ? ` - ${data.companyName}` : "");
  doc.text(subtitle, margin, y);
  y += 14;

  // ─── OVERALL SCORE SECTION ───
  // Score circle
  const circleX = margin + 18;
  const circleY = y + 8;
  const circleRadius = 14;
  const scoreColor = getScoreColor(data.overallScore);

  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(1.5);
  doc.circle(circleX, circleY, circleRadius);

  doc.setFontSize(18);
  doc.setTextColor(...scoreColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.overallScore.toFixed(1), circleX, circleY - 1, {
    align: "center",
  });
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text("/ 10", circleX, circleY + 5, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("Overall Score", circleX, circleY + circleRadius + 5, {
    align: "center",
  });

  // Score bars next to circle
  const barsX = margin + 42;
  drawScoreBar(barsX, y + 2, "Clarity", data.avgClarity, "25%");
  drawScoreBar(barsX, y + 10, "Structure", data.avgStructure, "30%");
  drawScoreBar(barsX, y + 18, "Depth", data.avgDepth, "45%");

  y += 32;

  // Answered count
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.answeredCount} of ${data.totalQuestions} questions answered`,
    margin,
    y
  );
  y += 10;

  // ─── WEAK POINTS / GAPS ───
  if (data.weakPoints.length > 0) {
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(13);
    doc.setTextColor(...COLORS.dark);
    doc.setFont("helvetica", "bold");
    doc.text("Identified Gaps", margin, y);
    y += 8;

    for (const wp of data.weakPoints) {
      checkPageBreak(20);

      const sevColor = getSeverityColor(wp.severity);

      // Skill name + severity
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.dark);
      doc.text(wp.skill, margin + 2, y);

      const skillWidth = doc.getTextWidth(wp.skill);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...sevColor);
      doc.text(
        ` (${wp.severity.charAt(0).toUpperCase() + wp.severity.slice(1)})`,
        margin + 2 + skillWidth + 1,
        y
      );

      y += 5;

      // Suggestion
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.setFont("helvetica", "normal");
      const suggestionLines = doc.splitTextToSize(wp.suggestion, contentWidth - 4);
      doc.text(suggestionLines, margin + 4, y);
      y += suggestionLines.length * 3.5 + 5;
    }
  }

  // ─── QUESTION BREAKDOWN ───
  doc.addPage();
  y = margin;

  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.setFont("helvetica", "bold");
  doc.text("Question-by-Question Breakdown", margin, y);
  y += 10;

  for (const q of data.questions) {
    // Estimate height needed for this question
    const estimatedHeight = q.evaluation ? 70 : 20;
    checkPageBreak(estimatedHeight);

    // Question header
    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Q number + type + difficulty
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(`Q${q.number}`, margin, y);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.blue);
    const typeText = `[${q.questionType}]`;
    doc.text(typeText, margin + 10, y);

    doc.setTextColor(...COLORS.gray);
    const diffText = `[${q.difficulty}]`;
    doc.text(diffText, margin + 10 + doc.getTextWidth(typeText) + 3, y);

    if (q.targetSkill) {
      doc.setTextColor(...COLORS.muted);
      doc.text(
        `Target: ${q.targetSkill}`,
        margin +
          10 +
          doc.getTextWidth(typeText) +
          3 +
          doc.getTextWidth(diffText) +
          3,
        y
      );
    }
    y += 6;

    // Question text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    const questionLines = doc.splitTextToSize(q.questionText, contentWidth);
    doc.text(questionLines, margin, y);
    y += questionLines.length * 4 + 3;

    if (!q.answerText || !q.evaluation) {
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.setFont("helvetica", "italic");
      doc.text("Unanswered", margin, y);
      y += 8;
      continue;
    }

    const ev = q.evaluation;

    // Score summary line
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const evScoreColor = getScoreColor(ev.overallScore);
    doc.setTextColor(...evScoreColor);
    doc.text(`Score: ${ev.overallScore}/10`, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(8);
    doc.text(
      `Clarity: ${ev.clarityScore}  |  Structure: ${ev.structureScore}  |  Depth: ${ev.depthScore}`,
      margin + 30,
      y
    );
    y += 7;

    // STAR breakdown (if applicable)
    if (ev.starDetected && ev.starBreakdown) {
      checkPageBreak(15);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.dark);
      doc.text("STAR Breakdown:", margin, y);
      y += 4;

      const starKeys = ["situation", "task", "action", "result"] as const;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      for (const key of starKeys) {
        const item = ev.starBreakdown[key];
        const marker = item.present ? "[x]" : "[ ]";
        const [mr, mg, mb] = item.present ? COLORS.green : COLORS.red;
        doc.setTextColor(mr, mg, mb);
        doc.text(marker, margin + 2, y);
        doc.setTextColor(...COLORS.dark);
        doc.text(
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${item.score}/10`,
          margin + 12,
          y
        );
        y += 4;
      }
      y += 2;
    }

    // Answer
    checkPageBreak(15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text("Your Answer:", margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    const answerLines = doc.splitTextToSize(q.answerText, contentWidth - 4);
    // Handle very long answers with page breaks
    for (let i = 0; i < answerLines.length; i++) {
      checkPageBreak(5);
      doc.text(answerLines[i], margin + 2, y);
      y += 3.5;
    }
    y += 3;

    // Feedback
    checkPageBreak(15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text("AI Feedback:", margin, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    const feedbackLines = doc.splitTextToSize(ev.feedback, contentWidth - 4);
    for (let i = 0; i < feedbackLines.length; i++) {
      checkPageBreak(5);
      doc.text(feedbackLines[i], margin + 2, y);
      y += 3.5;
    }
    y += 8;
  }

  return doc;
}
