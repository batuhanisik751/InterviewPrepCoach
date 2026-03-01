import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ErrorPage from "../error";

describe("ErrorPage", () => {
  const mockError = new Error("Test error") as Error & { digest?: string };
  const mockReset = vi.fn();

  it("renders error heading", () => {
    const { container } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    );
    expect(container.textContent).toContain("Something went wrong");
  });

  it("renders Oops text", () => {
    const { container } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    );
    expect(container.textContent).toContain("Oops");
  });

  it("renders a try again button", () => {
    const { container } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    );
    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain("Try Again");
  });

  it("calls reset when try again button is clicked", () => {
    const { container } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    );
    const button = container.querySelector("button")!;
    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("logs error to console", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(consoleSpy).toHaveBeenCalledWith("Application error:", mockError);
    consoleSpy.mockRestore();
  });
});
