import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders with a label", () => {
    render(<Checkbox label="Item A" />);

    expect(screen.getByRole("checkbox", { name: "Item A" })).toBeInTheDocument();
  });

  it("toggles when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Item A" />);

    const checkbox = screen.getByRole("checkbox", { name: "Item A" });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled label="Item A" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox", { name: "Item A" }));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox", { name: "Item A" })).not.toBeChecked();
  });

  it("sets the indeterminate state", () => {
    render(<Checkbox indeterminate label="Item A" />);

    expect(screen.getByRole("checkbox", { name: "Item A" })).toBePartiallyChecked();
  });
});
