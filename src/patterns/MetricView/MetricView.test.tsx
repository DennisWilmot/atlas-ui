import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricView } from "./MetricView";

describe("MetricView", () => {
  it("hides zero by default", () => {
    const { container } = render(<MetricView metric={{ label: "Metric A", value: 0 }} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders zero when showZero is true", () => {
    render(<MetricView metric={{ label: "Metric A", value: 0 }} showZero />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("returns null when hidden", () => {
    const { container } = render(<MetricView metric={{ label: "Metric A", value: 1, hidden: true }} />);

    expect(container.firstChild).toBeNull();
  });
});
