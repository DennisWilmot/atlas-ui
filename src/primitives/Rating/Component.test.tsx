import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rating } from "./Component";

describe("Rating", () => {
  it("renders a rating with an accessible label", () => {
    const { container } = render(<Rating label="Rating" showValue value={3.5} />);

    expect(screen.getByRole("img", { name: "Rating: 3.5 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("3.5/5")).toBeInTheDocument();
    expect(container.querySelectorAll(".atlas-rating__star")).toHaveLength(5);
  });

  it("returns null when the value is missing", () => {
    const { container } = render(<Rating value={undefined} />);

    expect(container.firstChild).toBeNull();
  });

  it("hides zero by default", () => {
    const { container } = render(<Rating value={0} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders zero when showZero is true", () => {
    render(<Rating showValue showZero value={0} />);

    expect(screen.getByRole("img", { name: "0 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });

  it("clamps values above the maximum", () => {
    render(<Rating showValue value={8} />);

    expect(screen.getByRole("img", { name: "5 out of 5" })).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("supports an explicit accessible label", () => {
    render(<Rating aria-label="Current rating" value={4} />);

    expect(screen.getByRole("img", { name: "Current rating" })).toBeInTheDocument();
  });
});
