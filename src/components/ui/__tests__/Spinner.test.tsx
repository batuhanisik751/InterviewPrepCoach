import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../Spinner";

describe("Spinner", () => {
  it("renders with role status", () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector("[role='status']");

    expect(spinner).not.toBeNull();
  });

  it("has Loading aria-label", () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector("[aria-label='Loading']");

    expect(spinner).not.toBeNull();
  });

  it("uses md size by default", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstElementChild!;

    expect(spinner.className).toContain("h-6");
    expect(spinner.className).toContain("w-6");
  });

  it("applies sm size", () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.firstElementChild!;

    expect(spinner.className).toContain("h-4");
    expect(spinner.className).toContain("w-4");
  });

  it("applies lg size", () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.firstElementChild!;

    expect(spinner.className).toContain("h-8");
    expect(spinner.className).toContain("w-8");
  });

  it("has animate-spin class", () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstElementChild!;

    expect(spinner.className).toContain("animate-spin");
  });

  it("merges custom className", () => {
    const { container } = render(<Spinner className="mt-4" />);
    const spinner = container.firstElementChild!;

    expect(spinner.className).toContain("mt-4");
    expect(spinner.className).toContain("animate-spin");
  });
});
