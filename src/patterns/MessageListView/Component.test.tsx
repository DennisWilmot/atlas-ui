import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MessageListView, type MessageListItem } from "./Component";

const makeMessages = (count: number): MessageListItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `message-${index + 1}`,
    title: `Message ${index + 1}`,
    body: `Content ${index + 1}`,
    source: `Source ${index + 1}`,
    timestamp: `T${index + 1}`,
  }));

describe("MessageListView", () => {
  it("returns null for empty messages by default", () => {
    const { container } = render(<MessageListView messages={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when messages are hidden or meaningless", () => {
    const { container } = render(
      <MessageListView
        messages={[
          { id: "hidden", title: "Hidden", hidden: true },
          { id: "empty", title: " ", body: null },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<MessageListView messages={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("renders search for twenty one meaningful messages", () => {
    render(<MessageListView messages={makeMessages(21)} />);

    expect(screen.getByLabelText("Messages search")).toBeInTheDocument();
  });

  it("filters overflow messages by searchable text", async () => {
    const user = userEvent.setup();

    render(<MessageListView messages={makeMessages(21)} />);

    await user.type(screen.getByLabelText("Messages search"), "Content 21");

    expect(screen.getByText("Message 21")).toBeInTheDocument();
    expect(screen.queryByText("Message 1")).not.toBeInTheDocument();
  });

  it("keeps boolean field metadata because false is meaningful data", () => {
    render(
      <MessageListView
        messages={[
          {
            id: "message-a",
            title: "Message A",
            metadata: [{ key: "flag", label: "Flag", value: false }],
          },
        ]}
      />,
    );

    expect(screen.getByText("Flag")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("renders injected actions and reports the message", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const message = {
      id: "message-a",
      title: "Message A",
      actions: [
        { id: "open", label: "Open" },
        { id: "internal", label: "Internal", hidden: true },
      ],
    };

    render(<MessageListView messages={[message]} onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(onAction).toHaveBeenCalledWith("open", message);
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("does not render action surfaces when no visible actions exist", () => {
    render(<MessageListView messages={[{ id: "message-a", title: "Message A", actions: [] }]} />);

    expect(screen.queryByLabelText("Message A actions")).not.toBeInTheDocument();
  });

  it("hides actions in read-only mode", () => {
    render(
      <MessageListView
        readOnly
        messages={[{ id: "message-a", title: "Message A", actions: [{ id: "open", label: "Open" }] }]}
      />,
    );

    expect(screen.queryByRole("button", { name: "Open" })).not.toBeInTheDocument();
  });
});
