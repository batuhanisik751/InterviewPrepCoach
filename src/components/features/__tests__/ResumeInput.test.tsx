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

describe("ResumeInput - PDF Upload", () => {
  it("renders an upload zone", () => {
    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );
    expect(container.textContent).toContain("Upload your resume");
  });

  it("renders a hidden file input with PDF accept attribute", () => {
    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    expect(fileInput).not.toBeNull();
    expect(fileInput.accept).toContain("application/pdf");
    expect(fileInput.className).toContain("hidden");
  });

  it("shows error for non-PDF files", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <ResumeInput value="" onChange={handleChange} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const txtFile = new File(["hello"], "resume.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [txtFile] } });

    expect(container.textContent).toContain("PDF");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("shows error for files exceeding 5 MB", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <ResumeInput value="" onChange={handleChange} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(container.textContent).toContain("5 MB");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("calls onChange with extracted text after successful upload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          text: "Extracted resume text",
          truncated: false,
          originalLength: 21,
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const handleChange = vi.fn();
    const { container } = render(
      <ResumeInput value="" onChange={handleChange} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const pdfFile = new File(["pdf-content"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await vi.waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Extracted resume text");
    });

    vi.unstubAllGlobals();
  });

  it("shows server error message on failed upload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({ error: "Could not extract text from this PDF." }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const pdfFile = new File(["bad-pdf"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await vi.waitFor(() => {
      expect(container.textContent).toContain("Could not extract text");
    });

    vi.unstubAllGlobals();
  });

  it("shows truncation warning when text is truncated", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          text: "A".repeat(15_000),
          truncated: true,
          originalLength: 20_000,
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { container } = render(
      <ResumeInput value="" onChange={vi.fn()} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const pdfFile = new File(["pdf-content"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await vi.waitFor(() => {
      expect(container.textContent).toContain("truncated");
    });

    vi.unstubAllGlobals();
  });
});
