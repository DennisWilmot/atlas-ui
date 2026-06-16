import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionMenu } from "./ActionMenu";

const meta = {
  title: "Patterns/ActionMenu",
  component: ActionMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof ActionMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoActions: Story = {
  args: {
    actions: [],
  },
};

export const VisibleActions: Story = {
  args: {
    actions: [
      { id: "open", label: "Open", intent: "primary" },
      { id: "share", label: "Share" },
      { id: "archive", label: "Archive" },
    ],
  },
};

export const HiddenAction: Story = {
  args: {
    actions: [
      { id: "open", label: "Open" },
      { id: "internal", label: "Internal", hidden: true },
    ],
  },
};

export const DisabledDangerousAction: Story = {
  args: {
    actions: [
      { id: "flag", label: "Flag", intent: "danger", disabled: true },
      { id: "review", label: "Review" },
    ],
  },
};
