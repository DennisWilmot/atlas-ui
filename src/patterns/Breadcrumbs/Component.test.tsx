import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumbs } from "./Component";

describe("Breadcrumbs", () => {
  it("returns null when fewer than two meaningful items exist", () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { id: "empty", label: " " },
          { id: "hidden", label: "Hidden", hidden: true },
          { id: "alpha", label: "Alpha" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders a semantic breadcrumb trail and marks the last item current by default", () => {
    render(
      <Breadcrumbs
        items={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta" },
          { id: "gamma", label: "Gamma" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Gamma").closest(".atlas-breadcrumbs__link")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("trims labels before rendering meaningful items", () => {
    render(
      <Breadcrumbs
        items={[
          { id: "alpha", label: " Alpha " },
          { id: "beta", label: " Beta " },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByText("Beta")).toHaveTextContent("Beta");
  });

  it("uses an explicitly current item when supplied", () => {
    render(
      <Breadcrumbs
        items={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta", current: true },
          { id: "gamma", label: "Gamma" },
        ]}
      />,
    );

    expect(screen.getByText("Beta").closest(".atlas-breadcrumbs__link")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Gamma" })).toBeInTheDocument();
  });

  it("calls onNavigate only for enabled non-current items", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(
      <Breadcrumbs
        items={[
          { id: "alpha", label: "Alpha" },
          { id: "beta", label: "Beta", disabled: true },
          { id: "gamma", label: "Gamma" },
        ]}
        onNavigate={onNavigate}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alpha" }));
    await user.click(screen.getByText("Beta"));
    await user.click(screen.getByText("Gamma"));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("alpha");
  });

  it("renders app-supplied hrefs without inventing routes", () => {
    render(
      <Breadcrumbs
        items={[
          { id: "alpha", label: "Alpha", href: "#alpha" },
          { id: "beta", label: "Beta" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Alpha" })).toHaveAttribute("href", "#alpha");
  });
});
