import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeGroup, type BadgeGroupItem } from "./BadgeGroup";

const items: BadgeGroupItem[] = [
  { id: "a", label: "Alpha", variant: "neutral" },
  { id: "b", label: "Beta", variant: "success" },
  { id: "c", label: "Gamma", variant: "warning" },
  { id: "d", label: "Delta", variant: "info" },
  { id: "e", label: "Epsilon", variant: "danger" },
  { id: "f", label: "Zeta", variant: "neutral" },
  { id: "g", label: "Eta", variant: "success" },
];

const meta = {
  title: "Primitives/BadgeGroup",
  component: BadgeGroup,
  tags: ["autodocs"],
  args: {
    items: items.slice(0, 4),
  },
  argTypes: {
    items: { control: "object" },
    maxVisible: { control: { type: "number", min: 0 } },
  },
  parameters: {
    controls: { include: ["items", "maxVisible"] },
  },
} satisfies Meta<typeof BadgeGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
  args: {
    items,
    maxVisible: 3,
  },
};

// URA Law 4: with no visible badges the group renders nothing.
export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};
