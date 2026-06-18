import { render, screen } from "@testing-library/react";
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

function control() {
  return screen.getByRole("combobox", { name: "Choose one" });
}

describe("Select", () => {
  it("renders nothing when items is empty", () => {
    const { container } = render(<Select items={[]} label="Choose one" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("exposes an accessible label", () => {
    render(<Select items={fewItems} label="Choose one" />);

    expect(control()).toBeInTheDocument();
  });

  it("associates the hint with the control", () => {
    render(<Select items={fewItems} label="Choose one" hint="Pick the best fit" />);

    expect(control()).toHaveAccessibleDescription(/Pick the best fit/);
  });

  it("associates the error and marks the control invalid", () => {
    render(<Select items={fewItems} label="Choose one" error="Selection required" />);

    expect(control()).toHaveAttribute("aria-invalid", "true");
    expect(control()).toHaveAccessibleDescription(/Selection required/);
  });

  it("replaces the hint with the error when both are provided", () => {
    render(<Select items={fewItems} label="Choose one" hint="Pick the best fit" error="Selection required" />);

    expect(screen.queryByText("Pick the best fit")).not.toBeInTheDocument();
    expect(screen.getByText("Selection required")).toBeInTheDocument();
  });

  it("fires a value change when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={fewItems} label="Choose one" onValueChange={onValueChange} />);

    await user.click(control());
    await user.click(screen.getByRole("option", { name: "Option B" }));

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={fewItems} label="Choose one" onValueChange={onValueChange} />);

    await user.click(control());
    const disabledOption = screen.getByRole("option", { name: "Option C" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    await user.click(disabledOption);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not open when the control is disabled", async () => {
    const user = userEvent.setup();
    render(<Select items={fewItems} label="Choose one" disabled />);

    expect(control()).toBeDisabled();
    await user.click(control());

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects the single item by default when no value is provided", () => {
    render(<Select items={[{ id: "only", value: "only", label: "Only Option" }]} label="Choose one" />);

    expect(control()).toHaveValue("Only Option");
  });

  it("renders a non-searchable dropdown for 10 or fewer items", () => {
    render(<Select items={fewItems} label="Choose one" />);

    expect(control()).toHaveAttribute("readonly");
    expect(control()).not.toHaveAttribute("aria-autocomplete");
  });

  it("upgrades to a searchable combobox for more than 10 items", () => {
    render(<Select items={manyItems} label="Choose one" />);

    expect(control()).not.toHaveAttribute("readonly");
    expect(control()).toHaveAttribute("aria-autocomplete", "list");
  });

  it("filters and selects in the searchable combobox", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={manyItems} label="Choose one" onValueChange={onValueChange} />);

    await user.type(control(), "Option 5");
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

  it("moves the active option to the first and last with Home/End", async () => {
    const user = userEvent.setup();
    render(<Select items={manyItems} label="Choose one" />);

    const c = control();
    await user.click(c);
    await user.keyboard("{End}");
    expect(c.getAttribute("aria-activedescendant")).toMatch(/-opt-10$/);

    await user.keyboard("{Home}");
    expect(c.getAttribute("aria-activedescendant")).toMatch(/-opt-0$/);
  });

  it("shows the no-results label when a search has no matches", async () => {
    const user = userEvent.setup();
    render(<Select items={manyItems} label="Choose one" noResultsLabel="No matches found" />);

    await user.type(control(), "zzzzz");

    expect(screen.getByText("No matches found")).toBeInTheDocument();
  });

  it("renders the controlled value correctly", () => {
    render(<Select items={fewItems} label="Choose one" value="b" onValueChange={() => {}} />);

    expect(control()).toHaveValue("Option B");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("a");
      return <Select items={fewItems} label="Choose one" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    await user.click(control());
    await user.click(screen.getByRole("option", { name: "Option B" }));

    expect(control()).toHaveValue("Option B");
  });
});
