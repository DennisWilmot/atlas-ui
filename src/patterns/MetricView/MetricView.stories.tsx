import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricView } from "./MetricView";

const meta = {
  title: "Patterns/MetricView",
  component: MetricView,
  tags: ["autodocs"],
  args: {
    metric: {
      label: "Metric A",
      value: 42,
      unit: "pts",
    },
  },
} satisfies Meta<typeof MetricView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ZeroHidden: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 0,
    },
  },
};

export const ZeroShown: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 0,
    },
    showZero: true,
  },
};

export const HiddenMetric: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 12,
      hidden: true,
    },
  },
};

export const Trend: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 42,
      trend: 8,
      unit: "pts",
    },
  },
};
