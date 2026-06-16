import type { Meta, StoryObj } from "@storybook/react-vite";
import type { HealthItem } from "../../types";
import { CollapsibleHealth } from "./CollapsibleHealth";

const healthyItems: HealthItem[] = [
  { id: "item-a", label: "Item A", status: "healthy" },
  { id: "item-b", label: "Item B", status: "healthy" },
];

const attentionItems: HealthItem[] = [
  {
    id: "item-a",
    label: "Item A",
    status: "degraded",
    description: "Requires review",
    actions: [{ id: "open", label: "Open", intent: "primary" }],
  },
  {
    id: "item-b",
    label: "Item B",
    status: "pending",
    description: "Waiting for input",
    actions: [{ id: "review", label: "Review" }],
  },
];

const attentionItemsWithoutActions = attentionItems.map(({ id, label, status, description }) => ({
  id,
  label,
  status,
  description,
}));

const makeAttentionItems = (count: number): HealthItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    status: index % 2 === 0 ? "degraded" : "pending",
    actions: [{ id: "open", label: "Open" }],
  }));

const meta = {
  title: "Patterns/CollapsibleHealth",
  component: CollapsibleHealth,
  tags: ["autodocs"],
  args: {
    items: healthyItems,
  },
} satisfies Meta<typeof CollapsibleHealth>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    items: [],
    showEmptyState: true,
  },
};

export const DegradedAndPending: Story = {
  args: {
    items: attentionItems,
  },
};

export const Collapsed: Story = {
  args: {
    defaultExpanded: false,
    items: attentionItems,
  },
};

export const TwentyOneItemsWithSearch: Story = {
  args: {
    items: makeAttentionItems(21),
  },
};

export const NoActions: Story = {
  args: {
    items: attentionItemsWithoutActions,
  },
};

export const ReadOnly: Story = {
  args: {
    items: attentionItems,
    readOnly: true,
  },
};

export const DisabledAction: Story = {
  args: {
    items: [
      {
        id: "item-a",
        label: "Item A",
        status: "degraded",
        actions: [{ id: "flag", label: "Flag", intent: "danger", disabled: true }],
      },
    ],
  },
};
