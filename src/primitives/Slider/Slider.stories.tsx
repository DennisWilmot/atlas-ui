import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Slider, type SliderValue } from "./Slider";

const meta = {
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    label: "Volume",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    disabled: false,
    showValue: false,
    showMinMaxLabels: false,
  },
  argTypes: {
    label: { control: "text", description: "Visible label. Provide this or an aria-label." },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    range: { control: "boolean", description: "Two handles for a [min, max] range value." },
    disabled: { control: "boolean" },
    showValue: { control: "boolean", description: "Show the current value." },
    showMinMaxLabels: { control: "boolean", description: "Show the min and max at the ends." },
    hideLabelVisually: { control: "boolean" },
  },
  parameters: {
    controls: {
      include: ["label", "min", "max", "step", "range", "disabled", "showValue", "showMinMaxLabels", "hideLabelVisually"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "24rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleValue: Story = {};

export const Range: Story = {
  args: { range: true, defaultValue: [25, 75], showValue: true },
};

export const Steps: Story = {
  args: { step: 10, showValue: true, showMinMaxLabels: true },
};

export const Labeled: Story = {
  args: { label: "Volume" },
};

export const VisuallyHiddenLabel: Story = {
  args: { label: "Volume", hideLabelVisually: true },
};

export const ValueDisplay: Story = {
  args: { showValue: true },
};

export const MinMaxLabels: Story = {
  args: { showMinMaxLabels: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// URA Law 4: a single slider with no accessible name renders nothing.
export const NoAccessibleNameHidden: Story = {
  args: { label: undefined },
};

export const ControlledExample: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState<SliderValue>(60);
    return <Slider label="Volume" value={value} onValueChange={setValue} showValue />;
  },
};

export const UncontrolledExample: Story = {
  render: () => <Slider label="Volume" defaultValue={30} showValue />,
};
