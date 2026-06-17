import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarNavigation } from "./Component";
import type { SidebarNavigationItem } from "../../types";

const makeItems = (count: number): SidebarNavigationItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    description: index < 3 ? `Group ${index + 1}` : undefined,
  }));

const items: SidebarNavigationItem[] = [
  {
    id: "item-a",
    label: "Item A",
    current: true,
    description: "Primary area",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "item-b",
    label: "Item B",
    children: [
      { id: "item-b-1", label: "Nested item" },
      { id: "item-b-2", label: "Hidden item", hidden: true },
    ],
  },
  {
    id: "item-c",
    label: "Item C",
    disabled: true,
  },
];

const itemsWithoutActions: SidebarNavigationItem[] = items.map((item) => ({
  ...item,
  actions: [],
}));

const nestedOverflowItems: SidebarNavigationItem[] = [
  {
    id: "group",
    label: "Group",
    children: makeItems(21),
  },
];

const meta = {
  title: "Patterns/SidebarNavigation",
  component: SidebarNavigation,
  tags: ["autodocs"],
  args: {
    ariaLabel: "Sections",
    items,
  },
} satisfies Meta<typeof SidebarNavigation>;

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

export const NestedOverflowWithSearch: Story = {
  args: {
    items: nestedOverflowItems,
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
  },
};

export const WithoutActions: Story = {
  args: {
    items: itemsWithoutActions,
  },
};
