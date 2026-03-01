import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { JobDescriptionInput } from "../JobDescriptionInput";

const defaultProps = {
  value: "",
  onChange: vi.fn(),
  jobTitle: "",
  onJobTitleChange: vi.fn(),
  companyName: "",
  onCompanyNameChange: vi.fn(),
};

describe("JobDescriptionInput", () => {
  it("renders job title input", () => {
    const { container } = render(<JobDescriptionInput {...defaultProps} />);

    expect(container.textContent).toContain("Job Title");
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders company name input", () => {
    const { container } = render(<JobDescriptionInput {...defaultProps} />);

    expect(container.textContent).toContain("Company");
  });

  it("renders job description textarea", () => {
    const { container } = render(<JobDescriptionInput {...defaultProps} />);
    const textarea = container.querySelector("textarea");

    expect(textarea).not.toBeNull();
    expect(container.textContent).toContain("Job Description");
  });

  it("shows character count for job description", () => {
    const { container } = render(
      <JobDescriptionInput {...defaultProps} value="Some JD text" />
    );

    expect(container.textContent).toContain("12");
    expect(container.textContent).toContain("10,000");
  });

  it("calls onChange when JD text changes", () => {
    const handleChange = vi.fn();
    const { container } = render(
      <JobDescriptionInput {...defaultProps} onChange={handleChange} />
    );
    const textarea = container.querySelector("textarea")!;

    fireEvent.change(textarea, { target: { value: "New JD" } });
    expect(handleChange).toHaveBeenCalledWith("New JD");
  });

  it("calls onJobTitleChange when job title changes", () => {
    const handleJobTitle = vi.fn();
    const { container } = render(
      <JobDescriptionInput {...defaultProps} onJobTitleChange={handleJobTitle} />
    );
    const inputs = container.querySelectorAll("input");

    fireEvent.change(inputs[0], { target: { value: "Engineer" } });
    expect(handleJobTitle).toHaveBeenCalledWith("Engineer");
  });

  it("calls onCompanyNameChange when company changes", () => {
    const handleCompany = vi.fn();
    const { container } = render(
      <JobDescriptionInput {...defaultProps} onCompanyNameChange={handleCompany} />
    );
    const inputs = container.querySelectorAll("input");

    fireEvent.change(inputs[1], { target: { value: "Acme" } });
    expect(handleCompany).toHaveBeenCalledWith("Acme");
  });

  it("shows error message when provided", () => {
    const { container } = render(
      <JobDescriptionInput {...defaultProps} error="JD too short" />
    );

    expect(container.textContent).toContain("JD too short");
  });
});
