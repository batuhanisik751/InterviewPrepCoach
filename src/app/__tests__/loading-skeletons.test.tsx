import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DashboardLoading from "../(app)/dashboard/loading";
import HistoryLoading from "../(app)/history/loading";
import SessionLoading from "../(app)/session/[id]/loading";
import ResultsLoading from "../(app)/session/[id]/results/loading";
import MockLoading from "../(app)/session/[id]/mock/loading";
import NewSessionLoading from "../(app)/session/new/loading";

describe("Loading Skeletons", () => {
  it("DashboardLoading renders with animate-pulse", () => {
    const { container } = render(<DashboardLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("DashboardLoading renders skeleton blocks", () => {
    const { container } = render(<DashboardLoading />);
    const skeletons = container.querySelectorAll(".bg-surface-tertiary");
    expect(skeletons.length).toBeGreaterThan(3);
  });

  it("HistoryLoading renders with animate-pulse", () => {
    const { container } = render(<HistoryLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("HistoryLoading renders table-like skeleton rows", () => {
    const { container } = render(<HistoryLoading />);
    const rows = container.querySelectorAll(".border-b");
    expect(rows.length).toBeGreaterThan(2);
  });

  it("SessionLoading renders with animate-pulse", () => {
    const { container } = render(<SessionLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("SessionLoading renders question card skeletons", () => {
    const { container } = render(<SessionLoading />);
    const cards = container.querySelectorAll(".rounded-xl");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("ResultsLoading renders with animate-pulse", () => {
    const { container } = render(<ResultsLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("ResultsLoading renders score and question skeletons", () => {
    const { container } = render(<ResultsLoading />);
    const skeletons = container.querySelectorAll(".bg-surface-tertiary");
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it("MockLoading renders with animate-pulse", () => {
    const { container } = render(<MockLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("NewSessionLoading renders with animate-pulse", () => {
    const { container } = render(<NewSessionLoading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("NewSessionLoading renders two-column grid skeleton", () => {
    const { container } = render(<NewSessionLoading />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
  });
});
