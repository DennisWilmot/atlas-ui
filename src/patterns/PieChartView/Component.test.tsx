import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PieChartView } from "./Component";

const makeSegments = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `segment-${index + 1}`,
    label: `Segment ${index + 1}`,
    value: index + 1,
  }));

describe("PieChartView", () => {
  it("returns null for empty segments by default", () => {
    const { container } = render(<PieChartView segments={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when all segments are meaningless", () => {
    const { container } = render(
      <PieChartView
        segments={[
          { id: "zero", label: "Segment A", value: 0 },
          { id: "negative", label: "Segment B", value: -1 },
          { id: "blank", label: " ", value: 2 },
          { id: "hidden", label: "Segment C", value: 3, hidden: true },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders an accessible chart and segment legend", () => {
    render(
      <PieChartView
        label="Segment share"
        segments={[
          { id: "a", label: "Segment A", value: 30 },
          { id: "b", label: "Segment B", value: 70 },
        ]}
      />,
    );

    expect(screen.getByRole("img", { name: "Segment share" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Segment share segments" })).toBeInTheDocument();
    expect(screen.getByText("Segment A")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("accepts canonical metric values supplied as numeric strings", () => {
    render(
      <PieChartView
        label="Segment share"
        segments={[
          { id: "a", label: "Segment A", value: "25" },
          { id: "b", label: "Segment B", value: 75 },
        ]}
      />,
    );

    expect(screen.getByText("Segment A")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<PieChartView segments={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders search for twenty one segments", () => {
    render(<PieChartView label="Segment share" segments={makeSegments(21)} />);

    expect(screen.getByLabelText("Segment share search")).toBeInTheDocument();
  });

  it("filters overflowed legend segments by search query", async () => {
    const user = userEvent.setup();
    render(<PieChartView label="Segment share" segments={makeSegments(21)} />);

    await user.type(screen.getByLabelText("Segment share search"), "Segment 21");

    const legend = screen.getByRole("list", { name: "Segment share segments" });
    expect(legend).toHaveTextContent("Segment 21");
    expect(legend).not.toHaveTextContent("Segment 1");
  });

  it("falls back to a safe page size for invalid page sizes", () => {
    render(<PieChartView label="Segment share" pageSize={0} segments={makeSegments(21)} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });
});
