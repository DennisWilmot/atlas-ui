import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageListView, type MessageListItem } from "./Component";

const makeMessages = (count: number): MessageListItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `message-${index + 1}`,
    title: `Message ${index + 1}`,
    body: `Content ${index + 1}`,
    source: `Source ${index + 1}`,
    timestamp: `T${index + 1}`,
  }));

const meta = {
  title: "Patterns/MessageListView",
  component: MessageListView,
  tags: ["autodocs"],
  args: {
    messages: makeMessages(3),
  },
} satisfies Meta<typeof MessageListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    messages: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    messages: [],
    showEmptyState: true,
  },
};

export const HiddenAndMeaningless: Story = {
  args: {
    messages: [
      { id: "hidden", title: "Hidden", hidden: true },
      { id: "empty", title: " ", body: null },
    ],
  },
};

export const TwentyItems: Story = {
  args: {
    messages: makeMessages(20),
  },
};

export const TwentyOneItemsWithSearch: Story = {
  args: {
    messages: makeMessages(21),
  },
};

export const WithActions: Story = {
  args: {
    messages: [
      {
        id: "message-a",
        title: "Message A",
        body: "Content A",
        source: "Source A",
        actions: [
          { id: "open", label: "Open" },
          { id: "acknowledge", label: "Acknowledge", intent: "primary" },
          { id: "internal", label: "Internal", hidden: true },
        ],
      },
    ],
  },
};

export const NoActions: Story = {
  args: {
    messages: [{ id: "message-a", title: "Message A", body: "Content A" }],
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    messages: [
      {
        id: "message-a",
        title: "Message A",
        body: "Content A",
        actions: [{ id: "open", label: "Open" }],
      },
    ],
  },
};
