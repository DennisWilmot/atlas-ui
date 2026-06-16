import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Filter } from "../../types";
import { FilterBar } from "./FilterBar";

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));

const filters: Filter[] = [
  {
    id: "filter-a",
    label: "Filter A",
    items: makeItems(4),
  },
  {
    id: "filter-b",
    label: "Filter B",
    items: makeItems(3),
  },
];

const meta = {
  title: "Patterns/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  args: {
    filters,
  },
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    filters: [],
  },
};

export const HiddenAndEmptyFilters: Story = {
  args: {
    filters: [
      {
        id: "empty",
        label: "Empty",
        items: [],
      },
      {
        id: "hidden",
        label: "Hidden",
        hidden: true,
        items: makeItems(3),
      },
    ],
  },
};

export const TenOptions: Story = {
  args: {
    filters: [
      {
        id: "filter-a",
        label: "Filter A",
        items: makeItems(10),
      },
    ],
  },
};

export const ElevenOptionsSearchable: Story = {
  args: {
    filters: [
      {
        id: "filter-a",
        label: "Filter A",
        items: makeItems(11),
      },
    ],
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
