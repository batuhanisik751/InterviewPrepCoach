import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import NotFound from "../not-found";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { vi } from "vitest";

describe("NotFound", () => {
  it("renders 404 text", () => {
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain("404");
  });

  it("renders page not found heading", () => {
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain("Page not found");
  });

  it("renders a description", () => {
    const { container } = render(<NotFound />);
    expect(container.textContent).toContain(
      "does not exist or has been moved"
    );
  });

  it("renders a link to dashboard", () => {
    const { container } = render(<NotFound />);
    const link = container.querySelector('a[href="/dashboard"]');
    expect(link).not.toBeNull();
    expect(link?.textContent).toContain("Go to Dashboard");
  });
});
