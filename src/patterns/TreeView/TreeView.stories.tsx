import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeView } from "./TreeView";

const nodes = [
  {
    id: "node-a",
    label: "Node A",
    children: [
      { id: "node-a-1", label: "Node A1" },
      { id: "node-a-2", label: "Node A2" },
    ],
  },
  { id: "node-b", label: "Node B" },
];

const meta = {
  title: "Patterns/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  args: {
    defaultExpandedIds: ["node-a"],
    nodes,
    onExpandedChange: () => undefined,
    onSelect: () => undefined,
  },
} satisfies Meta<typeof TreeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Nested: Story = {
  args: {
    nodes: [
      {
        id: "node-a",
        label: "Node A",
        children: [
          {
            id: "node-a-1",
            label: "Node A1",
            children: [{ id: "node-a-1-a", label: "Node A1A" }],
          },
        ],
      },
    ],
    defaultExpandedIds: ["node-a", "node-a-1"],
  },
};

export const DisabledNode: Story = {
  args: {
    nodes: [
      { id: "node-a", label: "Node A", disabled: true },
      { id: "node-b", label: "Node B" },
    ],
  },
};

export const HiddenNode: Story = {
  args: {
    nodes: [
      { id: "node-a", label: "Node A" },
      { id: "node-b", label: "Node B", hidden: true },
    ],
  },
};

export const EmptyHidden: Story = {
  args: {
    nodes: [],
  },
};
