import type { Meta, StoryObj } from "@storybook/react-vite";
import "./VerificationExample.css";
import { VerificationExample } from "./VerificationExample";

const meta = {
  title: "Examples/Auth/Verification",
  component: VerificationExample,
  tags: ["autodocs"],
} satisfies Meta<typeof VerificationExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CodeEntry: Story = {
  args: {
    actions: [
      { id: "continue", label: "Continue", variant: "primary" },
      { id: "new-code", label: "Request new code", variant: "ghost" },
    ],
    codeField: {
      hint: "Use the latest code from your selected delivery method.",
      label: "Verification code",
      placeholder: "000000",
    },
    description: "Enter the single-use code to continue.",
    status: {
      label: "Code required",
      variant: "info",
    },
    title: "Verify access",
  },
};

export const Pending: Story = {
  args: {
    actions: [{ id: "new-code", label: "Request new code", variant: "secondary" }],
    description: "The current code is still active. Wait briefly before requesting another one.",
    status: {
      label: "Pending",
      variant: "warning",
    },
    title: "Check your selected method",
  },
};

export const Verified: Story = {
  args: {
    actions: [{ id: "continue", label: "Continue", variant: "primary" }],
    description: "Verification is complete and access can continue.",
    status: {
      label: "Verified",
      variant: "success",
    },
    title: "Access verified",
  },
};

export const Expired: Story = {
  args: {
    actions: [
      { id: "new-code", label: "Request new code", variant: "primary" },
      { id: "change-method", label: "Use different method", variant: "secondary" },
    ],
    codeField: {
      error: "This code is no longer active.",
      label: "Verification code",
      placeholder: "000000",
    },
    description: "Request a fresh code before continuing.",
    status: {
      label: "Expired",
      variant: "danger",
    },
    title: "Code expired",
  },
};

export const HiddenWhenMeaningless: Story = {
  args: {},
};
