import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders badge text", () => {
    render(<Badge>Status</Badge>);

    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("supports the dot affordance", () => {
    const { container } = render(<Badge dot>Status</Badge>);

    expect(container.querySelector(".atlas-badge__dot")).toBeInTheDocument();
  });

  it("supports an icon slot", () => {
    render(<Badge icon={<span data-testid="badge-icon" />}>Status</Badge>);

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });
});
