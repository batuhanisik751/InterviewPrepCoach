import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StarBreakdown } from "../StarBreakdown";

const allPresent = {
  situation: { present: true, text: "At my previous company, we faced scaling issues.", score: 8 },
  task: { present: true, text: "I was tasked with redesigning the API.", score: 7 },
  action: { present: true, text: "I implemented a microservices architecture.", score: 9 },
  result: { present: true, text: "This reduced latency by 40%.", score: 8 },
  missing_components: [] as string[],
  improvement_tips: ["Consider adding team size context"],
};

const someMissing = {
  situation: { present: true, text: "At my previous role...", score: 6 },
  task: { present: false, text: "", score: 0 },
  action: { present: true, text: "I built a new feature.", score: 5 },
  result: { present: false, text: "", score: 0 },
  missing_components: ["Task", "Result"],
  improvement_tips: ["Describe your specific responsibility", "Include measurable outcomes"],
};

describe("StarBreakdown", () => {
  it("renders all four STAR labels", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    expect(container.textContent).toContain("Situation");
    expect(container.textContent).toContain("Task");
    expect(container.textContent).toContain("Action");
    expect(container.textContent).toContain("Result");
  });

  it("renders STAR Format Analysis heading", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    expect(container.textContent).toContain("STAR Format Analysis");
  });

  it("shows scores for present components", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    expect(container.textContent).toContain("8/10");
    expect(container.textContent).toContain("7/10");
    expect(container.textContent).toContain("9/10");
  });

  it("shows Missing label for absent components", () => {
    const { container } = render(<StarBreakdown {...someMissing} />);

    // Task and Result should show "Missing"
    const missingCount = (container.textContent?.match(/Missing/g) || []).length;
    // "Missing" appears in the component badges + the "Missing: Task, Result" section
    expect(missingCount).toBeGreaterThanOrEqual(2);
  });

  it("shows missing components warning", () => {
    const { container } = render(<StarBreakdown {...someMissing} />);

    expect(container.textContent).toContain("Missing: Task, Result");
  });

  it("shows improvement tips", () => {
    const { container } = render(<StarBreakdown {...someMissing} />);

    expect(container.textContent).toContain("Describe your specific responsibility");
    expect(container.textContent).toContain("Include measurable outcomes");
  });

  it("renders S, T, A, R letters in circles", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    const circles = container.querySelectorAll(".rounded-full.h-8");
    expect(circles).toHaveLength(4);
    expect(circles[0].textContent).toBe("S");
    expect(circles[1].textContent).toBe("T");
    expect(circles[2].textContent).toBe("A");
    expect(circles[3].textContent).toBe("R");
  });

  it("uses success styling for present components", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    const circles = container.querySelectorAll(".rounded-full.h-8");
    circles.forEach((circle) => {
      expect(circle.className).toContain("text-success");
    });
  });

  it("uses danger styling for missing components", () => {
    const { container } = render(<StarBreakdown {...someMissing} />);

    const circles = container.querySelectorAll(".rounded-full.h-8");
    // Task (index 1) and Result (index 3) should be danger
    expect(circles[1].className).toContain("text-danger");
    expect(circles[3].className).toContain("text-danger");
  });

  it("does not render missing warning when no components are missing", () => {
    const { container } = render(<StarBreakdown {...allPresent} />);

    expect(container.textContent).not.toContain("Missing:");
  });
});
