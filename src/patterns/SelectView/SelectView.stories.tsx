import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectView } from "./SelectView";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

const meta = {
  title: "Patterns/SelectView",
  component: SelectView,
  tags: ["autodocs"],
  args: {
    items: makeItems(3),
    label: "Select item",
  },
} satisfies Meta<typeof SelectView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const OneItem: Story = {
  args: {
    items: makeItems(1),
  },
};

export const TenItems: Story = {
  args: {
    items: makeItems(10),
  },
};

export const ElevenItemsSearchable: Story = {
  args: {
    items: makeItems(11),
  },
};
