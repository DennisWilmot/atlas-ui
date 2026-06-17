import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch", () => {
    render(<Toggle label="Item A" />);

    expect(screen.getByRole("switch", { name: "Item A" })).toBeInTheDocument();
  });

  it("toggles when selected", async () => {
    const user = userEvent.setup();
    render(<Toggle label="Item A" />);

    const toggle = screen.getByRole("switch", { name: "Item A" });
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Toggle disabled label="Item A" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Item A" }));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch", { name: "Item A" })).toHaveAttribute("aria-checked", "false");
  });
});
