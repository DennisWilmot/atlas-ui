import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "./Component";

describe("ColorPicker", () => {
  it("renders with an accessible label", () => {
    render(<ColorPicker label="Color" defaultValue="#2563eb" />);

    expect(screen.getByLabelText("Color")).toBeInTheDocument();
  });

  it("connects hint text to the color input", () => {
    render(<ColorPicker label="Color" hint="Use a hex color." />);

    expect(screen.getByLabelText("Color")).toHaveAccessibleDescription("Use a hex color.");
  });

  it("marks the color input invalid when an error exists", () => {
    render(<ColorPicker label="Color" error="Choose a valid color." />);

    expect(screen.getByLabelText("Color")).toHaveAttribute("aria-invalid", "true");
  });

  it("calls onChange when the native color input changes", () => {
    const handleChange = vi.fn();
    render(<ColorPicker label="Color" defaultValue="#111827" onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText("Color"), { target: { value: "#2563eb" } });

    expect(handleChange).toHaveBeenCalledWith(
      "#2563eb",
      expect.objectContaining({ source: "input" }),
    );
    expect(screen.getByText("#2563eb")).toBeInTheDocument();
  });

  it("renders swatches and selects one through prop-driven options", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ColorPicker
        label="Color"
        defaultValue="#111827"
        onChange={handleChange}
        swatches={[
          { value: "#111827", label: "Alpha" },
          { value: "#2563eb", label: "Beta" },
        ]}
      />,
    );

    const alpha = screen.getByRole("button", { name: "Alpha" });
    const beta = screen.getByRole("button", { name: "Beta" });

    expect(alpha).toHaveAttribute("aria-pressed", "true");
    expect(beta).toHaveAttribute("aria-pressed", "false");

    await user.click(beta);

    expect(handleChange).toHaveBeenCalledWith(
      "#2563eb",
      expect.objectContaining({
        source: "swatch",
        swatch: { value: "#2563eb", label: "Beta" },
      }),
    );
    expect(beta).toHaveAttribute("aria-pressed", "true");
  });

  it("hides the optional swatch surface when no swatches are supplied", () => {
    const { container } = render(<ColorPicker label="Color" swatches={[]} />);

    expect(container.querySelector(".atlas-color-picker__swatches")).toBeNull();
  });

  it("disables color input and swatches when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ColorPicker
        disabled
        label="Color"
        onChange={handleChange}
        swatches={[{ value: "#111827", label: "Alpha" }]}
      />,
    );

    expect(screen.getByLabelText("Color")).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("prevents swatch changes when read only", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ColorPicker
        label="Color"
        onChange={handleChange}
        readOnly
        swatches={[{ value: "#111827", label: "Alpha" }]}
      />,
    );

    expect(screen.getByLabelText("Color")).toHaveAttribute("aria-readonly", "true");
    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(handleChange).not.toHaveBeenCalled();
  });
});
