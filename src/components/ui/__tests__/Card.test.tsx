import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    const { container } = render(<Card>Card content</Card>);

    expect(container.textContent).toBe("Card content");
  });

  it("renders as a div with border styling", () => {
    const { container } = render(<Card>test</Card>);
    const card = container.firstElementChild!;

    expect(card.tagName).toBe("DIV");
    expect(card.className).toContain("rounded-xl");
    expect(card.className).toContain("border-border");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="extra">test</Card>);

    expect(container.firstElementChild!.className).toContain("extra");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);

    expect(container.textContent).toBe("Header");
  });

  it("has margin-bottom styling", () => {
    const { container } = render(<CardHeader>test</CardHeader>);

    expect(container.firstElementChild!.className).toContain("mb-4");
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);

    expect(container.firstElementChild!.tagName).toBe("H3");
  });

  it("renders with font-semibold styling", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);

    expect(container.firstElementChild!.className).toContain("font-semibold");
  });
});

describe("CardDescription", () => {
  it("renders as p", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);

    expect(container.firstElementChild!.tagName).toBe("P");
  });

  it("renders with muted text styling", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);

    expect(container.firstElementChild!.className).toContain("text-muted");
  });
});
