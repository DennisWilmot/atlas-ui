import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ForgotPasswordExample } from "./ForgotPasswordExample";

describe("ForgotPasswordExample", () => {
  it("renders the reset request state without links or account data", () => {
    render(
      <ForgotPasswordExample
        actions={[
          { id: "send-reset", label: "Send reset instructions", type: "submit", variant: "primary" },
          { id: "back", label: "Back to sign in", variant: "ghost" },
        ]}
        description="Enter the email address for the account. If it matches an account, reset instructions will be sent."
        eyebrow="Account access"
        fields={[{ autoComplete: "email", label: "Email address", name: "email", type: "email" }]}
        title="Reset your password"
      />,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reset your password" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByRole("button", { name: "Send reset instructions" })).toHaveAttribute("type", "submit");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the password update state with neutral password fields", () => {
    render(
      <ForgotPasswordExample
        actions={[{ id: "update-password", label: "Update password", type: "submit", variant: "primary" }]}
        fields={[
          { autoComplete: "new-password", label: "New password", name: "new-password", type: "password" },
          { autoComplete: "new-password", label: "Confirm password", name: "confirm-password", type: "password" },
        ]}
        title="Choose a new password"
      />,
    );

    expect(screen.getByLabelText("New password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByRole("button", { name: "Update password" })).toBeInTheDocument();
  });

  it("returns null when there is no meaningful content", () => {
    const { container } = render(<ForgotPasswordExample />);

    expect(container).toBeEmptyDOMElement();
  });
});
