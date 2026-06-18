import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Message",
    placeholder: "Type here",
    disabled: false,
    required: false,
    autoResize: false,
    showCount: false,
  },
  argTypes: {
    label: { control: "text", description: "Visible label. Provide this or an aria-label." },
    placeholder: { control: "text" },
    hint: { control: "text", description: "Optional helper text, associated via aria-describedby." },
    error: { control: "text", description: "Optional error; sets aria-invalid and associates via aria-describedby." },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    autoResize: { control: "boolean", description: "Grow the textarea to fit its content." },
    showCount: { control: "boolean", description: "Show a character count of the current value length." },
    maxLength: { control: { type: "number" } },
  },
  parameters: {
    controls: {
      include: [
        "label",
        "placeholder",
        "hint",
        "error",
        "disabled",
        "required",
        "autoResize",
        "showCount",
        "maxLength",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "24rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Keep it brief" },
};

export const Error: Story = {
  // The hint is supplied too, but the error replaces it while present.
  args: { error: "Please enter a value", hint: "Keep it brief", defaultValue: "" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only content" },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    defaultValue: "This textarea grows as you type.\nAdd more lines to see it expand.",
  },
};

export const CharacterCount: Story = {
  args: { showCount: true, maxLength: 280, hint: "Stay within the limit" },
};

export const Required: Story = {
  args: { required: true, hint: "This field is required" },
};

export const ControlledExample: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("Controlled value");
    return (
      <Textarea
        label="Message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        showCount
        maxLength={120}
      />
    );
  },
};

export const UncontrolledExample: Story = {
  render: () => <Textarea label="Message" defaultValue="Uncontrolled value" showCount maxLength={120} />,
};
