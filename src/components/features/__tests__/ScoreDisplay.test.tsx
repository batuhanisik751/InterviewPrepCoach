import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScoreDisplay } from "../ScoreDisplay";

describe("ScoreDisplay", () => {
  it("renders all three score labels", () => {
    const { container } = render(
      <ScoreDisplay clarity={7} structure={8} depth={6} overall={7.1} />
    );

    expect(container.textContent).toContain("Clarity (25%)");
    expect(container.textContent).toContain("Structure (30%)");
    expect(container.textContent).toContain("Depth (45%)");
  });

  it("renders the overall score and heading", () => {
    const { container } = render(
      <ScoreDisplay clarity={7} structure={8} depth={6} overall={7.1} />
    );

    expect(container.textContent).toContain("Score Breakdown");
    expect(container.textContent).toContain("7.1");
    expect(container.textContent).toContain("/ 10");
  });

  it("renders correct progress bar widths for each score", () => {
    const { container } = render(
      <ScoreDisplay clarity={7} structure={8} depth={6} overall={7.1} />
    );

    const fills = container.querySelectorAll(".h-full");
    expect(fills.length).toBeGreaterThanOrEqual(3);
    expect(fills[0]).toHaveStyle({ width: "70%" }); // clarity 7/10
    expect(fills[1]).toHaveStyle({ width: "80%" }); // structure 8/10
    expect(fills[2]).toHaveStyle({ width: "60%" }); // depth 6/10
  });
});
