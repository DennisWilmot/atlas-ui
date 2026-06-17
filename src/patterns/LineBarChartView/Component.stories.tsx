import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineBarChartView } from "./Component";
import type { LineBarChartSeries } from "../../types";

const defaultSeries: LineBarChartSeries[] = [
  {
    id: "series-a",
    label: "Series A",
    type: "bar",
    points: [
      { id: "point-a", label: "Point A", value: 12 },
      { id: "point-b", label: "Point B", value: 18 },
      { id: "point-c", label: "Point C", value: 10 },
    ],
  },
  {
    id: "series-b",
    label: "Series B",
    type: "line",
    points: [
      { id: "point-a", label: "Point A", value: 10 },
      { id: "point-b", label: "Point B", value: 16 },
      { id: "point-c", label: "Point C", value: 14 },
    ],
  },
];

const meta = {
  title: "Patterns/LineBarChartView",
  component: LineBarChartView,
  tags: ["autodocs"],
  args: {
    label: "Line bar chart",
    series: defaultSeries,
  },
} satisfies Meta<typeof LineBarChartView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    series: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    series: [],
    showEmptyState: true,
  },
};

export const MeaninglessHidden: Story = {
  args: {
    series: [
      {
        id: "series-a",
        label: "Series A",
        type: "bar",
        points: [
          { id: "point-a", label: "Point A", value: 0 },
          { id: "point-b", label: " ", value: 12 },
        ],
      },
      {
        id: "series-b",
        label: "Series B",
        type: "line",
        hidden: true,
        points: [{ id: "point-a", label: "Point A", value: 14 }],
      },
    ],
  },
};

export const WithZeroValues: Story = {
  args: {
    series: [
      {
        id: "series-a",
        label: "Series A",
        type: "bar",
        points: [
          { id: "point-a", label: "Point A", value: 0 },
          { id: "point-b", label: "Point B", value: 18 },
        ],
      },
      {
        id: "series-b",
        label: "Series B",
        type: "line",
        points: [
          { id: "point-a", label: "Point A", value: 0 },
          { id: "point-b", label: "Point B", value: 16 },
        ],
      },
    ],
    showZero: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    showLegend: false,
  },
};

export const CustomValueFormatter: Story = {
  args: {
    valueFormatter: (value) => `${Math.round(value)} units`,
  },
};
