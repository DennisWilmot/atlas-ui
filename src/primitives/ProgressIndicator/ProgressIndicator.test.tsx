import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressIndicator } from "./ProgressIndicator";

describe("ProgressIndicator", () => {
  it("has a progressbar role", () => {
    render(<ProgressIndicator value={40} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("exposes value, min, and max attributes in determinate mode", () => {
    render(<ProgressIndicator value={3} min={0} max={10} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
  });

  it("clamps the value into the min/max range", () => {
    render(<ProgressIndicator value={150} min={0} max={100} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("applies valueText as aria-valuetext in determinate mode", () => {
    render(<ProgressIndicator value={60} valueText="60%" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "60%");
  });

  it("omits aria-valuetext when indeterminate", () => {
    render(<ProgressIndicator indeterminate valueText="busy" />);

    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuetext");
  });

  it("omits aria-valuenow and flags itself when indeterminate", () => {
    render(<ProgressIndicator indeterminate />);
    const bar = screen.getByRole("progressbar");

    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-indeterminate", "true");
  });

  it("names the bar with the label, optionally hidden visually", () => {
    const { rerender } = render(<ProgressIndicator value={40} label="Uploading" />);
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toBeInTheDocument();

    rerender(<ProgressIndicator value={40} label="Uploading" hideLabel />);
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toBeInTheDocument();
    expect(screen.getByText("Uploading")).toHaveClass("atlas-visually-hidden");
  });

  it("ignores labels without meaningful content", () => {
    const { container } = render(<ProgressIndicator value={40} label=" " />);

    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-labelledby");
    expect(container.querySelector(".atlas-progress__label")).not.toBeInTheDocument();
  });
});
