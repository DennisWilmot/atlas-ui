import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Component";

const meta = {
  title: "Patterns/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  args: {
    items: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta" },
      { id: "gamma", label: "Gamma" },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};

export const MeaninglessTrailHidden: Story = {
  args: {
    items: [{ id: "alpha", label: "Alpha" }],
  },
};

export const HiddenItems: Story = {
  args: {
    items: [
      { id: "alpha", label: "Alpha" },
      { id: "internal", label: "Internal", hidden: true },
      { id: "beta", label: "Beta" },
    ],
  },
};

export const LongTrail: Story = {
  args: {
    items: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta" },
      { id: "gamma", label: "Gamma" },
      { id: "delta", label: "Delta" },
      { id: "epsilon", label: "Epsilon" },
      { id: "zeta", label: "Zeta" },
    ],
  },
};

export const DisabledItem: Story = {
  args: {
    items: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta", disabled: true },
      { id: "gamma", label: "Gamma" },
    ],
  },
};

export const AppSuppliedLinks: Story = {
  args: {
    items: [
      { id: "alpha", label: "Alpha", href: "#alpha" },
      { id: "beta", label: "Beta", href: "#beta" },
      { id: "gamma", label: "Gamma" },
    ],
  },
};
