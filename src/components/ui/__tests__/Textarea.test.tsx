import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector("textarea");

    expect(textarea).not.toBeNull();
  });

  it("renders label when provided", () => {
    const { container } = render(<Textarea label="Description" id="desc" />);

    expect(container.textContent).toContain("Description");
    const label = container.querySelector("label");
    expect(label!.htmlFor).toBe("desc");
  });

  it("does not render label when not provided", () => {
    const { container } = render(<Textarea />);

    expect(container.querySelector("label")).toBeNull();
  });

  it("renders error message when provided", () => {
    const { container } = render(<Textarea error="Too short" />);

    expect(container.textContent).toContain("Too short");
  });

  it("applies error styling when error exists", () => {
    const { container } = render(<Textarea error="Error" />);
    const textarea = container.querySelector("textarea")!;

    expect(textarea.className).toContain("border-danger");
  });

  it("passes placeholder to textarea", () => {
    const { container } = render(<Textarea placeholder="Write here..." />);
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    expect(textarea.placeholder).toBe("Write here...");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea onChange={handleChange} />);
    const textarea = container.querySelector("textarea")!;

    fireEvent.change(textarea, { target: { value: "test content" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
