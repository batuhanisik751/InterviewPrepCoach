import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children text", () => {
    const { container } = render(<Button>Click me</Button>);

    expect(container.textContent).toBe("Click me");
  });

  it("renders as a button element", () => {
    const { container } = render(<Button>test</Button>);

    expect(container.firstElementChild!.tagName).toBe("BUTTON");
  });

  it("applies primary variant by default", () => {
    const { container } = render(<Button>test</Button>);
    const btn = container.firstElementChild!;

    expect(btn.className).toContain("bg-brand-600");
    expect(btn.className).toContain("text-white");
  });

  it("applies secondary variant styling", () => {
    const { container } = render(<Button variant="secondary">test</Button>);
    const btn = container.firstElementChild!;

    expect(btn.className).toContain("border-border");
    expect(btn.className).toContain("bg-surface");
  });

  it("applies ghost variant styling", () => {
    const { container } = render(<Button variant="ghost">test</Button>);
    const btn = container.firstElementChild!;

    expect(btn.className).toContain("hover:bg-surface-secondary");
    expect(btn.className).not.toContain("bg-brand-600");
  });

  it("applies destructive variant styling", () => {
    const { container } = render(<Button variant="destructive">test</Button>);
    const btn = container.firstElementChild!;

    expect(btn.className).toContain("bg-danger");
    expect(btn.className).toContain("text-white");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(container.firstElementChild!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    const { container } = render(<Button disabled>test</Button>);
    const btn = container.firstElementChild as HTMLButtonElement;

    expect(btn.disabled).toBe(true);
  });

  it("merges custom className", () => {
    const { container } = render(<Button className="my-class">test</Button>);
    const btn = container.firstElementChild!;

    expect(btn.className).toContain("my-class");
    expect(btn.className).toContain("rounded-lg");
  });
});
