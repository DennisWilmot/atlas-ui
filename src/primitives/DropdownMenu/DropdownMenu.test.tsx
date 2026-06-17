import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  it("hides hidden items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        items={[
          { id: "item-a", label: "Item A" },
          { id: "item-b", label: "Item B", hidden: true },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByRole("menuitem", { name: "Item A" })).toBeInTheDocument();
    expect(screen.queryByText("Item B")).not.toBeInTheDocument();
  });

  it("does not execute disabled items", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu
        items={[{ id: "item-a", label: "Item A", disabled: true }]}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Item A" }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("returns null when no visible items exist", () => {
    const { container } = render(<DropdownMenu items={[{ id: "item-a", label: "Item A", hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });
});
