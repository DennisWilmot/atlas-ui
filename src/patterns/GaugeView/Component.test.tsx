import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GaugeView } from "./Component";

describe("GaugeView", () => {
  it("renders a metric-driven meter with an accessible value", () => {
    const { container } = render(
      <GaugeView metric={{ label: "Metric A", value: 42, unit: "%" }} />,
    );

    const meter = screen.getByRole("meter", { name: "Metric A" });

    expect(meter).toHaveAttribute("aria-valuenow", "42");
    expect(meter).toHaveAttribute("aria-valuetext", "42%");
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(container.querySelector(".atlas-gauge-view__fill")).toHaveStyle({ width: "42%" });
  });

  it("returns null when the metric is missing a meaningful value", () => {
    const { container } = render(<GaugeView metric={{ label: "Metric A", value: null }} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when the metric is hidden", () => {
    const { container } = render(<GaugeView metric={{ hidden: true, label: "Metric A", value: 40 }} />);

    expect(container.firstChild).toBeNull();
  });

  it("hides zero by default", () => {
    const { container } = render(<GaugeView metric={{ label: "Metric A", value: 0 }} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders zero when showZero is true", () => {
    render(<GaugeView metric={{ label: "Metric A", value: 0, unit: "%" }} showZero />);

    expect(screen.getByRole("meter", { name: "Metric A" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("returns null for nonnumeric metric values", () => {
    const { container } = render(<GaugeView metric={{ label: "Metric A", value: "pending" }} />);

    expect(container.firstChild).toBeNull();
  });

  it("clamps values to the supplied range", () => {
    render(<GaugeView max={100} metric={{ label: "Metric A", value: 140, unit: "%" }} />);

    expect(screen.getByRole("meter", { name: "Metric A" })).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("returns null for invalid ranges", () => {
    const { container } = render(<GaugeView max={10} metric={{ label: "Metric A", value: 5 }} min={10} />);

    expect(container.firstChild).toBeNull();
  });

  it("supports a custom accessible label and value formatter", () => {
    render(
      <GaugeView
        aria-label="Current gauge"
        metric={{ label: "Metric A", value: 3 }}
        valueFormatter={(value) => `${value} units`}
      />,
    );

    expect(screen.getByRole("meter", { name: "Current gauge" })).toHaveAttribute("aria-valuetext", "3 units");
  });
});
