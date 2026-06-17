import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeView } from "./TreeView";

const nodes = [
  {
    id: "node-a",
    label: "Node A",
    children: [{ id: "node-a-1", label: "Node A1" }],
  },
  { id: "node-b", label: "Node B" },
];

describe("TreeView", () => {
  it("returns null when no visible nodes exist", () => {
    const { container } = render(<TreeView nodes={[{ id: "node-a", label: "Node A", hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render hidden nodes", () => {
    render(
      <TreeView
        nodes={[
          { id: "node-a", label: "Node A" },
          { id: "node-b", label: "Node B", hidden: true },
        ]}
      />,
    );

    expect(screen.getByText("Node A")).toBeInTheDocument();
    expect(screen.queryByText("Node B")).not.toBeInTheDocument();
  });

  it("fires select for enabled nodes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TreeView nodes={nodes} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Node B" }));

    expect(onSelect).toHaveBeenCalledWith("node-b");
  });

  it("expands and collapses nested nodes", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(<TreeView nodes={nodes} onExpandedChange={onExpandedChange} />);

    await user.click(screen.getByRole("button", { name: "Toggle node-a" }));

    expect(screen.getByText("Node A1")).toBeInTheDocument();
    expect(onExpandedChange).toHaveBeenCalledWith(["node-a"]);

    await user.click(screen.getByRole("button", { name: "Toggle node-a" }));

    expect(screen.queryByText("Node A1")).not.toBeInTheDocument();
    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });
});
