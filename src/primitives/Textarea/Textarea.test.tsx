import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("exposes an accessible label via a visible label or aria-label", () => {
    const { rerender } = render(<Textarea label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();

    rerender(<Textarea aria-label="Notes" />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("updates the value on change (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" />);

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("hello");
  });

  it("supports a controlled value with onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("");
      return <Textarea aria-label="Notes" value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    await user.type(textarea, "hi");

    expect(textarea).toHaveValue("hi");
  });

  it("associates the hint with the textarea", () => {
    render(<Textarea aria-label="Notes" hint="Keep it brief" />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAccessibleDescription(/Keep it brief/);
  });

  it("associates the error and marks the field invalid", () => {
    render(<Textarea aria-label="Notes" error="Please enter a value" />);

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription(/Please enter a value/);
  });

  it("does not update when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Notes" disabled onChange={onChange} />);

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    await user.type(textarea, "hello");

    expect(textarea).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the character count only when enabled", () => {
    const { rerender } = render(<Textarea aria-label="Notes" defaultValue="ab" maxLength={100} />);
    expect(screen.queryByText("2 / 100")).not.toBeInTheDocument();

    rerender(<Textarea aria-label="Notes" defaultValue="ab" maxLength={100} showCount />);
    expect(screen.getByText("2 / 100")).toBeInTheDocument();
  });

  it("reflects the current value length in the character count", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" showCount maxLength={100} />);

    expect(screen.getByText("0 / 100")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Notes" }), "abc");
    expect(screen.getByText("3 / 100")).toBeInTheDocument();
  });

  it("applies maxLength to the textarea", () => {
    render(<Textarea aria-label="Notes" maxLength={5} />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute("maxlength", "5");
  });

  it("renders without requiring any copy of its own", () => {
    const { container } = render(<Textarea aria-label="Notes" />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
    expect(container).toHaveTextContent("");
  });
});
