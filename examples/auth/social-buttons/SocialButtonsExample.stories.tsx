import type { Meta, StoryObj } from "@storybook/react-vite";
import "./SocialButtonsExample.css";
import { SocialButtonsExample } from "./SocialButtonsExample";

const neutralActions = [
  {
    id: "provider-a",
    label: "Continue with Provider A",
    icon: "A",
  },
  {
    id: "provider-b",
    label: "Continue with Provider B",
    icon: "B",
  },
];

const meta = {
  title: "Examples/Auth/SocialButtons",
  component: SocialButtonsExample,
  tags: ["autodocs"],
} satisfies Meta<typeof SocialButtonsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: neutralActions,
  },
};

export const Disabled: Story = {
  args: {
    actions: neutralActions,
    disabled: true,
  },
};

export const OneUnavailable: Story = {
  args: {
    actions: neutralActions.map((action) =>
      action.id === "provider-b" ? { ...action, disabled: true } : action,
    ),
  },
};

export const HiddenWhenMeaningless: Story = {
  args: {
    actions: [],
  },
};
