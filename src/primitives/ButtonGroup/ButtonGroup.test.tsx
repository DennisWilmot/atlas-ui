import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Action } from "../../types";
import { ButtonGroup } from "./ButtonGroup";

const items: Action[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week", disabled: true },
  { id: "month", label: "Month" },
];

const icon = <span aria-hidden="true">*</span>;

describe("ButtonGroup", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<ButtonGroup items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when every item is hidden or meaningless", () => {
    const { container } = render(
      <ButtonGroup
        items={[
          { id: "blank", label: "" },
          { id: "space", label: " " },
          { id: "hidden", label: "Hidden", hidden: true },
        ]}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("fires onItemClick with the item id when an item is clicked", () => {
    const onItemClick = vi.fn();
    render(<ButtonGroup items={items} onItemClick={onItemClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Month" }));

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith("month");
  });

  it("does not render hidden items", () => {
    render(
      <ButtonGroup
        items={[
          { id: "day", label: "Day" },
          { id: "week", label: "Week", hidden: true },
          { id: "month", label: "Month" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Day" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Week" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Month" })).toBeInTheDocument();
  });

  it("does not render meaningless text-only items", () => {
    render(
      <ButtonGroup
        items={[
          { id: "blank", label: "" },
          { id: "space", label: " " },
          { id: "icon", label: "", icon },
          { id: "month", label: "Month" },
        ]}
      />,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Month" })).toBeInTheDocument();
  });

  it("renders nothing when every item is hidden", () => {
    const { container } = render(
      <ButtonGroup items={[{ id: "day", label: "Day", hidden: true }]} />,
    );

    expect(container).toBeEmptyDOMElement();
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

  it("uses radio semantics in single selection mode", () => {
    render(<ButtonGroup items={items} selectionMode="single" selectedId="day" aria-label="View" />);

    expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Month" })).toHaveAttribute("aria-checked", "false");
  });

  it("moves selection with arrow keys, skipping disabled items, in single mode", () => {
    const onItemClick = vi.fn();
    render(
      <ButtonGroup items={items} selectionMode="single" selectedId="day" onItemClick={onItemClick} />,
    );

    const day = screen.getByRole("radio", { name: "Day" });
    day.focus();
    fireEvent.keyDown(day, { key: "ArrowRight" });

    // "Week" is disabled, so focus/selection skips to "Month".
    expect(onItemClick).toHaveBeenCalledWith("month");
  });

  it("keeps an enabled radio tabbable when selectedId points to a disabled item", () => {
    render(<ButtonGroup items={items} selectionMode="single" selectedId="week" aria-label="View" />);

    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute("tabindex", "-1");
  });

  it("keeps an enabled radio tabbable when selectedId is missing", () => {
    render(<ButtonGroup items={items} selectionMode="single" selectedId="missing" aria-label="View" />);

    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Month" })).toHaveAttribute("tabindex", "-1");
  });
});
