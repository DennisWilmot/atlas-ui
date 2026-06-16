import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldView } from "./FieldView";

describe("FieldView", () => {
  it("returns null when all fields are empty", () => {
    const { container } = render(
      <FieldView
        fields={[
          { key: "empty-a", label: "Field A", value: "" },
          { key: "empty-b", label: "Field B", value: null },
          { key: "empty-c", label: "Field C", value: undefined },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders explicit empty state when requested", () => {
    render(<FieldView fields={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders shape-specific field values", () => {
    render(
      <FieldView
        fields={[
          { key: "count", label: "Count", value: 12, shape: "number" },
          { key: "date", label: "Date", value: "2026-06-16", shape: "date" },
          { key: "status", label: "Status", value: "active", shape: "status" },
          { key: "currency", label: "Amount", value: 129, shape: "currency" },
        ]}
      />,
    );

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("$129")).toBeInTheDocument();
  });

  it("hides only empty fields by default", () => {
    render(
      <FieldView
        fields={[
          { key: "visible", label: "Visible", value: "Alpha", shape: "text" },
          { key: "hidden", label: "Hidden", value: "" },
        ]}
      />,
    );

    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("treats whitespace, empty arrays, and empty avatars as meaningless", () => {
    const { container } = render(
      <FieldView
        fields={[
          { key: "space", label: "Space", value: "   " },
          { key: "array", label: "Array", value: ["", null] },
          { key: "avatar", label: "Avatar", value: { src: "" }, shape: "avatar" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
