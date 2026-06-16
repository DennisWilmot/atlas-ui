import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListView } from "./ListView";

type Item = {
  id: string;
  label: string;
};

const makeItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

const meta = {
  title: "Patterns/ListView",
  component: ListView<Item>,
  tags: ["autodocs"],
  args: {
    items: makeItems(3),
    renderItem: (item) => <span>{item.label}</span>,
    getItemKey: (item) => item.id,
  },
} satisfies Meta<typeof ListView<Item>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    items: [],
    showEmptyState: true,
  },
};

export const TwentyItems: Story = {
  args: {
    items: makeItems(20),
  },
};

export const TwentyOneItemsWithSearch: Story = {
  args: {
    items: makeItems(21),
  },
};
