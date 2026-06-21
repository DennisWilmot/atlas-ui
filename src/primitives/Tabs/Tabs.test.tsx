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

  it("moves focus and selection with arrow keys, skipping disabled tabs", async () => {
    const user = userEvent.setup();

    render(
      <Tabs
        items={[
          { id: "item-a", label: "Item A", content: <p>Panel A</p> },
          { id: "item-b", label: "Item B", content: <p>Panel B</p>, disabled: true },
          { id: "item-c", label: "Item C", content: <p>Panel C</p> },
        ]}
      />,
    );

    const firstTab = screen.getByRole("tab", { name: "Item A" });
    const thirdTab = screen.getByRole("tab", { name: "Item C" });

    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(thirdTab).toHaveFocus();
    expect(thirdTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel C")).toBeVisible();
  });

  it("jumps to the first and last tabs with Home and End", async () => {
    const user = userEvent.setup();

    render(<Tabs items={items} />);

    const firstTab = screen.getByRole("tab", { name: "Item A" });
    const secondTab = screen.getByRole("tab", { name: "Item B" });

    firstTab.focus();
    await user.keyboard("{End}");
    expect(secondTab).toHaveFocus();

    await user.keyboard("{Home}");
    expect(firstTab).toHaveFocus();
  });
});
