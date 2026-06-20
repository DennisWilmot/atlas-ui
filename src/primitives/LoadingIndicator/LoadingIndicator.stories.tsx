import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingIndicator } from "./LoadingIndicator";

const meta = {
  title: "Primitives/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  args: {
    variant: "spinner",
    size: "md",
    label: "Loading",
    hideLabelVisually: false,
    active: true,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["spinner", "skeleton"],
      description: "spinner: active waiting states. skeleton: initial loading only.",
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    label: { control: "text", description: "Text announced by screen readers (and shown unless hidden)." },
    hideLabelVisually: {
      control: "boolean",
      description: "Keep the label for assistive tech but hide it visually.",
    },
    active: { control: "boolean", description: "When false, renders nothing." },
  },
  parameters: {
    controls: { include: ["variant", "size", "label", "hideLabelVisually", "active"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Spinner: Story = {
  args: { variant: "spinner", label: "Loading" },
};

export const Skeleton: Story = {
  args: { variant: "skeleton", label: "Loading", hideLabelVisually: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <LoadingIndicator size="xs" label="Loading" hideLabelVisually />
      <LoadingIndicator size="sm" label="Loading" hideLabelVisually />
      <LoadingIndicator size="md" label="Loading" hideLabelVisually />
      <LoadingIndicator size="lg" label="Loading" hideLabelVisually />
    </div>
  ),
};

export const VisuallyHiddenLabel: Story = {
  args: { variant: "spinner", label: "Loading", hideLabelVisually: true },
};

// active=false renders nothing.
export const InactiveHidden: Story = {
  args: { active: false, label: "Loading" },
};

// URA Law 4: active with no accessible loading text renders nothing.
export const NoLabelHidden: Story = {
  args: { label: "" },
};
