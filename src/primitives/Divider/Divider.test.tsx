import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders nothing when hidden", () => {
    const { container } = render(<Divider hidden />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a horizontal divider by default", () => {
    const { container } = render(<Divider />);

    expect(container.querySelector(".atlas-divider--horizontal")).toBeInTheDocument();
  });

  it("renders a vertical divider", () => {
    const { container } = render(<Divider orientation="vertical" />);

    expect(container.querySelector(".atlas-divider--vertical")).toBeInTheDocument();
  });

  it("exposes separator semantics when not decorative", () => {
    render(<Divider orientation="vertical" />);

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("is hidden from assistive tech when decorative", () => {
    const { container } = render(<Divider decorative />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a label when provided", () => {
    render(<Divider label="Section" />);

    expect(screen.getByText("Section")).toBeInTheDocument();
  });
});
