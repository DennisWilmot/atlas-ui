import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Overlay } from "./Overlay";

describe("Overlay", () => {
  it("renders by mode", () => {
    render(<Overlay mode="drawer" open title="Item A">Content</Overlay>);

    expect(screen.getByRole("dialog", { name: "Item A" })).toHaveClass("atlas-overlay__panel--drawer");
  });

  it("closes from the close button", () => {
    const onOpenChange = vi.fn();
    render(<Overlay mode="modal" onOpenChange={onOpenChange} open title="Item A">Content</Overlay>);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not dismiss from the backdrop when non-dismissable", () => {
    const onOpenChange = vi.fn();
    render(
      <Overlay dismissable={false} mode="modal" onOpenChange={onOpenChange} open title="Item A">
        Content
      </Overlay>,
    );

    fireEvent.mouseDown(screen.getByTestId("atlas-overlay-backdrop"));

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
