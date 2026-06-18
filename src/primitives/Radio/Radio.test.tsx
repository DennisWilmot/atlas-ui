import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("exposes an accessible label via a visible label or aria-label", () => {
    const { rerender } = render(<Radio label="Option A" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();

    rerender(<Radio aria-label="Option B" />);
    expect(screen.getByRole("radio", { name: "Option B" })).toBeInTheDocument();
  });

  it("renders nothing when there is no accessible name", () => {
    const { container, rerender } = render(<Radio />);
    expect(container).toBeEmptyDOMElement();

    // An empty label is fine as long as an aria-label provides a name.
    rerender(<Radio label="" aria-label="Option A" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("renders the checked state from props (controlled)", () => {
    render(<Radio aria-label="Option A" checked onChange={() => {}} />);

    expect(screen.getByRole("radio", { name: "Option A" })).toBeChecked();
  });

  it("fires a change event when selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio aria-label="Option A" value="a" onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "Option A" }));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not fire change when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio aria-label="Option A" disabled onChange={onChange} />);

    const radio = screen.getByRole("radio", { name: "Option A" });
    await user.click(radio);

    expect(onChange).not.toHaveBeenCalled();
    expect(radio).not.toBeChecked();
  });

  it("associates the description with the radio without leaking it into the name", () => {
    render(<Radio label="Option A" description="Extra detail" />);

    const radio = screen.getByRole("radio", { name: "Option A" });
    expect(radio).toHaveAccessibleDescription(/Extra detail/);
  });

  it("renders the card variant while preserving radio behavior", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <Radio variant="card" label="Option A" value="a" onChange={onChange} />,
    );

    expect(container.querySelector(".atlas-radio--card")).toBeInTheDocument();
    const radio = screen.getByRole("radio", { name: "Option A" });
    await user.click(radio);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(radio).toBeChecked();
  });

  it("applies the required state", () => {
    render(<Radio aria-label="Option A" required />);

    expect(screen.getByRole("radio", { name: "Option A" })).toBeRequired();
  });

  it("supports controlled selection within a group", async () => {
    const user = userEvent.setup();
    function Group() {
      const [value, setValue] = useState("a");
      return (
        <>
          <Radio name="g" label="Option A" value="a" checked={value === "a"} onChange={(e) => setValue(e.target.value)} />
          <Radio name="g" label="Option B" value="b" checked={value === "b"} onChange={(e) => setValue(e.target.value)} />
        </>
      );
    }
    render(<Group />);

    await user.click(screen.getByRole("radio", { name: "Option B" }));

    expect(screen.getByRole("radio", { name: "Option B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Option A" })).not.toBeChecked();
  });
});
