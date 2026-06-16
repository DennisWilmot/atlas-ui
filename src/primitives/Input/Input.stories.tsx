import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Field label",
    placeholder: "Enter value",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    hint: "Use a concise value.",
  },
};

export const ErrorState: Story = {
  args: {
    error: "Enter a valid value.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read only",
  },
};

export const Controlled: Story = {
  args: {
    value: "Alpha",
    readOnly: true,
  },
};
