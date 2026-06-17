import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelectView } from "./Component";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

describe("MultiSelectView", () => {
  it("returns null for empty items", () => {
    const { container } = render(<MultiSelectView items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when every item is meaningless", () => {
    const { container } = render(
      <MultiSelectView
        items={[
          { id: "", label: "Item A" },
          { id: "item-b", label: "" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders checkboxes without search for ten items", () => {
    render(<MultiSelectView items={makeItems(10)} value={["item-2"]} />);

    expect(screen.queryByRole("searchbox", { name: "Select items search" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Item 2" })).toBeChecked();
  });

  it("renders searchable options for eleven items", async () => {
    const user = userEvent.setup();

    render(<MultiSelectView items={makeItems(11)} />);

    await user.type(screen.getByRole("searchbox", { name: "Select items search" }), "11");

    expect(screen.getByRole("checkbox", { name: "Item 11" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Item 1" })).not.toBeInTheDocument();
  });

  it("emits the next selected id set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <MultiSelectView items={makeItems(3)} value={["item-2"]} onChange={onChange} />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Item 1" }));

    expect(onChange).toHaveBeenLastCalledWith(["item-2", "item-1"]);

    rerender(<MultiSelectView items={makeItems(3)} value={["item-2", "item-1"]} onChange={onChange} />);

    await user.click(screen.getByRole("checkbox", { name: "Item 2" }));

    expect(onChange).toHaveBeenLastCalledWith(["item-1"]);
  });

  it("drops selected ids that are not meaningful items before emitting changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelectView
        items={makeItems(3)}
        value={["item-2", "missing-item", "item-2"]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Item 1" }));

    expect(onChange).toHaveBeenLastCalledWith(["item-2", "item-1"]);
  });

  it("does not emit changes when read only", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MultiSelectView items={makeItems(1)} onChange={onChange} readOnly />);

    expect(screen.getByRole("checkbox", { name: "Item 1" })).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "Item 1" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
