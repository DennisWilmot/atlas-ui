import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ActivityFeedItem } from "./Component";
import { ActivityFeed } from "./Component";

const makeItems = (count: number): ActivityFeedItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `activity-${index + 1}`,
    source: `Source ${index + 1}`,
    summary: `Record ${index + 1} changed`,
    description: index % 2 === 0 ? "State moved to Alpha" : "State moved to Beta",
    timestamp: `Step ${index + 1}`,
  }));

describe("ActivityFeed", () => {
  it("returns null for empty items by default", () => {
    const { container } = render(<ActivityFeed items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when every item is hidden or meaningless", () => {
    const { container } = render(
      <ActivityFeed
        items={[
          { id: "empty", summary: " ", fields: [{ key: "blank", label: "Blank", value: "" }] },
          { id: "hidden", hidden: true, summary: "Hidden record" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<ActivityFeed items={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders search for twenty one meaningful items", () => {
    render(<ActivityFeed items={makeItems(21)} />);

    expect(screen.getByLabelText("Activity feed search")).toBeInTheDocument();
  });

  it("does not render search at the twenty item threshold", () => {
    render(<ActivityFeed items={makeItems(20)} />);

    expect(screen.queryByLabelText("Activity feed search")).not.toBeInTheDocument();
  });

  it("does not count hidden or meaningless items toward overflow", () => {
    render(
      <ActivityFeed
        items={[
          ...makeItems(20),
          { id: "empty", summary: " " },
          { id: "hidden", hidden: true, summary: "Hidden record" },
        ]}
      />,
    );

    expect(screen.queryByLabelText("Activity feed search")).not.toBeInTheDocument();
  });

  it("filters overflow items by the supplied search query", async () => {
    const user = userEvent.setup();

    render(<ActivityFeed items={makeItems(21)} />);

    await user.type(screen.getByLabelText("Activity feed search"), "Record 21");

    expect(screen.getByText("Record 21 changed")).toBeInTheDocument();
    expect(screen.queryByText("Record 1 changed")).not.toBeInTheDocument();
  });

  it("uses supplied search text for non-string content", async () => {
    const user = userEvent.setup();

    render(
      <ActivityFeed
        items={[
          ...makeItems(20),
          {
            id: "custom-node",
            summary: <span aria-label="custom record" />,
            searchText: "Alpha target",
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText("Activity feed search"), "Alpha target");

    expect(screen.getByLabelText("custom record")).toBeInTheDocument();
    expect(screen.queryByText("Record 1 changed")).not.toBeInTheDocument();
  });

  it("emits injected item actions and hides hidden actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const item = {
      ...makeItems(1)[0],
      actions: [
        { id: "inspect", label: "Inspect" },
        { id: "internal", label: "Internal", hidden: true },
      ],
    };

    render(<ActivityFeed items={[item]} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Inspect" }));

    expect(onAction).toHaveBeenCalledWith("inspect", item);
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("does not render item actions when read only", () => {
    render(<ActivityFeed items={[{ ...makeItems(1)[0], actions: [{ id: "inspect", label: "Inspect" }] }]} readOnly />);

    expect(screen.queryByRole("button", { name: "Inspect" })).not.toBeInTheDocument();
  });
});
