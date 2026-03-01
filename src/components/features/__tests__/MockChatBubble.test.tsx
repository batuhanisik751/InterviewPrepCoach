import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MockChatBubble } from "../MockChatBubble";

describe("MockChatBubble", () => {
  it("renders user message content", () => {
    const { container } = render(
      <MockChatBubble role="user" content="My answer to the question" />
    );

    expect(container.textContent).toContain("My answer to the question");
  });

  it("renders assistant message content", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="Tell me about a time when..." />
    );

    expect(container.textContent).toContain("Tell me about a time when...");
  });

  it("shows 'You' label for user messages", () => {
    const { container } = render(
      <MockChatBubble role="user" content="test" />
    );

    expect(container.textContent).toContain("You");
  });

  it("shows 'AI' label for assistant messages", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="test" />
    );

    expect(container.textContent).toContain("AI");
  });

  it("uses brand styling for user messages", () => {
    const { container } = render(
      <MockChatBubble role="user" content="test" />
    );

    const bubble = container.querySelector(".bg-brand-600");
    expect(bubble).not.toBeNull();
  });

  it("uses border styling for assistant messages", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="test" />
    );

    const bubble = container.querySelector(".border-border");
    expect(bubble).not.toBeNull();
  });

  it("shows streaming indicator when isStreaming is true", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="Thinking" isStreaming={true} />
    );

    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).not.toBeNull();
  });

  it("does not show streaming indicator when isStreaming is false", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="Done" isStreaming={false} />
    );

    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).toBeNull();
  });

  it("does not show streaming indicator by default", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="Done" />
    );

    const cursor = container.querySelector(".animate-pulse");
    expect(cursor).toBeNull();
  });

  it("uses flex-row-reverse for user messages (right-aligned)", () => {
    const { container } = render(
      <MockChatBubble role="user" content="test" />
    );

    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("flex-row-reverse");
  });

  it("does not use flex-row-reverse for assistant messages", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="test" />
    );

    const wrapper = container.firstElementChild!;
    expect(wrapper.className).not.toContain("flex-row-reverse");
  });

  it("preserves whitespace in content", () => {
    const { container } = render(
      <MockChatBubble role="assistant" content="Line 1" />
    );

    const textEl = container.querySelector(".whitespace-pre-wrap");
    expect(textEl).not.toBeNull();
  });
});
