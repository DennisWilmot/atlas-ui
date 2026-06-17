import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("returns null when no meaningful content or visible actions exist", () => {
    const { container } = render(
      <EmptyState
        actions={[{ id: "hidden", label: "Hidden", hidden: true }]}
        description={["", false, null]}
        title="   "
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders an accessible opt-in empty state", () => {
    render(<EmptyState title="No matching items" description="Adjust the input or choose an action." />);

    expect(screen.getByRole("region", { name: "No matching items" })).toBeInTheDocument();
    expect(screen.getByText("Adjust the input or choose an action.")).toBeInTheDocument();
  });

  it("renders visible injected actions and ignores hidden actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        actions={[
          { id: "alpha", label: "Alpha", intent: "primary" },
          { id: "hidden", label: "Hidden", hidden: true },
        ]}
        onAction={onAction}
        title="No matching items"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(onAction).toHaveBeenCalledWith("alpha");
    expect(screen.queryByRole("button", { name: "Hidden" })).not.toBeInTheDocument();
  });

  it("does not execute disabled actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        actions={[{ id: "alpha", label: "Alpha", disabled: true }]}
        onAction={onAction}
        title="No matching items"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(onAction).not.toHaveBeenCalled();
  });

  it("can render an actions-only empty state with an aria label", () => {
    render(<EmptyState actions={[{ id: "alpha", label: "Alpha" }]} ariaLabel="Item actions" />);

    expect(screen.getByRole("region", { name: "Item actions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
  });
});
