import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

const items = [
  { id: "item-a", label: "Item A", content: <p>Panel A</p> },
  { id: "item-b", label: "Item B", content: <p>Panel B</p> },
];

describe("Tabs", () => {
  it("renders the selected tab", () => {
    render(<Tabs items={items} selectedKey="item-b" />);

    expect(screen.getByRole("tab", { name: "Item B" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("changes tab selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Tabs items={items} onSelectionChange={onSelectionChange} />);

    await user.click(screen.getByRole("tab", { name: "Item B" }));

    expect(onSelectionChange).toHaveBeenCalledWith("item-b");
    expect(screen.getByText("Panel B")).toBeVisible();
  });

  it("returns null when no tabs are visible", () => {
    const { container } = render(<Tabs items={[{ id: "item-a", label: "Item A", content: "Panel A", hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });
});
