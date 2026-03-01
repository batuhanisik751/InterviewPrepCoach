import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ProgressChart } from "../ProgressChart";

// Mock recharts to avoid rendering SVG in jsdom
vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  );
  const MockLineChart = ({ children, data }: { children: React.ReactNode; data: unknown[] }) => (
    <div data-testid="line-chart" data-points={data.length}>{children}</div>
  );
  const MockLine = ({ dataKey }: { dataKey: string }) => (
    <div data-testid="line" data-key={dataKey} />
  );
  const MockXAxis = ({ dataKey }: { dataKey: string }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  );
  const MockYAxis = () => <div data-testid="y-axis" />;
  const MockCartesianGrid = () => <div data-testid="grid" />;
  const MockTooltip = () => <div data-testid="tooltip" />;

  return {
    ResponsiveContainer: MockResponsiveContainer,
    LineChart: MockLineChart,
    Line: MockLine,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    CartesianGrid: MockCartesianGrid,
    Tooltip: MockTooltip,
  };
});

describe("ProgressChart", () => {
  it("renders empty state when no data", () => {
    const { container } = render(<ProgressChart data={[]} />);

    expect(container.textContent).toContain("Complete sessions to see your score trend");
  });

  it("renders chart when data is provided", () => {
    const data = [
      { label: "Session 1", score: 7.5 },
      { label: "Session 2", score: 8.2 },
    ];
    const { container } = render(<ProgressChart data={data} />);

    expect(container.querySelector("[data-testid='responsive-container']")).not.toBeNull();
    expect(container.querySelector("[data-testid='line-chart']")).not.toBeNull();
  });

  it("renders Line component with score dataKey", () => {
    const data = [{ label: "S1", score: 5 }];
    const { container } = render(<ProgressChart data={data} />);

    const line = container.querySelector("[data-testid='line']");
    expect(line).not.toBeNull();
    expect(line!.getAttribute("data-key")).toBe("score");
  });

  it("renders XAxis with label dataKey", () => {
    const data = [{ label: "S1", score: 5 }];
    const { container } = render(<ProgressChart data={data} />);

    const xAxis = container.querySelector("[data-testid='x-axis']");
    expect(xAxis).not.toBeNull();
    expect(xAxis!.getAttribute("data-key")).toBe("label");
  });

  it("passes data points to LineChart", () => {
    const data = [
      { label: "Session 1", score: 7 },
      { label: "Session 2", score: 8 },
      { label: "Session 3", score: 6 },
    ];
    const { container } = render(<ProgressChart data={data} />);

    const chart = container.querySelector("[data-testid='line-chart']");
    expect(chart!.getAttribute("data-points")).toBe("3");
  });

  it("renders grid and tooltip", () => {
    const data = [{ label: "S1", score: 5 }];
    const { container } = render(<ProgressChart data={data} />);

    expect(container.querySelector("[data-testid='grid']")).not.toBeNull();
    expect(container.querySelector("[data-testid='tooltip']")).not.toBeNull();
  });

  it("does not render chart elements when data is empty", () => {
    const { container } = render(<ProgressChart data={[]} />);

    expect(container.querySelector("[data-testid='line-chart']")).toBeNull();
  });
});
