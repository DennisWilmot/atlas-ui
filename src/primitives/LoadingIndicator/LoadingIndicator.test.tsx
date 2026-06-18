import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingIndicator } from "./LoadingIndicator";

describe("LoadingIndicator", () => {
  it("renders nothing when inactive", () => {
    const { container } = render(<LoadingIndicator active={false} label="Loading" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a spinner with an accessible status", () => {
    render(<LoadingIndicator variant="spinner" label="Loading" />);

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("Loading");
  });

  it("renders a skeleton with no hardcoded copy of its own", () => {
    const { container } = render(<LoadingIndicator variant="skeleton" />);

    expect(container.querySelector(".atlas-loading__skeleton")).toBeInTheDocument();
    // No label supplied, so the component contributes no text of its own.
    expect(container).toHaveTextContent("");
  });

  it("keeps a visually hidden label when hideLabelVisually is enabled", () => {
    render(<LoadingIndicator label="Loading" hideLabelVisually />);

    const label = screen.getByText("Loading");
    expect(label).toHaveClass("atlas-visually-hidden");
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });
});
