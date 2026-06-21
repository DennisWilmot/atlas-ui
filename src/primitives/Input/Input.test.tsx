import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with an accessible label", () => {
    render(<Input label="Field label" />);

    expect(screen.getByLabelText("Field label")).toBeInTheDocument();
  });

  it("connects hint text to the input", () => {
    render(<Input label="Field label" hint="Helpful context." />);

    expect(screen.getByLabelText("Field label")).toHaveAccessibleDescription("Helpful context.");
  });

  it("marks the input invalid when an error exists", () => {
    render(<Input label="Field label" error="Enter a valid value." />);

    expect(screen.getByLabelText("Field label")).toHaveAttribute("aria-invalid", "true");
  });

  it("replaces hint text with the error description", () => {
    render(<Input label="Field label" hint="Helpful context." error="Enter a valid value." />);

    expect(screen.queryByText("Helpful context.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Field label")).toHaveAccessibleDescription("Enter a valid value.");
  });
});
