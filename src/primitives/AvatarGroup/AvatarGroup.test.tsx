import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarGroup, type AvatarGroupItem } from "./AvatarGroup";

const items: AvatarGroupItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `item-${index}`,
  label: `Record ${index}`,
  initials: `R${index}`,
}));

describe("AvatarGroup", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<AvatarGroup items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the overflow count for items beyond maxVisible", () => {
    render(<AvatarGroup items={items} maxVisible={5} />);

    // 8 items, 5 visible, 3 hidden.
    expect(screen.getByText("+3")).toBeInTheDocument();
    expect(screen.getByLabelText("3 more")).toBeInTheDocument();
  });

  it("shows no overflow indicator when items fit within maxVisible", () => {
    render(<AvatarGroup items={items.slice(0, 3)} maxVisible={5} />);

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("defaults maxVisible to 5", () => {
    render(<AvatarGroup items={items} />);

    expect(screen.getByText("+3")).toBeInTheDocument();
  });
});
