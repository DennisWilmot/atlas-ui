import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SlideoutPanel } from "./Component";

describe("SlideoutPanel", () => {
  it("returns null when the panel is closed", () => {
    const { container } = render(
      <SlideoutPanel open={false} title="Details">
        Content
      </SlideoutPanel>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when the open panel has no meaningful content", () => {
    const { container } = render(
      <SlideoutPanel
        actions={[{ id: "hidden", label: "Hidden", hidden: true }]}
        open
        sections={[
          { id: "alpha", title: "", content: null },
          { id: "beta", title: "Beta", content: "Beta content", hidden: true },
        ]}
        title=""
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders an accessible drawer with injected actions and sections", () => {
    const onAction = vi.fn();
    const onSectionAction = vi.fn();

    render(
      <SlideoutPanel
        actions={[
          { id: "open", label: "Open" },
          { id: "hidden", label: "Hidden", hidden: true },
        ]}
        onAction={onAction}
        onSectionAction={onSectionAction}
        open
        sections={[
          {
            id: "alpha",
            title: "Alpha",
            content: <p>Alpha content</p>,
            actions: [{ id: "inspect", label: "Inspect" }],
          },
        ]}
        title="Details"
      />,
    );

    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("Alpha content")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hidden" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));

    expect(onAction).toHaveBeenCalledWith("open");
    expect(onSectionAction).toHaveBeenCalledWith("inspect", "alpha");
  });

  it("hides injected actions when readOnly is true", () => {
    render(
      <SlideoutPanel
        actions={[{ id: "approve", label: "Approve" }]}
        open
        readOnly
        sections={[
          {
            id: "alpha",
            content: "Alpha content",
            actions: [{ id: "inspect", label: "Inspect" }],
          },
        ]}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Panel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Inspect" })).not.toBeInTheDocument();
  });

  it("renders meaningful content without an action surface when no actions are visible", () => {
    render(
      <SlideoutPanel
        actions={[{ id: "hidden", label: "Hidden", hidden: true }]}
        open
        title="Details"
      >
        Content
      </SlideoutPanel>,
    );

    expect(screen.getByRole("dialog", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Panel actions" })).not.toBeInTheDocument();
  });

  it("does not execute disabled actions", () => {
    const onAction = vi.fn();

    render(
      <SlideoutPanel
        actions={[{ id: "flag", label: "Flag", disabled: true }]}
        onAction={onAction}
        open
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flag" }));

    expect(onAction).not.toHaveBeenCalled();
  });

  it("calls onClose from close controls and Escape", () => {
    const onClose = vi.fn();

    render(
      <SlideoutPanel onClose={onClose} open title="Details">
        Content
      </SlideoutPanel>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Close panel" }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("applies mode and placement metadata", () => {
    render(
      <SlideoutPanel mode="sheet" open placement="top" title="Details">
        Content
      </SlideoutPanel>,
    );

    const root = screen.getByRole("dialog", { name: "Details" }).parentElement;

    expect(root).toHaveAttribute("data-mode", "sheet");
    expect(root).toHaveAttribute("data-placement", "top");
  });
});
