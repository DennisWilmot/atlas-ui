import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    label: "Item A",
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
    onCheckedChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithDescription: Story = {
  args: {
    description: "Optional supporting text",
  },
};

export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Toggle label="Item A" labelPosition="start" />
      <Toggle label="Item B" labelPosition="end" />
    </div>
  ),
};
