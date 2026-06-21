import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./Component";

describe("DatePicker", () => {
  it("renders a date trigger with the selected value", () => {
    render(<DatePicker label="Start date" value="2026-02-14" />);

    expect(screen.getByRole("button", { name: /Start date/ })).toHaveTextContent("Feb 14, 2026");
  });

  it("returns null when explicitly hidden", () => {
    const { container } = render(<DatePicker hidden label="Date" />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when bounds cannot produce a meaningful date range", () => {
    const { container } = render(<DatePicker max="2026-01-01" min="2026-12-31" />);

    expect(container.firstChild).toBeNull();
  });

  it("opens a modal overlay and emits date changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker label="Date" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /Date/ }));
    fireEvent.change(screen.getByLabelText("Date", { selector: "input" }), {
      target: { value: "2026-03-10" },
    });

    expect(onChange).toHaveBeenCalledWith("2026-03-10");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses the requested overlay mode", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Date" mode="drawer" />);

    await user.click(screen.getByRole("button", { name: /Date/ }));

    expect(screen.getByRole("dialog")).toHaveClass("atlas-date-picker__overlay--drawer");
  });

  it("disables interaction when read only", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Date" readOnly value="2026-02-14" />);

    const trigger = screen.getByRole("button", { name: /Date/ });

    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves focus into the dialog and closes on escape", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Date" />);

    const trigger = screen.getByRole("button", { name: /Date/ });
    await user.click(trigger);

    const input = screen.getByLabelText("Date", { selector: "input" });
    expect(input).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
