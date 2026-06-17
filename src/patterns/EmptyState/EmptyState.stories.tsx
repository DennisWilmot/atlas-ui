import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No matching items",
    description: "Adjust the input or choose an action.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HiddenWhenMeaningless: Story = {
  args: {
    actions: [{ id: "hidden", label: "Hidden", hidden: true }],
    description: "",
    title: "",
  },
};

export const WithActions: Story = {
  args: {
    actions: [
      { id: "alpha", label: "Alpha", intent: "primary" },
      { id: "beta", label: "Beta" },
    ],
  },
};

export const NoActions: Story = {
  args: {
    actions: [],
  },
};

export const DisabledAction: Story = {
  args: {
    actions: [{ id: "alpha", label: "Alpha", disabled: true }],
  },
};
