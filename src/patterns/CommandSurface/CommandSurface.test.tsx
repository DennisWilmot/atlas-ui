import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandSurface } from "./CommandSurface";

describe("CommandSurface", () => {
  it("returns null when no visible commands exist", () => {
    const { container } = render(
      <CommandSurface commands={[{ id: "alpha", label: "Alpha", hidden: true }]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("accepts command items and calls onSelect with the selected command id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <CommandSurface
        commands={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta" },
        ]}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("option", { name: "Beta" }));

    expect(onSelect).toHaveBeenCalledWith("beta");
  });

  it("does not select disabled commands", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<CommandSurface commands={[{ id: "alpha", label: "Alpha", disabled: true }]} onSelect={onSelect} />);

    await user.click(screen.getByRole("option", { name: "Alpha" }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("separates input changes from discovery selection", async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onSelect = vi.fn();

    render(
      <CommandSurface
        commands={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta" },
        ]}
        onInputChange={onInputChange}
        onSelect={onSelect}
      />,
    );

    await user.type(screen.getByLabelText("Command input"), "alp");

    expect(onInputChange).toHaveBeenLastCalledWith("alp");
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Beta" })).not.toBeInTheDocument();
  });

  it("supports controlled input values", () => {
    render(
      <CommandSurface
        commands={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta" },
        ]}
        inputValue="bet"
      />,
    );

    expect(screen.getByLabelText("Command input")).toHaveValue("bet");
    expect(screen.queryByRole("option", { name: "Alpha" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
  });
});
