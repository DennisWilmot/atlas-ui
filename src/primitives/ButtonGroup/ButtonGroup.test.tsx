import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ButtonGroup, type ButtonGroupItem } from "./ButtonGroup";

const items: ButtonGroupItem[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week", disabled: true },
  { id: "month", label: "Month" },
];

describe("ButtonGroup", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<ButtonGroup items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("fires onItemClick with the item id when an item is clicked", () => {
    const onItemClick = vi.fn();
    render(<ButtonGroup items={items} onItemClick={onItemClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Month" }));

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith("month");
  });

  it("does not fire for a disabled item", () => {
    const onItemClick = vi.fn();
    render(<ButtonGroup items={items} onItemClick={onItemClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Week" }));

    expect(onItemClick).not.toHaveBeenCalled();
  });

  it("marks the selected item with aria-pressed", () => {
    render(<ButtonGroup items={items} selectedId="month" />);

    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "false");
  });
});
