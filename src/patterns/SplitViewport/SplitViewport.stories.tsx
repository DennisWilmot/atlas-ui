import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitViewport } from "./SplitViewport";

const slots = [
  {
    id: "alpha",
    label: "Alpha",
    content: <div>Alpha content</div>,
    predictionScore: 2,
  },
  {
    id: "beta",
    label: "Beta",
    content: <div>Beta content</div>,
    predictionScore: 8,
  },
  {
    id: "gamma",
    label: "Gamma",
    content: <div>Gamma content</div>,
    predictionScore: 4,
  },
];

const meta = {
  title: "Patterns/SplitViewport",
  component: SplitViewport,
  tags: ["autodocs"],
  args: {
    slots,
  },
} satisfies Meta<typeof SplitViewport>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RequestedPrimary: Story = {
  args: {
    primarySlotId: "alpha",
  },
};

export const EmptyHidden: Story = {
  args: {
    slots: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    slots: [],
    showEmptyState: true,
  },
};

export const HiddenAndNullSlots: Story = {
  args: {
    slots: [
      ...slots,
      { id: "delta", label: "Delta", content: null, predictionScore: 12 },
      { id: "epsilon", label: "Epsilon", content: <div>Epsilon content</div>, hidden: true },
    ],
  },
};

export const SingleSlot: Story = {
  args: {
    slots: [slots[0]],
  },
};
