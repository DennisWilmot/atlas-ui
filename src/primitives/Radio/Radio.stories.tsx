import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Radio } from "./Radio";

const meta = {
  title: "Primitives/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: {
    label: "Option A",
    variant: "default",
    disabled: false,
    required: false,
  },
  argTypes: {
    label: { control: "text", description: "Visible label. Provide this or an aria-label." },
    description: { control: "text", description: "Optional supporting text, associated via aria-describedby." },
    variant: {
      control: "inline-radio",
      options: ["default", "card"],
      description: "card wraps the radio in a selectable card while keeping native radio semantics.",
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  parameters: {
    controls: { include: ["label", "description", "variant", "disabled", "required"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "20rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Card: Story = {
  args: { variant: "card", description: "Supporting detail for this option" },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithDescription: Story = {
  args: { description: "Supporting detail for this option" },
};

export const Required: Story = {
  args: { required: true },
};

export const ControlledExample: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("a");
    return (
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Radio name="controlled" label="Option A" value="a" checked={value === "a"} onChange={(e) => setValue(e.target.value)} />
        <Radio name="controlled" label="Option B" value="b" checked={value === "b"} onChange={(e) => setValue(e.target.value)} />
      </div>
    );
  },
};

export const UncontrolledExample: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <Radio name="uncontrolled" label="Option A" value="a" defaultChecked />
      <Radio name="uncontrolled" label="Option B" value="b" />
    </div>
  ),
};
