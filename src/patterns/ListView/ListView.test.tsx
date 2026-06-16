import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListView } from "./ListView";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

describe("ListView", () => {
  it("returns null for empty items by default", () => {
    const { container } = render(<ListView items={[]} renderItem={(item) => String(item)} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<ListView items={[]} renderItem={(item) => String(item)} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders search for twenty one items", () => {
    render(<ListView items={makeItems(21)} renderItem={(item) => item.label} />);

    expect(screen.getByLabelText("Items search")).toBeInTheDocument();
  });
});
