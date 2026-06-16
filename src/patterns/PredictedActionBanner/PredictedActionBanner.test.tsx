import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PredictedActionBanner } from "./PredictedActionBanner";

describe("PredictedActionBanner", () => {
  it("returns null when no predicted or pending action exists", () => {
    const { container } = render(
      <PredictedActionBanner
        actions={[
          { item: { id: "plain", label: "Plain" } },
          { frequency: 10, item: { id: "hidden", label: "Hidden", hidden: true } },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders a pending action without a positive prediction score", () => {
    render(
      <PredictedActionBanner
        actions={[{ item: { id: "pending", label: "Pending" }, pending: true }]}
      />,
    );

    expect(screen.getByRole("region", { name: "Predicted actions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pending" })).toBeInTheDocument();
  });

  it("ranks visible actions by prediction metadata and applies maxActions", () => {
    render(
      <PredictedActionBanner
        actions={[
          { frequency: 2, item: { id: "alpha", label: "Alpha" } },
          { item: { id: "plain", label: "Plain" } },
          { item: { id: "gamma", label: "Gamma" }, recency: 8 },
          { item: { id: "beta", label: "Beta" }, occurrence: 5 },
        ]}
        maxActions={2}
      />,
    );

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Gamma",
      "Beta",
    ]);
    expect(screen.queryByRole("button", { name: "Alpha" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Plain" })).not.toBeInTheDocument();
  });

  it("passes the selected action id to onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <PredictedActionBanner
        actions={[{ frequency: 1, item: { id: "alpha", label: "Alpha" } }]}
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Alpha" }));

    expect(onAction).toHaveBeenCalledWith("alpha");
  });
});
