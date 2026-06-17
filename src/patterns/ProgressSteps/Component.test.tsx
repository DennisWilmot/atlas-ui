import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ProgressStep } from "../../types";
import { ProgressSteps } from "./Component";

const makeSteps = (count: number): ProgressStep[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `step-${index + 1}`,
    label: `Step ${index + 1}`,
    state: index === 0 ? "current" : "upcoming",
  }));

const steps: ProgressStep[] = [
  { id: "step-a", label: "Step A", state: "complete" },
  {
    id: "step-b",
    label: "Step B",
    state: "current",
    actions: [{ id: "advance", label: "Advance", intent: "primary" }],
  },
  { id: "step-c", label: "Step C", state: "upcoming" },
];

describe("ProgressSteps", () => {
  it("returns null for empty steps by default", () => {
    const { container } = render(<ProgressSteps steps={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<ProgressSteps steps={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders visible steps and marks the current step", () => {
    render(<ProgressSteps steps={steps} />);

    expect(screen.getByText("Step A")).toBeInTheDocument();
    expect(screen.getByText("Step B")).toBeInTheDocument();
    expect(screen.getByText("Step C")).toBeInTheDocument();
    expect(screen.getByText("Step B").closest(".atlas-progress-step")).toHaveAttribute("aria-current", "step");
  });

  it("filters hidden and meaningless steps", () => {
    render(
      <ProgressSteps
        steps={[
          { id: "step-a", label: "Step A", state: "complete", hidden: true },
          { id: "step-b", label: " ", state: "current" },
          { id: "step-c", label: "Step C", state: "upcoming" },
        ]}
      />,
    );

    expect(screen.queryByText("Step A")).not.toBeInTheDocument();
    expect(screen.getByText("Step C")).toBeInTheDocument();
  });

  it("returns null when every step is meaningless", () => {
    const { container } = render(
      <ProgressSteps
        steps={[
          { id: "step-a", label: "Step A", state: "complete", hidden: true },
          { id: "step-b", label: " ", state: "current" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders search and pagination for twenty one steps", () => {
    render(<ProgressSteps steps={makeSteps(21)} />);

    expect(screen.getByLabelText("Progress steps search")).toBeInTheDocument();
    expect(screen.getByLabelText("Progress steps pagination")).toBeInTheDocument();
  });

  it("hides actions when read only", () => {
    render(<ProgressSteps steps={steps} readOnly />);

    expect(screen.queryByRole("button", { name: "Advance" })).not.toBeInTheDocument();
  });

  it("does not render hidden actions", () => {
    render(
      <ProgressSteps
        steps={[
          {
            id: "step-a",
            label: "Step A",
            state: "current",
            actions: [{ id: "internal", label: "Internal", hidden: true }],
          },
        ]}
      />,
    );

    expect(screen.queryByRole("group", { name: "Step A actions" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("calls onAction with the action and step identifiers", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(<ProgressSteps steps={steps} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Advance" }));

    expect(onAction).toHaveBeenCalledWith("advance", "step-b");
  });

  it("keeps disabled actions disabled", () => {
    render(
      <ProgressSteps
        steps={[
          {
            id: "step-a",
            label: "Step A",
            state: "blocked",
            actions: [{ id: "retry", label: "Retry", disabled: true }],
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeDisabled();
  });
});
