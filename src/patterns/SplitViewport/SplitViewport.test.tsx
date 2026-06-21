import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SplitViewport } from "./SplitViewport";

const slots = [
  {
    id: "alpha",
    label: "Alpha",
    content: <div>Alpha content</div>,
    predictionScore: 2,
  },
  {
    id: "beta",
    label: "Beta",
    content: <div>Beta content</div>,
    predictionScore: 8,
  },
  {
    id: "gamma",
    label: "Gamma",
    content: <div>Gamma content</div>,
    predictionScore: 4,
  },
];

describe("SplitViewport", () => {
  it("returns null for empty slots by default", () => {
    const { container } = render(<SplitViewport slots={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<SplitViewport slots={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders the highest prediction score in the primary pane", () => {
    const { container } = render(<SplitViewport slots={slots} />);

    expect(screen.getByRole("region", { name: "Split viewport" })).toBeInTheDocument();
    expect(container.querySelector(".atlas-split-viewport__primary")).toHaveTextContent("Beta content");
    expect(container.querySelector(".atlas-split-viewport__secondary")).toHaveTextContent("Alpha content");
    expect(container.querySelector(".atlas-split-viewport__secondary")).toHaveTextContent("Gamma content");
  });

  it("does not emit React key warnings for secondary slots", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      render(<SplitViewport slots={slots} />);

      expect(errorSpy.mock.calls.flat().join("\n")).not.toContain(
        'Each child in a list should have a unique "key" prop.',
      );
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("honors a visible requested primary slot", () => {
    const { container } = render(<SplitViewport slots={slots} primarySlotId="alpha" />);

    expect(container.querySelector(".atlas-split-viewport__primary")).toHaveTextContent("Alpha content");
  });

  it("omits hidden and meaningless slots", () => {
    render(
      <SplitViewport
        slots={[
          ...slots,
          { id: "delta", content: null, label: "Delta", predictionScore: 12 },
          { id: "epsilon", content: <div>Epsilon content</div>, hidden: true },
        ]}
      />,
    );

    expect(screen.queryByText("Delta")).not.toBeInTheDocument();
    expect(screen.queryByText("Epsilon content")).not.toBeInTheDocument();
  });

  it("does not render a secondary pane for a single meaningful slot", () => {
    const { container } = render(<SplitViewport slots={[slots[0]]} />);

    expect(container.querySelector(".atlas-split-viewport__primary")).toHaveTextContent("Alpha content");
    expect(container.querySelector(".atlas-split-viewport__secondary")).toBeNull();
  });
});
