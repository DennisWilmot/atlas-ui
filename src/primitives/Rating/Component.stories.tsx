import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./Component";

const meta = {
  title: "Primitives/Rating",
  component: Rating,
  tags: ["autodocs"],
  args: {
    label: "Rating",
    value: 3.5,
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    showValue: true,
  },
};

export const CustomMaximum: Story = {
  args: {
    max: 3,
    showValue: true,
    value: 2,
  },
};

export const EmptyHidden: Story = {
  args: {
    value: null,
  },
};

export const ZeroHidden: Story = {
  args: {
    value: 0,
  },
};

export const ZeroVisible: Story = {
  args: {
    showValue: true,
    showZero: true,
    value: 0,
  },
};
