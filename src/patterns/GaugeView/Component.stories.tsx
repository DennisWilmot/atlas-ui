import type { Meta, StoryObj } from "@storybook/react-vite";
import { GaugeView } from "./Component";

const meta = {
  title: "Patterns/GaugeView",
  component: GaugeView,
  tags: ["autodocs"],
  args: {
    metric: {
      label: "Metric A",
      value: 64,
      unit: "%",
    },
  },
} satisfies Meta<typeof GaugeView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomRange: Story = {
  args: {
    max: 10,
    metric: {
      label: "Metric A",
      value: 7,
    },
  },
};

export const ValueFormatter: Story = {
  args: {
    max: 5,
    metric: {
      label: "Metric A",
      value: 3,
    },
    valueFormatter: (value) => `${value} units`,
  },
};

export const ZeroHidden: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 0,
      unit: "%",
    },
  },
};

export const ZeroShown: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 0,
      unit: "%",
    },
    showZero: true,
  },
};

export const MissingValue: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: null,
    },
  },
};

export const HiddenMetric: Story = {
  args: {
    metric: {
      hidden: true,
      label: "Metric A",
      value: 32,
    },
  },
};

export const ClampedValue: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 125,
      unit: "%",
    },
  },
};

export const ValueHidden: Story = {
  args: {
    metric: {
      label: "Metric A",
      value: 48,
      unit: "%",
    },
    showValue: false,
  },
};
