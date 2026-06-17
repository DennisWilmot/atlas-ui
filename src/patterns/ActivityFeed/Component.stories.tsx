import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ActivityFeedItem } from "./Component";
import { ActivityFeed } from "./Component";

const makeItems = (count: number): ActivityFeedItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `activity-${index + 1}`,
    source: `Source ${index + 1}`,
    summary: `Record ${index + 1} changed`,
    description: index % 2 === 0 ? "State moved to Alpha" : "State moved to Beta",
    timestamp: `Step ${index + 1}`,
    fields: [
      {
        key: "state",
        label: "State",
        value: index % 2 === 0 ? "Alpha" : "Beta",
      },
    ],
  }));

const meta = {
  title: "Patterns/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
  args: {
    items: makeItems(4),
  },
} satisfies Meta<typeof ActivityFeed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};

export const MeaninglessHidden: Story = {
  args: {
    items: [
      {
        id: "blank",
        summary: " ",
        fields: [{ key: "empty", label: "Empty", value: "" }],
      },
      {
        id: "hidden",
        hidden: true,
        summary: "Hidden record",
      },
    ],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    items: [],
    showEmptyState: true,
  },
};

export const TwentyItems: Story = {
  args: {
    items: makeItems(20),
  },
};

export const TwentyOneItemsWithSearch: Story = {
  args: {
    items: makeItems(21),
  },
};

export const WithActions: Story = {
  args: {
    items: [
      {
        ...makeItems(1)[0],
        actions: [{ id: "inspect", label: "Inspect" }],
      },
    ],
  },
};

export const NoActions: Story = {
  args: {
    items: makeItems(3),
  },
};

export const DisabledAction: Story = {
  args: {
    items: [
      {
        ...makeItems(1)[0],
        actions: [{ id: "inspect", label: "Inspect", disabled: true }],
      },
    ],
  },
};

export const ReadOnly: Story = {
  args: {
    items: [
      {
        ...makeItems(1)[0],
        actions: [{ id: "inspect", label: "Inspect" }],
      },
    ],
    readOnly: true,
  },
};
