import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WeakPointsList } from "../WeakPointsList";
import type { WeakPoint } from "@/types";

const sampleWeakPoints: WeakPoint[] = [
  {
    skill: "Kubernetes",
    gap_severity: "high",
    jd_requirement: "5+ years experience with Kubernetes",
    resume_evidence: "No mention of container orchestration",
    suggestion: "Get CKA certified",
  },
  {
    skill: "Team Leadership",
    gap_severity: "medium",
    jd_requirement: "Lead a team of 5+ engineers",
    resume_evidence: "Mentored 2 junior developers",
    suggestion: "Highlight cross-team coordination",
  },
  {
    skill: "GraphQL",
    gap_severity: "low",
    jd_requirement: "GraphQL is a plus",
    resume_evidence: "No mention of GraphQL",
    suggestion: "Build a small GraphQL project",
  },
];

describe("WeakPointsList", () => {
  it("renders Weak Points Analysis heading", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("Weak Points Analysis");
  });

  it("renders all weak point skill names", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("Kubernetes");
    expect(container.textContent).toContain("Team Leadership");
    expect(container.textContent).toContain("GraphQL");
  });

  it("renders severity badges", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("High");
    expect(container.textContent).toContain("Medium");
    expect(container.textContent).toContain("Low");
  });

  it("renders JD requirements", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("5+ years experience with Kubernetes");
    expect(container.textContent).toContain("Lead a team of 5+ engineers");
  });

  it("renders resume evidence", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("No mention of container orchestration");
    expect(container.textContent).toContain("Mentored 2 junior developers");
  });

  it("renders coaching suggestions", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("Get CKA certified");
    expect(container.textContent).toContain("Highlight cross-team coordination");
    expect(container.textContent).toContain("Build a small GraphQL project");
  });

  it("sorts by severity: high first, low last", () => {
    const reversed: WeakPoint[] = [
      { ...sampleWeakPoints[2] }, // low
      { ...sampleWeakPoints[0] }, // high
      { ...sampleWeakPoints[1] }, // medium
    ];

    const { container } = render(<WeakPointsList weakPoints={reversed} />);

    const cards = container.querySelectorAll(".rounded-lg.border.p-3");
    expect(cards).toHaveLength(3);
    // First card should be Kubernetes (high)
    expect(cards[0].textContent).toContain("Kubernetes");
    // Last card should be GraphQL (low)
    expect(cards[2].textContent).toContain("GraphQL");
  });

  it("shows severity summary counts", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    expect(container.textContent).toContain("1 high");
    expect(container.textContent).toContain("1 medium");
    expect(container.textContent).toContain("1 low");
  });

  it("uses danger styling for high severity cards", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    const cards = container.querySelectorAll(".rounded-lg.border.p-3");
    // First sorted card is "high" severity (Kubernetes)
    expect(cards[0].className).toContain("border-danger/20");
  });

  it("uses warning styling for medium severity cards", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    const cards = container.querySelectorAll(".rounded-lg.border.p-3");
    // Second sorted card is "medium" severity (Team Leadership)
    expect(cards[1].className).toContain("border-warning/20");
  });

  it("uses info styling for low severity cards", () => {
    const { container } = render(<WeakPointsList weakPoints={sampleWeakPoints} />);

    const cards = container.querySelectorAll(".rounded-lg.border.p-3");
    // Third sorted card is "low" severity (GraphQL)
    expect(cards[2].className).toContain("border-info/20");
  });

  it("returns null for empty weak points", () => {
    const { container } = render(<WeakPointsList weakPoints={[]} />);

    expect(container.innerHTML).toBe("");
  });
});
