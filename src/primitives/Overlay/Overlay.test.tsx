import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
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

  it("moves focus into the overlay and traps tab navigation inside it", async () => {
    const user = userEvent.setup();

    render(
      <Overlay mode="modal" open title="Item A">
        <input aria-label="Details" />
        <button type="button">Confirm</button>
      </Overlay>,
    );

    const closeButton = screen.getByRole("button", { name: "Close" });

    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("textbox", { name: "Details" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("closes on escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();

    function Example() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open
          </button>
          <Overlay mode="modal" onOpenChange={setOpen} open={open} title="Item A">
            <button type="button">Confirm</button>
          </Overlay>
        </>
      );
    }

    render(<Example />);

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);

    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
