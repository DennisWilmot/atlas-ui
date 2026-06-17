import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders content", () => {
    render(<Alert title="Item A" description="Supporting detail" />);

    expect(screen.getByRole("status")).toHaveTextContent("Item A");
    expect(screen.getByText("Supporting detail")).toBeInTheDocument();
  });

  it("fires visible actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Alert actions={[{ id: "action-a", label: "Action A" }]} onAction={onAction} title="Item A" />);

    await user.click(screen.getByRole("button", { name: "Action A" }));

    expect(onAction).toHaveBeenCalledWith("action-a");
  });

  it("does not render hidden actions", () => {
    render(
      <Alert
        actions={[
          { id: "action-a", label: "Action A" },
          { id: "action-b", label: "Action B", hidden: true },
        ]}
        title="Item A"
      />,
    );

    expect(screen.getByRole("button", { name: "Action A" })).toBeInTheDocument();
    expect(screen.queryByText("Action B")).not.toBeInTheDocument();
  });

  it("dismisses when dismissable", async () => {
    const user = userEvent.setup();
    render(<Alert dismissable title="Item A" />);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
