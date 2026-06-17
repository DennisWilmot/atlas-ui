import type { Meta, StoryObj } from "@storybook/react-vite";
import { VerificationCodeInput } from "./Component";

const meta = {
  title: "Patterns/VerificationCodeInput",
  component: VerificationCodeInput,
  tags: ["autodocs"],
  args: {
    inputMode: "numeric",
    label: "Verification code",
    length: 6,
    pattern: "[0-9]*",
  },
} satisfies Meta<typeof VerificationCodeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    value: "123456",
  },
};

export const CustomLength: Story = {
  args: {
    label: "Access code",
    length: 4,
    value: "A1B2",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "123456",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "123456",
  },
};

export const HiddenWhenLengthInvalid: Story = {
  args: {
    length: 0,
  },
};
