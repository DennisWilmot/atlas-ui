import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Action, RadarChartAxis } from "../../types";
import { RadarChartView } from "./Component";

type RecordRow = {
  id: string;
  label: string;
  metricA: number;
  metricB: number;
  metricC: number;
  metricD: number;
};

const axes: RadarChartAxis<RecordRow>[] = [
  { key: "metricA", label: "Metric A", max: 100 },
  { key: "metricB", label: "Metric B", max: 100 },
  { key: "metricC", label: "Metric C", max: 100 },
  { key: "metricD", label: "Metric D", max: 100 },
];

const rows: RecordRow[] = [
  { id: "alpha", label: "Alpha", metricA: 72, metricB: 64, metricC: 86, metricD: 58 },
  { id: "beta", label: "Beta", metricA: 48, metricB: 82, metricC: 54, metricD: 76 },
];

const actions: Action[] = [
  { id: "inspect", label: "Inspect", intent: "primary" },
  { id: "archive", label: "Archive", disabled: true },
];

const meta = {
  title: "Patterns/RadarChartView",
  component: RadarChartView<RecordRow>,
  tags: ["autodocs"],
  args: {
    axes,
    getRowKey: (row) => row.id,
    getRowLabel: (row) => row.label,
    label: "Metric comparison",
    rows,
  },
} satisfies Meta<typeof RadarChartView<RecordRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    rows: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    rows: [],
    showEmptyState: true,
  },
};

export const MeaninglessAxesHidden: Story = {
  args: {
    axes: axes.slice(0, 2),
  },
};

export const ZeroValuesHidden: Story = {
  args: {
    rows: [{ id: "zero", label: "Zero", metricA: 0, metricB: 0, metricC: 0, metricD: 0 }],
  },
};

export const ZeroValuesShown: Story = {
  args: {
    rows: [{ id: "zero", label: "Zero", metricA: 0, metricB: 0, metricC: 0, metricD: 0 }],
    showZero: true,
  },
};

export const WithActions: Story = {
  args: {
    actions,
  },
};

export const ReadOnly: Story = {
  args: {
    actions,
    readOnly: true,
  },
};

export const FocusedSubset: Story = {
  args: {
    rows: Array.from({ length: 8 }, (_, index) => ({
      id: `record-${index + 1}`,
      label: `Record ${index + 1}`,
      metricA: 24 + index * 8,
      metricB: 80 - index * 5,
      metricC: 44 + index * 4,
      metricD: 62 - index * 3,
    })),
  },
};
