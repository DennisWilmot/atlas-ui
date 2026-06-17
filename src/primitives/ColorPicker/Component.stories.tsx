import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./Component";

const swatches = [
  { value: "#111827", label: "Alpha" },
  { value: "#2563eb", label: "Beta" },
  { value: "#15803d", label: "Gamma" },
  { value: "#b45309", label: "Delta" },
  { value: "#dc2626", label: "Epsilon" },
];

const meta = {
  title: "Primitives/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  args: {
    label: "Color",
    defaultValue: "#2563eb",
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSwatches: Story = {
  args: {
    swatches,
  },
};

export const EmptySwatchesHidden: Story = {
  args: {
    swatches: [],
  },
};

export const HiddenValue: Story = {
  args: {
    showValue: false,
    swatches,
  },
};

export const ErrorState: Story = {
  args: {
    error: "Choose a valid color.",
    swatches,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    swatches,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "#111827",
    swatches,
  },
};
