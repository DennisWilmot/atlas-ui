import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordExample } from "./ForgotPasswordExample";

const meta = {
  title: "Examples/Auth/Forgot Password",
  component: ForgotPasswordExample,
  tags: ["autodocs"],
  args: {
    disabled: false,
  },
} satisfies Meta<typeof ForgotPasswordExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      { id: "send-reset", label: "Send reset instructions", type: "submit", variant: "primary" },
      { id: "back", label: "Back to sign in", variant: "ghost" },
    ],
    description: "Enter the email address for the account. If it matches an account, reset instructions will be sent.",
    eyebrow: "Account access",
    fields: [
      {
        autoComplete: "email",
        label: "Email address",
        name: "email",
        type: "email",
      },
    ],
    title: "Reset your password",
  },
};

export const InstructionsSent: Story = {
  args: {
    actions: [
      { id: "open-sign-in", label: "Open sign in", variant: "primary" },
      { id: "request-again", label: "Request again", variant: "secondary" },
    ],
    description: "If the submitted email matches an account, reset instructions are on the way.",
    eyebrow: "Reset requested",
    notice: "The message may take a few minutes to arrive. Request a new reset only after checking recent security mail.",
    title: "Check your inbox",
  },
};

export const SetNewPassword: Story = {
  args: {
    actions: [
      { id: "update-password", label: "Update password", type: "submit", variant: "primary" },
      { id: "cancel", label: "Cancel", variant: "ghost" },
    ],
    description: "Use a password that is unique to this account.",
    eyebrow: "Secure password",
    fields: [
      {
        autoComplete: "new-password",
        label: "New password",
        name: "new-password",
        type: "password",
      },
      {
        autoComplete: "new-password",
        label: "Confirm password",
        name: "confirm-password",
        type: "password",
      },
    ],
    title: "Choose a new password",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const HiddenWhenMeaningless: Story = {
  args: {},
};
