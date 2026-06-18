import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Select, type SelectOption } from "./Select";

const fewItems: SelectOption[] = [
  { id: "a", value: "a", label: "Option A" },
  { id: "b", value: "b", label: "Option B" },
  { id: "c", value: "c", label: "Option C", disabled: true },
];

const manyItems: SelectOption[] = Array.from({ length: 11 }, (_, index) => ({
  id: `opt-${index}`,
  value: `opt-${index}`,
  label: `Option ${index}`,
}));

describe("Select", () => {
  it("renders nothing when items is empty", () => {
    const { container } = render(<Select items={[]} label="Choose one" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("exposes an accessible label", () => {
    render(<Select items={fewItems} label="Choose one" />);

    expect(screen.getByRole("combobox", { name: "Choose one" })).toBeInTheDocument();
  });

  it("associates the hint with the control", () => {
    render(<Select items={fewItems} label="Choose one" hint="Pick the best fit" />);

    expect(screen.getByRole("combobox", { name: "Choose one" })).toHaveAccessibleDescription(/Pick the best fit/);
  });

  it("associates the error and marks the control invalid", () => {
    render(<Select items={fewItems} label="Choose one" error="Selection required" />);

    const control = screen.getByRole("combobox", { name: "Choose one" });
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAccessibleDescription(/Selection required/);
  });

  it("replaces the hint with the error when both are provided", () => {
    render(<Select items={fewItems} label="Choose one" hint="Pick the best fit" error="Selection required" />);

    expect(screen.queryByText("Pick the best fit")).not.toBeInTheDocument();
    expect(screen.getByText("Selection required")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Choose one" })).toHaveAccessibleDescription("Selection required");
  });

  it("fires a value change when an item is selected", () => {
    const onValueChange = vi.fn();
    render(<Select items={fewItems} label="Choose one" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("combobox", { name: "Choose one" }), { target: { value: "b" } });

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders disabled options that cannot be selected", () => {
    render(<Select items={fewItems} label="Choose one" />);

    const disabledOption = screen.getByRole("option", { name: "Option C" });
    expect(disabledOption).toBeDisabled();
  });

  it("disables the whole control when disabled", () => {
    render(<Select items={fewItems} label="Choose one" disabled />);

    expect(screen.getByRole("combobox", { name: "Choose one" })).toBeDisabled();
  });

  it("selects the single item by default when no value is provided", () => {
    render(<Select items={[{ id: "only", value: "only", label: "Only Option" }]} label="Choose one" />);

    expect(screen.getByRole("combobox", { name: "Choose one" })).toHaveValue("only");
  });

  it("renders a standard select for 10 or fewer items", () => {
    render(<Select items={fewItems} label="Choose one" />);

    expect(screen.getByRole("combobox", { name: "Choose one" }).tagName).toBe("SELECT");
  });

  it("upgrades to a searchable combobox for more than 10 items", () => {
    render(<Select items={manyItems} label="Choose one" />);

    const control = screen.getByRole("combobox", { name: "Choose one" });
    expect(control.tagName).toBe("INPUT");
    expect(control).toHaveAttribute("aria-autocomplete", "list");
    expect(control).toHaveAttribute("aria-expanded", "false");
  });

  it("filters and selects in the searchable combobox", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={manyItems} label="Choose one" onValueChange={onValueChange} />);

    const control = screen.getByRole("combobox", { name: "Choose one" });
    await user.type(control, "Option 5");
    await user.click(screen.getByRole("option", { name: "Option 5" }));

    expect(onValueChange).toHaveBeenCalledWith("opt-5");
  });

  it("opens the listbox via the chevron toggle", async () => {
    const user = userEvent.setup();
    const { container } = render(<Select items={manyItems} label="Choose one" />);

    const toggle = container.querySelector(".atlas-select__toggle") as HTMLElement;
    await user.click(toggle);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows the no-results label when a search has no matches", async () => {
    const user = userEvent.setup();
    render(<Select items={manyItems} label="Choose one" noResultsLabel="No matches found" />);

    await user.type(screen.getByRole("combobox", { name: "Choose one" }), "zzzzz");

    expect(screen.getByText("No matches found")).toBeInTheDocument();
  });

  it("renders the controlled value correctly", () => {
    render(<Select items={fewItems} label="Choose one" value="b" onValueChange={() => {}} />);

    expect(screen.getByRole("combobox", { name: "Choose one" })).toHaveValue("b");
  });

  it("supports controlled selection", () => {
    function Controlled() {
      const [value, setValue] = useState("a");
      return <Select items={fewItems} label="Choose one" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    fireEvent.change(screen.getByRole("combobox", { name: "Choose one" }), { target: { value: "b" } });

    expect(screen.getByRole("combobox", { name: "Choose one" })).toHaveValue("b");
  });
});
