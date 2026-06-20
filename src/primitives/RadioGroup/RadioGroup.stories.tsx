import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RadioGroup, type RadioGroupItem } from "./RadioGroup";

const items: RadioGroupItem[] = [
  { id: "a", value: "a", label: "Option A" },
  { id: "b", value: "b", label: "Option B" },
  { id: "c", value: "c", label: "Option C" },
];

const describedItems: RadioGroupItem[] = [
  { id: "a", value: "a", label: "Option A", description: "Supporting detail for A" },
  { id: "b", value: "b", label: "Option B", description: "Supporting detail for B" },
  { id: "c", value: "c", label: "Option C", description: "Supporting detail for C" },
];

const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    items,
    label: "Choose one",
    orientation: "vertical",
    variant: "default",
    disabled: false,
    required: false,
    defaultValue: "a",
  },
  argTypes: {
    items: { control: "object" },
    label: { control: "text", description: "Group label. Provide this or an aria-label." },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    variant: { control: "inline-radio", options: ["default", "card"] },
    disabled: { control: "boolean", description: "Disables every option." },
    required: { control: "boolean" },
    defaultValue: { control: "text" },
  },
  parameters: {
    controls: { include: ["items", "label", "orientation", "variant", "disabled", "required", "defaultValue"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "26rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
};

export const Card: Story = {
  args: { variant: "card", items: describedItems },
};

export const DisabledGroup: Story = {
  args: { disabled: true },
};

export const DisabledItem: Story = {
  args: {
    items: [
      { id: "a", value: "a", label: "Option A" },
      { id: "b", value: "b", label: "Option B", disabled: true },
      { id: "c", value: "c", label: "Option C" },
    ],
  },
};

export const Required: Story = {
  args: { required: true, defaultValue: undefined },
};

// URA Law 4: with no items the group renders nothing.
export const EmptyHidden: Story = {
  args: { items: [] },
};

// URA Law 4: with no accessible group name, the group renders nothing.
export const NoGroupNameHidden: Story = {
  args: { label: undefined },
};

export const ControlledExample: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("a");
    return <RadioGroup items={items} label="Choose one" value={value} onValueChange={setValue} />;
  },
};

export const UncontrolledExample: Story = {
  render: () => <RadioGroup items={items} label="Choose one" defaultValue="b" />,
};
