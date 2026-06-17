import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChartView } from "./Component";

const makeSegments = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `segment-${index + 1}`,
    label: `Segment ${index + 1}`,
    value: index + 1,
  }));

const meta = {
  title: "Patterns/PieChartView",
  component: PieChartView,
  tags: ["autodocs"],
  args: {
    label: "Segment share",
    segments: [
      { id: "segment-a", label: "Segment A", value: 40 },
      { id: "segment-b", label: "Segment B", value: 35 },
      { id: "segment-c", label: "Segment C", value: 25 },
    ],
  },
} satisfies Meta<typeof PieChartView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    segments: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    segments: [],
    showEmptyState: true,
  },
};

export const HideMeaninglessSegments: Story = {
  args: {
    segments: [
      { id: "visible", label: "Segment A", value: 12 },
      { id: "zero", label: "Segment B", value: 0 },
      { id: "hidden", label: "Segment C", value: 18, hidden: true },
      { id: "blank", label: " ", value: 6 },
    ],
  },
};

export const TwentyItems: Story = {
  args: {
    segments: makeSegments(20),
  },
};

export const TwentyOneItemsWithSearch: Story = {
  args: {
    segments: makeSegments(21),
  },
};

export const LegendHidden: Story = {
  args: {
    showLegend: false,
  },
};
