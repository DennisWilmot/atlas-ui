import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, type RadioGroupItem } from "./RadioGroup";

const items: RadioGroupItem[] = [
  { id: "a", value: "a", label: "Option A" },
  { id: "b", value: "b", label: "Option B" },
  { id: "c", value: "c", label: "Option C", disabled: true },
];

describe("RadioGroup", () => {
  it("renders nothing when items is empty", () => {
    const { container } = render(<RadioGroup items={[]} label="Choose one" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("exposes an accessible group name", () => {
    render(<RadioGroup items={items} label="Choose one" />);

    expect(screen.getByRole("radiogroup", { name: "Choose one" })).toBeInTheDocument();
  });

  it("fires a value change when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup items={items} label="Choose one" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "Option B" }));

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders the selected item from the controlled value", () => {
    render(<RadioGroup items={items} label="Choose one" value="a" onValueChange={() => {}} />);

    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Option B" })).not.toBeChecked();
  });

  it("does not fire for a disabled item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup items={items} label="Choose one" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "Option C" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("prevents value change when the group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup items={items} label="Choose one" disabled onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "Option B" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders the horizontal orientation", () => {
    const { container } = render(<RadioGroup items={items} label="Choose one" orientation="horizontal" />);

    expect(container.querySelector(".atlas-radio-group--horizontal")).toBeInTheDocument();
  });

  it("renders the card variant", () => {
    const { container } = render(<RadioGroup items={items} label="Choose one" variant="card" />);

    expect(container.querySelector(".atlas-radio--card")).toBeInTheDocument();
  });

  it("applies the required state to the group", () => {
    render(<RadioGroup items={items} label="Choose one" required />);

    expect(screen.getByRole("radiogroup", { name: "Choose one" })).toHaveAttribute("aria-required", "true");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("a");
      return <RadioGroup items={items} label="Choose one" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    await user.click(screen.getByRole("radio", { name: "Option B" }));

    expect(screen.getByRole("radio", { name: "Option B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Option A" })).not.toBeChecked();
  });
});
