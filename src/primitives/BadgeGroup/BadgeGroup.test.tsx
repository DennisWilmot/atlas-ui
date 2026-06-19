import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgeGroup, type BadgeGroupItem } from "./BadgeGroup";

const items: BadgeGroupItem[] = Array.from({ length: 6 }, (_, index) => ({
  id: `item-${index}`,
  label: `Label ${index}`,
}));

describe("BadgeGroup", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<BadgeGroup items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when every item is meaningless", () => {
    const { container } = render(
      <BadgeGroup
        items={[
          { id: "empty", label: "" },
          { id: "space", label: " " },
          { id: "false", label: false },
        ]}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when maxVisible hides every badge", () => {
    const { container } = render(<BadgeGroup items={items} maxVisible={0} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the overflow count for badges beyond maxVisible", () => {
    render(<BadgeGroup items={items} maxVisible={2} />);

    // 6 items, 2 visible, 4 hidden.
    expect(screen.getByText("+4")).toBeInTheDocument();
    expect(screen.getByLabelText("4 more")).toBeInTheDocument();
  });

  it("does not count meaningless items toward overflow", () => {
    render(<BadgeGroup items={[{ id: "empty", label: "" }, ...items.slice(0, 4)]} maxVisible={2} />);

    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.queryByText("+3")).not.toBeInTheDocument();
  });

  it("renders all badges and no overflow when maxVisible is omitted", () => {
    render(<BadgeGroup items={items} />);

    expect(screen.getByText("Label 0")).toBeInTheDocument();
    expect(screen.getByText("Label 5")).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("wraps the overflow indicator in a tooltip, only when there is overflow", () => {
    const { container, rerender } = render(<BadgeGroup items={items} maxVisible={2} />);
    expect(container.querySelector(".atlas-tooltip")).toBeInTheDocument();

    rerender(<BadgeGroup items={items} />);
    expect(container.querySelector(".atlas-tooltip")).not.toBeInTheDocument();
  });
});
