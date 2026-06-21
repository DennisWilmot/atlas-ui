import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectView } from "./SelectView";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

describe("SelectView", () => {
  it("returns null for empty items", () => {
    const { container } = render(<SelectView items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders a select for ten items", () => {
    render(<SelectView items={makeItems(10)} />);

    expect(screen.getByRole("combobox", { name: "Select item" })).toBeInstanceOf(HTMLSelectElement);
  });

  it("renders search input for eleven items", () => {
    render(<SelectView items={makeItems(11)} />);

    expect(screen.getByRole("combobox", { name: "Select item search" })).toBeInstanceOf(HTMLInputElement);
  });

  it("safely auto-selects a single item once", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SelectView items={makeItems(1)} onChange={onChange} />);

    rerender(<SelectView items={makeItems(1)} onChange={onChange} />);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("item-1");
  });

  it("does not auto-select a single item while disabled", () => {
    const onChange = vi.fn();

    render(<SelectView disabled items={makeItems(1)} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not auto-select a disabled single item", () => {
    const onChange = vi.fn();

    render(<SelectView items={[{ id: "item-1", label: "Item 1", disabled: true }]} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });
});
