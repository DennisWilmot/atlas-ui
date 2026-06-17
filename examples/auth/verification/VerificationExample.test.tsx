import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerificationExample } from "./VerificationExample";

describe("VerificationExample", () => {
  it("renders neutral verification content", () => {
    render(
      <VerificationExample
        actions={[{ id: "continue", label: "Continue", variant: "primary" }]}
        codeField={{
          hint: "Use the latest code from your selected delivery method.",
          label: "Verification code",
        }}
        description="Enter the single-use code to continue."
        status={{ label: "Code required", variant: "info" }}
        title="Verify access"
      />,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Verify access" })).toBeInTheDocument();
    expect(screen.getByLabelText("Verification code")).toHaveAttribute("autocomplete", "one-time-code");
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("returns null when there is no meaningful content", () => {
    const { container } = render(<VerificationExample />);

    expect(container).toBeEmptyDOMElement();
  });
});
