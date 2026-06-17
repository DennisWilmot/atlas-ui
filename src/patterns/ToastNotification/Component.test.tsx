import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Toast } from "../../types";
import { ToastNotification } from "./Component";

const toast: Toast = {
  id: "item-a",
  message: "Item A changed.",
  title: "Item A",
};

describe("ToastNotification", () => {
  it("returns null when no toast is supplied", () => {
    const { container } = render(<ToastNotification toast={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when toast content is meaningless", () => {
    const { container } = render(<ToastNotification toast={{ message: " ", title: "" }} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when toast is hidden", () => {
    const { container } = render(<ToastNotification toast={{ ...toast, hidden: true }} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders a status notification by default", () => {
    render(<ToastNotification toast={toast} />);

    expect(screen.getByRole("status", { name: "Notification" })).toBeInTheDocument();
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item A changed.")).toBeInTheDocument();
  });

  it("uses alert semantics for attention tones", () => {
    render(<ToastNotification toast={{ ...toast, tone: "danger" }} />);

    expect(screen.getByRole("alert", { name: "Notification" })).toBeInTheDocument();
  });

  it("renders visible injected actions and emits selected action", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <ToastNotification
        onAction={onAction}
        toast={{
          ...toast,
          actions: [
            { id: "alpha", label: "Alpha" },
            { hidden: true, id: "hidden", label: "Hidden" },
          ],
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(onAction).toHaveBeenCalledWith("alpha", expect.objectContaining({ id: "item-a" }));
    expect(screen.queryByRole("button", { name: "Hidden" })).not.toBeInTheDocument();
  });

  it("omits actions and dismissal when read only", () => {
    render(
      <ToastNotification
        onDismiss={vi.fn()}
        readOnly
        toast={{
          ...toast,
          actions: [{ id: "alpha", label: "Alpha" }],
        }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Alpha" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Dismiss notification" })).not.toBeInTheDocument();
  });

  it("emits dismissal when a dismiss handler is supplied", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(<ToastNotification onDismiss={onDismiss} toast={toast} />);

    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));

    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ id: "item-a" }));
  });
});
