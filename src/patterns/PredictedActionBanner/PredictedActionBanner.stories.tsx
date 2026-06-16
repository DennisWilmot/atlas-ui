import type { Meta, StoryObj } from "@storybook/react-vite";
import { PredictedActionBanner } from "./PredictedActionBanner";

const meta = {
  title: "Patterns/PredictedActionBanner",
  component: PredictedActionBanner,
  tags: ["autodocs"],
  args: {
    actions: [
      { frequency: 4, item: { id: "alpha", label: "Alpha", intent: "primary" } },
      { item: { id: "beta", label: "Beta" }, occurrence: 2 },
      { item: { id: "gamma", label: "Gamma" }, recency: 1 },
    ],
  },
} satisfies Meta<typeof PredictedActionBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContext: Story = {
  args: {
    description: "Frequency and recency favor Alpha.",
    label: "Current signals",
  },
};

export const EmptyHidden: Story = {
  args: {
    actions: [],
  },
};

export const PlainActionsHidden: Story = {
  args: {
    actions: [{ item: { id: "alpha", label: "Alpha" } }],
  },
};

export const PendingAction: Story = {
  args: {
    actions: [{ item: { id: "alpha", label: "Alpha" }, pending: true }],
  },
};

export const RankedByMetadata: Story = {
  args: {
    actions: [
      { frequency: 1, item: { id: "alpha", label: "Alpha" } },
      { item: { id: "beta", label: "Beta" }, occurrence: 4 },
      { item: { id: "gamma", label: "Gamma" }, recency: 8 },
    ],
    maxActions: 2,
  },
};

export const DisabledAction: Story = {
  args: {
    actions: [{ frequency: 3, item: { disabled: true, id: "alpha", label: "Alpha" } }],
  },
};
