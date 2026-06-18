import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedIcon } from "./FeaturedIcon";

describe("FeaturedIcon", () => {
  it("renders the provided icon", () => {
    render(<FeaturedIcon icon={<svg data-testid="icon" />} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("is decorative: hidden from assistive tech by default", () => {
    const { container } = render(<FeaturedIcon icon={<svg data-testid="icon" />} />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing when no icon is provided", () => {
    const { container } = render(<FeaturedIcon />);

    expect(container).toBeEmptyDOMElement();
  });

  it("applies size and tone modifier classes", () => {
    const { container } = render(
      <FeaturedIcon icon={<svg data-testid="icon" />} size="lg" tone="success" />,
    );

    expect(container.firstChild).toHaveClass("atlas-featured-icon--lg");
    expect(container.firstChild).toHaveClass("atlas-featured-icon--success");
  });
});
