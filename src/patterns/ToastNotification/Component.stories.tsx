import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastNotification } from "./Component";

const meta = {
  title: "Patterns/ToastNotification",
  component: ToastNotification,
  tags: ["autodocs"],
  args: {
    toast: {
      id: "item-a",
      title: "Item A",
      message: "Item A changed.",
      tone: "info",
    },
  },
} satisfies Meta<typeof ToastNotification>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    toast: {
      id: "item-a",
      title: "Item A",
      message: "Item A changed.",
      tone: "success",
      actions: [
        { id: "alpha", label: "Alpha", intent: "primary" },
        { id: "beta", label: "Beta" },
      ],
    },
  },
};

export const NoActions: Story = {
  args: {
    toast: {
      id: "item-a",
      message: "Item A changed.",
      tone: "neutral",
    },
  },
};

export const EmptyHidden: Story = {
  args: {
    toast: null,
  },
};

export const MeaninglessHidden: Story = {
  args: {
    toast: {
      id: "item-a",
      message: " ",
      title: "",
    },
  },
};

export const Attention: Story = {
  args: {
    toast: {
      id: "item-a",
      title: "Item A",
      message: "Item A needs attention.",
      tone: "warning",
    },
  },
};

export const Dismissible: Story = {
  args: {
    onDismiss: () => undefined,
    toast: {
      id: "item-a",
      message: "Item A changed.",
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    toast: {
      id: "item-a",
      title: "Item A",
      message: "Item A changed.",
      actions: [{ id: "alpha", label: "Alpha" }],
    },
  },
};
