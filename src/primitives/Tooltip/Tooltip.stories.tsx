import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    children: <Button variant="secondary">Item A</Button>,
    content: "Supporting detail",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Tooltip content="Top detail" placement="top"><Button variant="secondary">Top</Button></Tooltip>
      <Tooltip content="Right detail" placement="right"><Button variant="secondary">Right</Button></Tooltip>
      <Tooltip content="Bottom detail" placement="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
      <Tooltip content="Left detail" placement="left"><Button variant="secondary">Left</Button></Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
