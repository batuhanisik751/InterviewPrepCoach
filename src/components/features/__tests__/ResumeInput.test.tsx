import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ResumeInput } from "../ResumeInput";

describe("ResumeInput", () => {
  it("renders a textarea with resume placeholder", () => {
    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    expect(textarea).not.toBeNull();
    expect(textarea.placeholder).toContain("resume");
  });

  it("renders the Resume label", () => {
    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );

    expect(container.textContent).toContain("Resume");
  });

  it("shows character count", () => {
    const { container } = render(
      <ResumeInput value="Hello world" onChange={vi.fn()} />
    );

    expect(container.textContent).toContain("11");
    expect(container.textContent).toContain("15,000");
  });

  it("calls onChange when text is entered", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <ResumeInput value="" onChange={handleChange} />
    );
    const textarea = container.querySelector("textarea")!;

    fireEvent.change(textarea, { target: { value: "My resume..." } });
    expect(handleChange).toHaveBeenCalledWith("My resume...");
  });

  it("displays the provided value", () => {
    const { container } = render(
      <ResumeInput value="Existing resume text" onChange={vi.fn()} />
    );
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;

    expect(textarea.value).toBe("Existing resume text");
  });

  it("shows error message when provided", () => {
    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} error="Resume is too short" />
    );

    expect(container.textContent).toContain("Resume is too short");
  });
});
