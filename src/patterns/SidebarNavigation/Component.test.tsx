import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SidebarNavigation } from "./Component";
import type { SidebarNavigationItem } from "../../types";

const items: SidebarNavigationItem[] = [
  {
    id: "item-a",
    label: "Item A",
    current: true,
    description: "Primary area",
    actions: [
      { id: "open", label: "Open" },
      { id: "hidden-action", label: "Hidden action", hidden: true },
    ],
  },
  {
    id: "item-b",
    label: "Item B",
    children: [{ id: "item-b-1", label: "Nested item" }],
  },
  {
    id: "item-c",
    label: "Item C",
    hidden: true,
  },
];

const makeItems = (count: number): SidebarNavigationItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

describe("SidebarNavigation", () => {
  it("returns null when no visible items exist", () => {
    const { container } = render(<SidebarNavigation items={[{ id: "hidden", label: "Hidden", hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state only when requested", () => {
    render(<SidebarNavigation items={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders nested visible items and hides hidden items", () => {
    render(<SidebarNavigation ariaLabel="Sections" items={items} />);

    expect(screen.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Item A/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Nested item" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Item C" })).not.toBeInTheDocument();
  });

  it("calls navigation and injected actions while hiding hidden actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onNavigate = vi.fn();

    render(<SidebarNavigation items={items} onAction={onAction} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: /Item A/ }));
    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onNavigate).toHaveBeenCalledWith("item-a");
    expect(onAction).toHaveBeenCalledWith("item-a", "open");
    expect(screen.queryByRole("button", { name: "Hidden action" })).not.toBeInTheDocument();
  });

  it("adds search and pagination after the list overflow threshold", () => {
    render(<SidebarNavigation ariaLabel="Sections" items={makeItems(21)} pageSize={10} />);

    expect(screen.getByLabelText("Sections search")).toBeInTheDocument();
    expect(screen.getByLabelText("Sections pagination")).toBeInTheDocument();
  });

  it("does not search at the list threshold", () => {
    render(<SidebarNavigation ariaLabel="Sections" items={makeItems(20)} />);

    expect(screen.queryByLabelText("Sections search")).not.toBeInTheDocument();
  });

  it("counts nested visible items when enforcing the list overflow threshold", () => {
    render(
      <SidebarNavigation
        ariaLabel="Sections"
        items={[{ id: "group", label: "Group", children: makeItems(21) }]}
      />,
    );

    expect(screen.getByLabelText("Sections search")).toBeInTheDocument();
  });

  it("filters searchable navigation items", async () => {
    const user = userEvent.setup();

    render(<SidebarNavigation ariaLabel="Sections" items={makeItems(21)} />);

    await user.type(screen.getByLabelText("Sections search"), "Item 21");

    expect(screen.getByRole("button", { name: "Item 21" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Item 1" })).not.toBeInTheDocument();
  });

  it("removes item actions when read only", () => {
    render(<SidebarNavigation items={items} readOnly />);

    expect(screen.queryByRole("button", { name: "Open" })).not.toBeInTheDocument();
  });

  it("disables navigation and actions when disabled", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onNavigate = vi.fn();

    render(<SidebarNavigation disabled items={items} onAction={onAction} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: /Item A/ }));
    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onNavigate).not.toHaveBeenCalled();
    expect(onAction).not.toHaveBeenCalled();
  });
});
