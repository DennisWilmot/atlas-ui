import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionMenu } from "./ActionMenu";

describe("ActionMenu", () => {
  it("returns null when no visible actions exist", () => {
    const { container } = render(<ActionMenu actions={[{ id: "a", label: "Alpha", hidden: true }]} />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render hidden actions", () => {
    render(
      <ActionMenu
        actions={[
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta", hidden: true },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Beta" })).not.toBeInTheDocument();
  });

  it("does not execute disabled actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(<ActionMenu actions={[{ id: "a", label: "Alpha", disabled: true }]} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(onAction).not.toHaveBeenCalled();
  });
});
