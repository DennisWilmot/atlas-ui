import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator } from "./LoadingIndicator";

describe("LoadingIndicator", () => {
  it("renders nothing when inactive", () => {
    const { container } = render(<LoadingIndicator active={false} label="Loading" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when active without a meaningful label", () => {
    const { container, rerender } = render(<LoadingIndicator variant="skeleton" />);

    expect(container).toBeEmptyDOMElement();

    rerender(<LoadingIndicator variant="spinner" label=" " />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a spinner with an accessible status", () => {
    render(<LoadingIndicator variant="spinner" label="Loading" />);

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("Loading");
  });

  it("renders a skeleton with supplied loading copy", () => {
    const { container } = render(<LoadingIndicator variant="skeleton" label="Loading" />);

    expect(container.querySelector(".atlas-loading__skeleton")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("keeps a visually hidden label when hideLabelVisually is enabled", () => {
    render(<LoadingIndicator label="Loading" hideLabelVisually />);

    const label = screen.getByText("Loading");
    expect(label).toHaveClass("atlas-visually-hidden");
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });
});
