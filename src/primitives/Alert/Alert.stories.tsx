import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    title: "Item A",
    description: "Optional supporting text",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const SuccessAutoDismiss: Story = {
  args: {
    autoDismissMs: 5000,
    tone: "success",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
  },
};

export const WithActions: Story = {
  args: {
    actions: [
      { id: "action-a", label: "Action A" },
      { id: "action-b", label: "Action B", intent: "danger" },
    ],
    onAction: () => undefined,
  },
};

export const NoActions: Story = {
  args: {
    actions: [],
  },
};
