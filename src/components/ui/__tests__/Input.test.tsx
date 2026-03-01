import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input", () => {
  it("renders an input element", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");

    expect(input).not.toBeNull();
  });

  it("renders label when provided", () => {
    const { container } = render(<Input label="Email" id="email" />);

    expect(container.textContent).toContain("Email");
    const label = container.querySelector("label");
    expect(label!.htmlFor).toBe("email");
  });

  it("does not render label when not provided", () => {
    const { container } = render(<Input />);

    expect(container.querySelector("label")).toBeNull();
  });

  it("renders error message when provided", () => {
    const { container } = render(<Input error="Required field" />);

    expect(container.textContent).toContain("Required field");
  });

  it("applies error styling to input when error exists", () => {
    const { container } = render(<Input error="Error" />);
    const input = container.querySelector("input")!;

    expect(input.className).toContain("border-danger");
  });

  it("does not render error message when not provided", () => {
    const { container } = render(<Input />);
    const paragraphs = container.querySelectorAll("p");

    expect(paragraphs).toHaveLength(0);
  });

  it("passes placeholder to input", () => {
    const { container } = render(<Input placeholder="Type here..." />);
    const input = container.querySelector("input") as HTMLInputElement;

    expect(input.placeholder).toBe("Type here...");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    const { container } = render(<Input onChange={handleChange} />);
    const input = container.querySelector("input")!;

    fireEvent.change(input, { target: { value: "hello" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
