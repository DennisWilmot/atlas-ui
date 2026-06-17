import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VerificationCodeInput } from "./Component";

describe("VerificationCodeInput", () => {
  it("returns null when length is not meaningful", () => {
    const { container } = render(<VerificationCodeInput length={0} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an accessible group with one textbox per character", () => {
    render(<VerificationCodeInput label="Code" length={4} />);

    expect(screen.getByRole("group", { name: "Code" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByRole("textbox", { name: "Code character 1" })).toBeInTheDocument();
  });

  it("updates value and advances focus as characters are typed", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<VerificationCodeInput label="Code" length={4} onChange={onChange} />);

    const inputs = screen.getAllByRole("textbox");
    await user.click(inputs[0]);
    await user.keyboard("12");

    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("12");
  });

  it("fills available slots from pasted text and reports completion", () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();

    render(
      <VerificationCodeInput
        label="Code"
        length={4}
        onChange={onChange}
        onComplete={onComplete}
      />,
    );

    fireEvent.paste(screen.getByRole("textbox", { name: "Code character 1" }), {
      clipboardData: { getData: () => "1234" },
    });

    expect(onChange).toHaveBeenCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("uses supplied character rules without hardcoded app validation", () => {
    const onChange = vi.fn();

    render(
      <VerificationCodeInput
        isCharacterAllowed={(character) => /[0-9]/.test(character)}
        label="Code"
        length={4}
        onChange={onChange}
      />,
    );

    fireEvent.paste(screen.getByRole("textbox", { name: "Code character 1" }), {
      clipboardData: { getData: () => "A1B2" },
    });

    expect(onChange).toHaveBeenCalledWith("12");
  });

  it("supports disabled and read-only slots", () => {
    const { rerender } = render(<VerificationCodeInput disabled length={2} />);

    expect(screen.getAllByRole("textbox")[0]).toBeDisabled();

    rerender(<VerificationCodeInput length={2} readOnly />);

    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("readonly");
  });
});
