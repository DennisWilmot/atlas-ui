import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RadarChartAxis } from "../../types";
import { RadarChartView } from "./Component";

type RecordRow = {
  id: string;
  label: string;
  metricA: number;
  metricB: number;
  metricC: number;
};

const axes: RadarChartAxis<RecordRow>[] = [
  { key: "metricA", label: "Metric A", max: 100 },
  { key: "metricB", label: "Metric B", max: 100 },
  { key: "metricC", label: "Metric C", max: 100 },
];

const rows: RecordRow[] = [
  { id: "alpha", label: "Alpha", metricA: 72, metricB: 64, metricC: 86 },
  { id: "beta", label: "Beta", metricA: 48, metricB: 82, metricC: 54 },
];

const baseProps = {
  axes,
  getRowKey: (row: RecordRow) => row.id,
  getRowLabel: (row: RecordRow) => row.label,
  label: "Metric comparison",
  rows,
};

describe("RadarChartView", () => {
  it("renders a labelled chart and legend for meaningful rows", () => {
    render(<RadarChartView {...baseProps} />);

    expect(screen.getByRole("img", { name: "Metric comparison" })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("returns null for empty rows by default", () => {
    const { container } = render(<RadarChartView {...baseProps} rows={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when fewer than three axes are supplied", () => {
    const { container } = render(<RadarChartView {...baseProps} axes={axes.slice(0, 2)} />);

    expect(container.firstChild).toBeNull();
  });

  it("hides all-zero rows unless showZero is explicit", () => {
    const zeroRows = [{ id: "zero", label: "Zero", metricA: 0, metricB: 0, metricC: 0 }];
    const { container, rerender } = render(<RadarChartView {...baseProps} rows={zeroRows} />);

    expect(container.firstChild).toBeNull();

    rerender(<RadarChartView {...baseProps} rows={zeroRows} showZero />);

    expect(screen.getByRole("img", { name: "Metric comparison" })).toBeInTheDocument();
  });

  it("renders an explicit empty state when requested", () => {
    render(<RadarChartView {...baseProps} rows={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders only injected visible actions", () => {
    const onAction = vi.fn();
    render(
      <RadarChartView
        {...baseProps}
        actions={[
          { id: "inspect", label: "Inspect" },
          { id: "hidden", label: "Hidden", hidden: true },
        ]}
        onAction={onAction}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));

    expect(onAction).toHaveBeenCalledWith("inspect");
    expect(screen.queryByRole("button", { name: "Hidden" })).not.toBeInTheDocument();
  });

  it("does not render actions when read only", () => {
    render(<RadarChartView {...baseProps} actions={[{ id: "inspect", label: "Inspect" }]} readOnly />);

    expect(screen.queryByRole("button", { name: "Inspect" })).not.toBeInTheDocument();
  });
});
