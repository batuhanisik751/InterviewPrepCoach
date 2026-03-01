import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children text", () => {
    const { container } = render(<Badge>behavioral</Badge>);

    expect(container.textContent).toBe("behavioral");
  });

  it("uses default variant styling when no variant is specified", () => {
    const { container } = render(<Badge>test</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("bg-surface-tertiary");
    expect(badge.className).toContain("text-foreground");
  });

  it("applies success variant styling", () => {
    const { container } = render(<Badge variant="success">easy</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("text-success");
  });

  it("applies warning variant styling", () => {
    const { container } = render(<Badge variant="warning">medium</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("text-warning");
  });

  it("applies danger variant styling", () => {
    const { container } = render(<Badge variant="danger">hard</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("text-danger");
  });

  it("applies info variant styling", () => {
    const { container } = render(<Badge variant="info">info</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("text-brand-700");
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>test</Badge>);

    expect(container.firstElementChild!.tagName).toBe("SPAN");
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="custom-class">test</Badge>);
    const badge = container.firstElementChild!;

    expect(badge.className).toContain("custom-class");
    expect(badge.className).toContain("rounded-full");
  });
});
