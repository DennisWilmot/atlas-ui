import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from "./DropdownMenu";

const items = [
  { id: "item-a", label: "Item A" },
  { id: "item-b", label: "Item B" },
];

const meta = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  args: {
    items,
    onSelect: () => undefined,
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledItem: Story = {
  args: {
    items: [
      { id: "item-a", label: "Item A" },
      { id: "item-b", label: "Item B", disabled: true },
    ],
  },
};

export const HiddenItem: Story = {
  args: {
    items: [
      { id: "item-a", label: "Item A" },
      { id: "item-b", label: "Item B", hidden: true },
    ],
  },
};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};
