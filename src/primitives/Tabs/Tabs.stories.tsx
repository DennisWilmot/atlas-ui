import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const items = [
  { id: "item-a", label: "Item A", content: <p>Panel A</p> },
  { id: "item-b", label: "Item B", content: <p>Panel B</p> },
  { id: "item-c", label: "Item C", content: <p>Panel C</p> },
];

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    items,
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledTab: Story = {
  args: {
    items: [
      { id: "item-a", label: "Item A", content: <p>Panel A</p> },
      { id: "item-b", label: "Item B", content: <p>Panel B</p>, disabled: true },
    ],
  },
};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};
