import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressIndicator } from "./ProgressIndicator";

const meta = {
  title: "Primitives/ProgressIndicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  args: {
    value: 60,
    min: 0,
    max: 100,
    indeterminate: false,
    hideLabel: false,
  },
  argTypes: {
    value: { control: { type: "number" }, description: "Current value (determinate mode)." },
    min: { control: { type: "number" }, description: "Minimum value. Default 0." },
    max: { control: { type: "number" }, description: "Maximum value. Default 100." },
    indeterminate: {
      control: "boolean",
      description: "When true, omits aria-valuenow and animates the bar.",
    },
    label: { control: "text", description: "Optional accessible label naming the progress bar." },
    hideLabel: {
      control: "boolean",
      description: "Keep the label for assistive tech but hide it visually.",
    },
    valueText: {
      control: "text",
      description: 'Human-friendly text announced for the value (e.g. "60%"), via aria-valuetext.',
    },
  },
  parameters: {
    controls: {
      include: ["value", "min", "max", "indeterminate", "label", "hideLabel", "valueText"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Determinate: Story = {
  args: { value: 60 },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Loading" },
};

export const Labeled: Story = {
  args: { value: 40, label: "Uploading" },
};

export const VisuallyHiddenLabel: Story = {
  args: { value: 40, label: "Uploading", hideLabel: true },
};

export const WithValueText: Story = {
  args: { value: 60, label: "Uploading", valueText: "60%" },
};
