import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CalendarEvent } from "../../types";
import { CalendarView } from "./Component";

const makeEvents = (count: number): CalendarEvent[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `event-${index + 1}`,
    label: `Event ${index + 1}`,
    start: `2026-06-${String((index % 28) + 1).padStart(2, "0")}T09:00:00`,
    end: `2026-06-${String((index % 28) + 1).padStart(2, "0")}T10:00:00`,
  }));

describe("CalendarView", () => {
  it("returns null for empty events by default", () => {
    const { container } = render(<CalendarView events={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<CalendarView events={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("hides events with meaningless labels or invalid start dates", () => {
    const { container } = render(
      <CalendarView
        events={[
          { id: "blank", label: " ", start: "2026-06-01" },
          { id: "invalid", label: "Invalid", start: "not-a-date" },
        ]}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders search and pagination for twenty one events", () => {
    render(<CalendarView events={makeEvents(21)} mode="agenda" />);

    expect(screen.getByLabelText("Calendar search")).toBeInTheDocument();
    expect(screen.getByLabelText("Calendar pagination")).toBeInTheDocument();
  });

  it("labels month views from the visible date", () => {
    render(<CalendarView events={makeEvents(1)} locale="en-US" visibleDate="2026-06-01" />);

    expect(screen.getByRole("heading", { name: "June 2026" })).toBeInTheDocument();
  });

  it("does not render hidden event actions", () => {
    render(
      <CalendarView
        events={makeEvents(1)}
        actions={[
          { id: "open", label: "Open" },
          { id: "internal", label: "Internal", hidden: true },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("does not render event actions when read only", () => {
    render(<CalendarView events={makeEvents(1)} actions={[{ id: "open", label: "Open" }]} readOnly />);

    expect(screen.queryByRole("button", { name: "Open" })).not.toBeInTheDocument();
  });

  it("calls event selection with the selected event", async () => {
    const user = userEvent.setup();
    const onEventSelect = vi.fn();

    render(<CalendarView events={makeEvents(1)} mode="agenda" onEventSelect={onEventSelect} />);

    await user.click(screen.getByRole("button", { name: /Event 1/ }));

    expect(onEventSelect).toHaveBeenCalledWith("event-1", expect.objectContaining({ id: "event-1" }));
  });
});
