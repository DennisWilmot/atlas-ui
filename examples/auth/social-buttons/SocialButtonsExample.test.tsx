import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SocialButtonsExample } from "./SocialButtonsExample";

const actions = [
  { id: "provider-a", label: "Continue with Provider A", icon: "A" },
  { id: "provider-b", label: "Continue with Provider B", icon: "B" },
];

describe("SocialButtonsExample", () => {
  it("renders neutral provider actions through props", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(<SocialButtonsExample actions={actions} onAction={handleAction} />);

    expect(screen.getByRole("group", { name: "Identity provider access" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Continue with Provider A" }));

    expect(handleAction).toHaveBeenCalledWith("provider-a");
  });

  it("hides blank and hidden actions", () => {
    render(
      <SocialButtonsExample
        actions={[
          ...actions,
          { id: "blank", label: " " },
          { id: "hidden", hidden: true, label: "Hidden provider" },
        ]}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Hidden provider" })).not.toBeInTheDocument();
  });

  it("disables all actions when the example is disabled", () => {
    render(<SocialButtonsExample actions={actions} disabled />);

    expect(screen.getByRole("button", { name: "Continue with Provider A" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Continue with Provider B" })).toBeDisabled();
  });

  it("returns null when no visible actions exist", () => {
    const { container } = render(<SocialButtonsExample actions={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
