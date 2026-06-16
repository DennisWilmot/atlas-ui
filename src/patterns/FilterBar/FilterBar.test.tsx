import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Filter } from "../../types";
import { FilterBar } from "./FilterBar";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

const makeFilter = (count: number, overrides: Partial<Filter> = {}): Filter => ({
  id: "filter-a",
  label: "Filter A",
  items: makeItems(count),
  ...overrides,
});

describe("FilterBar", () => {
  it("returns null for empty filters", () => {
    const { container } = render(<FilterBar filters={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when all filters are hidden or empty", () => {
    const { container } = render(
      <FilterBar
        filters={[
          makeFilter(0, { id: "empty", label: "Empty" }),
          makeFilter(3, { hidden: true, id: "hidden", label: "Hidden" }),
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders a select for ten filter options and emits changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<FilterBar filters={[makeFilter(10)]} onChange={onChange} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Filter A" }), "item-2");

    expect(onChange).toHaveBeenCalledWith("filter-a", "item-2");
  });

  it("renders a searchable control for eleven filter options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<FilterBar filters={[makeFilter(11)]} onChange={onChange} />);

    const search = screen.getByRole("combobox", { name: "Filter A search" });

    await user.type(search, "11");
    await user.click(screen.getByRole("option", { name: "Item 11" }));

    expect(onChange).toHaveBeenCalledWith("filter-a", "item-11");
  });

  it("disables controls when read only", () => {
    render(<FilterBar filters={[makeFilter(3)]} readOnly />);

    expect(screen.getByRole("combobox", { name: "Filter A" })).toBeDisabled();
  });
});
