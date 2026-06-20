import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CollapsibleHealth } from "./CollapsibleHealth";

const makeAttentionItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    status: index % 2 === 0 ? "degraded" as const : "pending" as const,
    actions: [{ id: "open", label: "Open" }],
  }));

describe("CollapsibleHealth", () => {
  it("returns null for empty health items by default", () => {
    const { container } = render(<CollapsibleHealth items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<CollapsibleHealth items={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders a compact chip when all visible items are healthy", () => {
    render(
      <CollapsibleHealth
        items={[
          { id: "item-a", label: "Item A", status: "healthy" },
          { id: "item-b", label: "Item B", status: "healthy" },
          { id: "item-c", label: "Item C", status: "degraded", hidden: true },
        ]}
      />,
    );

    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.queryByText("Item A")).not.toBeInTheDocument();
  });

  it("expands degraded and pending items into an actionable list", () => {
    render(
      <CollapsibleHealth
        items={[
          { id: "item-a", label: "Item A", status: "healthy" },
          {
            id: "item-b",
            label: "Item B",
            status: "degraded",
            actions: [{ id: "open", label: "Open" }],
          },
          {
            id: "item-c",
            label: "Item C",
            status: "pending",
            actions: [{ id: "review", label: "Review" }],
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: /Needs attention/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByText("Item C")).toBeInTheDocument();
    expect(screen.queryByText("Item A")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review" })).toBeInTheDocument();
  });

  it("hides actions when read only", () => {
    render(<CollapsibleHealth items={makeAttentionItems(1)} readOnly />);

    expect(screen.queryByRole("button", { name: "Open" })).not.toBeInTheDocument();
  });

  it("does not render action surfaces when no visible actions exist", () => {
    render(
      <CollapsibleHealth
        items={[{ id: "item-1", label: "Item 1", status: "degraded", actions: [{ id: "open", label: "Open", hidden: true }] }]}
      />,
    );

    expect(screen.queryByLabelText("Item 1 actions")).not.toBeInTheDocument();
  });

  it("calls onAction with the action and item identifiers", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(<CollapsibleHealth items={makeAttentionItems(1)} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onAction).toHaveBeenCalledWith("open", "item-1");
  });

  it("renders search for twenty one attention items", () => {
    render(<CollapsibleHealth items={makeAttentionItems(21)} />);

    expect(screen.getByLabelText("Health items search")).toBeInTheDocument();
  });
});
