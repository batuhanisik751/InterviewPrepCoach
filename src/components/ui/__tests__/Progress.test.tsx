import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../Progress";

describe("Progress", () => {
  it("renders label and value", () => {
    render(<Progress value={7} label="Clarity" />);

    expect(screen.getByText("Clarity")).toBeInTheDocument();
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });

  it("uses custom max value", () => {
    render(<Progress value={50} max={100} label="Score" />);

    expect(screen.getByText("50/100")).toBeInTheDocument();
  });

  it("renders without label", () => {
    const { container } = render(<Progress value={5} />);
    // Should still render the progress bar
    expect(container.querySelector(".h-2")).toBeInTheDocument();
  });

  it("clamps percentage to 0-100", () => {
    const { container } = render(<Progress value={15} max={10} />);
    const bar = container.querySelector(".h-full");
    expect(bar).toHaveStyle({ width: "100%" });
  });
});
