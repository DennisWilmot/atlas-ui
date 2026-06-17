import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CalendarEvent } from "../../types";
import { CalendarView } from "./Component";

const makeEvents = (count: number): CalendarEvent[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `event-${index + 1}`,
    label: `Event ${index + 1}`,
    start: `2026-06-${String((index % 28) + 1).padStart(2, "0")}T09:00:00`,
    end: `2026-06-${String((index % 28) + 1).padStart(2, "0")}T10:00:00`,
  }));

const meta = {
  title: "Patterns/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
  args: {
    events: makeEvents(6),
    visibleDate: "2026-06-01",
  },
} satisfies Meta<typeof CalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WeekView: Story = {
  args: {
    mode: "week",
  },
};

export const AgendaView: Story = {
  args: {
    mode: "agenda",
  },
};

export const EmptyHidden: Story = {
  args: {
    events: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    events: [],
    showEmptyState: true,
  },
};

export const TwentyEvents: Story = {
  args: {
    events: makeEvents(20),
  },
};

export const TwentyOneEventsWithSearch: Story = {
  args: {
    events: makeEvents(21),
    mode: "agenda",
  },
};

export const WithActions: Story = {
  args: {
    actions: [{ id: "open", label: "Open", intent: "primary" }],
  },
};

export const ReadOnly: Story = {
  args: {
    actions: [{ id: "open", label: "Open" }],
    readOnly: true,
  },
};
