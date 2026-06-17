import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextEditor } from "./Component";

describe("TextEditor", () => {
  it("returns null when no meaningful editor surface exists", () => {
    const { container } = render(<TextEditor />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when explicitly hidden", () => {
    const { container } = render(<TextEditor hidden label="Text" placeholder="Enter text" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders a labelled text area and emits text changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TextEditor label="Text" onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Text" }), "Alpha");

    expect(onChange).toHaveBeenLastCalledWith("Alpha");
  });

  it("renders visible toolbar actions and emits selected action ids", async () => {
    const user = userEvent.setup();
    const onToolbarAction = vi.fn();

    render(
      <TextEditor
        label="Text"
        onToolbarAction={onToolbarAction}
        toolbarActions={[
          { id: "strong", label: "Strong" },
          { id: "internal", label: "Internal", hidden: true },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Strong" }));

    expect(onToolbarAction).toHaveBeenCalledWith("strong");
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("keeps toolbar actions visible but disabled while the editor is disabled", async () => {
    const user = userEvent.setup();
    const onToolbarAction = vi.fn();

    render(
      <TextEditor
        disabled
        label="Text"
        onToolbarAction={onToolbarAction}
        placeholder="Enter text"
        toolbarActions={[{ id: "strong", label: "Strong" }]}
      />,
    );

    const toolbarAction = screen.getByRole("button", { name: "Strong" });

    expect(toolbarAction).toBeDisabled();

    await user.click(toolbarAction);

    expect(onToolbarAction).not.toHaveBeenCalled();
  });

  it("suppresses toolbar actions while read only", () => {
    render(
      <TextEditor
        label="Text"
        readOnly
        toolbarActions={[{ id: "strong", label: "Strong" }]}
        value="Alpha"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Text" })).toHaveAttribute("readonly");
    expect(screen.queryByRole("button", { name: "Strong" })).not.toBeInTheDocument();
  });

  it("supports disabled editor state", () => {
    render(<TextEditor disabled label="Text" placeholder="Enter text" />);

    expect(screen.getByRole("textbox", { name: "Text" })).toBeDisabled();
  });

  it("merges supplied and generated description references", () => {
    render(
      <TextEditor
        aria-describedby="external-description"
        description="Format note"
        label="Text"
        value="Alpha"
      />,
    );

    const descriptionId = screen.getByText("Format note").id;

    expect(screen.getByRole("textbox", { name: "Text" })).toHaveAttribute(
      "aria-describedby",
      `${descriptionId} external-description`,
    );
  });
});
