import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders nothing when there is no content", () => {
    const { container } = render(<Tag>{""}</Tag>);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the label content", () => {
    render(<Tag>Label</Tag>);

    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("renders the remove button only when onRemove is provided", () => {
    const { rerender } = render(<Tag>Label</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    rerender(<Tag onRemove={() => {}}>Label</Tag>);
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("fires onRemove when the remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Label</Tag>);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("applies the tone class and attribute", () => {
    const { container } = render(<Tag tone="success">Label</Tag>);

    expect(container.firstChild).toHaveClass("atlas-tag--success");
    expect(container.firstChild).toHaveAttribute("data-tone", "success");
  });
});
