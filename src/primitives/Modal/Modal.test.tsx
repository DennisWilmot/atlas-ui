import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders as a modal overlay", () => {
    render(<Modal open title="Item A">Content</Modal>);

    expect(screen.getByRole("dialog", { name: "Item A" })).toHaveClass("atlas-overlay__panel--modal");
  });

  it("closes when dismissable", () => {
    const onOpenChange = vi.fn();
    render(<Modal onOpenChange={onOpenChange} open title="Item A">Content</Modal>);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("respects non-dismissable mode", () => {
    render(<Modal dismissable={false} open title="Item A">Content</Modal>);

    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});
