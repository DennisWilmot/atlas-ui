import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelectView } from "./Component";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

const meta = {
  title: "Patterns/MultiSelectView",
  component: MultiSelectView,
  tags: ["autodocs"],
  args: {
    items: makeItems(4),
    label: "Select items",
    value: ["item-2"],
  },
} satisfies Meta<typeof MultiSelectView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    items: [],
    value: [],
  },
};

export const MeaninglessItemsHidden: Story = {
  args: {
    items: [
      { id: "", label: "Item A" },
      { id: "item-b", label: "" },
    ],
    value: [],
  },
};

export const TenItems: Story = {
  args: {
    items: makeItems(10),
    value: ["item-1", "item-3"],
  },
};

export const ElevenItemsSearchable: Story = {
  args: {
    items: makeItems(11),
    value: ["item-2"],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: ["item-1", "item-2"],
  },
};
