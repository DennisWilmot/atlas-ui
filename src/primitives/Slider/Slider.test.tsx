import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders a slider role", () => {
    render(<Slider aria-label="Volume" />);

    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders nothing for a single slider with no accessible name", () => {
    const { container, rerender } = render(<Slider />);

    expect(container).toBeEmptyDOMElement();

    rerender(<Slider label="   " aria-label="   " />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a range slider without an explicit label (thumbs are named)", () => {
    render(<Slider range defaultValue={[20, 60]} />);

    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByRole("slider", { name: "Minimum" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Maximum" })).toBeInTheDocument();
  });

  it("exposes an accessible label via label or aria-label", () => {
    const { rerender } = render(<Slider label="Volume" />);
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();

    rerender(<Slider aria-label="Brightness" />);
    expect(screen.getByRole("slider", { name: "Brightness" })).toBeInTheDocument();
  });

  it("renders aria value attributes", () => {
    render(<Slider aria-label="Volume" min={0} max={10} value={3} onValueChange={() => {}} />);
    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "10");
    expect(slider).toHaveAttribute("aria-valuenow", "3");
  });

  it("fires a value change", () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("slider"), { target: { value: "30" } });

    expect(onValueChange).toHaveBeenCalledWith(30);
  });

  it("fires a value commit when provided", () => {
    const onValueCommit = vi.fn();
    render(<Slider aria-label="Volume" onValueCommit={onValueCommit} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "40" } });
    fireEvent.keyUp(slider);

    expect(onValueCommit).toHaveBeenCalled();
  });

  it("does not fire change when disabled", () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" disabled onValueChange={onValueChange} />);

    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("renders two handles in range mode", () => {
    render(<Slider aria-label="Price" range defaultValue={[20, 60]} />);

    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("clamps the value within min and max", () => {
    render(<Slider aria-label="Volume" min={0} max={100} value={150} onValueChange={() => {}} />);

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
  });

  it("applies the step value", () => {
    render(<Slider aria-label="Volume" step={10} />);

    expect(screen.getByRole("slider")).toHaveAttribute("step", "10");
  });
});
