import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LineBarChartView } from "./Component";
import type { LineBarChartSeries } from "../../types";

const series: LineBarChartSeries[] = [
  {
    id: "series-a",
    label: "Series A",
    type: "bar",
    points: [
      { id: "point-a", label: "Point A", value: 12 },
      { id: "point-b", label: "Point B", value: 18 },
    ],
  },
  {
    id: "series-b",
    label: "Series B",
    type: "line",
    points: [
      { id: "point-a", label: "Point A", value: 10 },
      { id: "point-b", label: "Point B", value: 16 },
    ],
  },
];

describe("LineBarChartView", () => {
  it("returns null when no visible series exist", () => {
    const { container } = render(<LineBarChartView series={[{ ...series[0], hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders bars and line points with accessible values", () => {
    const { container } = render(<LineBarChartView label="Metrics" series={series} />);

    expect(container.querySelector('svg[role="img"] title')).toHaveTextContent("Metrics");
    expect(container.querySelector('[aria-label="Series A, Point A: 12"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Series B, Point B: 16"]')).toBeInTheDocument();
  });

  it("renders an explicit empty state only when requested", () => {
    render(<LineBarChartView series={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("ignores nonnumeric and hidden points", () => {
    render(
      <LineBarChartView
        series={[
          {
            id: "series-a",
            label: "Series A",
            type: "bar",
            points: [
              { id: "point-a", label: "Point A", value: 12 },
              { id: "point-b", label: "Point B", value: "not numeric" },
              { id: "point-c", label: "Point C", value: 14, hidden: true },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByLabelText("Series A, Point A: 12")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /Point B/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /Point C/ })).not.toBeInTheDocument();
  });

  it("hides zero-value points unless showZero is explicit", () => {
    const zeroSeries: LineBarChartSeries[] = [
      {
        id: "series-a",
        label: "Series A",
        type: "bar",
        points: [{ id: "point-a", label: "Point A", value: 0 }],
      },
    ];
    const { container, rerender } = render(<LineBarChartView series={zeroSeries} />);

    expect(container.firstChild).toBeNull();

    rerender(<LineBarChartView label="Metrics" series={zeroSeries} showZero />);

    expect(screen.getByLabelText("Series A, Point A: 0")).toBeInTheDocument();
  });
});
