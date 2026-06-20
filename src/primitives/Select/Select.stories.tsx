import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select, type SelectOption } from "./Select";

const items: SelectOption[] = [
  { id: "a", value: "a", label: "Option A" },
  { id: "b", value: "b", label: "Option B" },
  { id: "c", value: "c", label: "Option C" },
];

const manyItems: SelectOption[] = Array.from({ length: 14 }, (_, index) => ({
  id: `opt-${index}`,
  value: `opt-${index}`,
  label: `Option ${index + 1}`,
}));

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    items,
    label: "Choose one",
    placeholder: "Select an option",
    disabled: false,
    required: false,
  },
  argTypes: {
    items: { control: "object" },
    label: { control: "text", description: "Visible label. Provide this or an aria-label." },
    placeholder: { control: "text" },
    hint: { control: "text", description: "Optional helper text, associated via aria-describedby." },
    error: { control: "text", description: "Optional error; sets aria-invalid and associates via aria-describedby." },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  parameters: {
    controls: { include: ["items", "label", "placeholder", "hint", "error", "disabled", "required"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "22rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Required: Story = {
  args: { required: true },
};

export const WithHint: Story = {
  args: { hint: "Pick the best fit" },
};

export const Error: Story = {
  // The hint is supplied too, but the error replaces it while present.
  args: { error: "Selection required", hint: "Pick the best fit" },
};

// URA Law 4: with no items the select renders nothing.
export const EmptyHidden: Story = {
  args: { items: [] },
};

// URA Law 4: with no accessible name, the select renders nothing.
export const NoAccessibleNameHidden: Story = {
  args: { label: undefined },
};

// URA Law 4: options with empty labels are not meaningful options.
export const EmptyOptionsHidden: Story = {
  args: { items: [{ id: "empty", value: "empty", label: "   " }] },
};

export const DisabledOption: Story = {
  args: {
    items: [
      { id: "a", value: "a", label: "Option A" },
      { id: "b", value: "b", label: "Option B", disabled: true },
      { id: "c", value: "c", label: "Option C" },
    ],
  },
};

export const SingleOptionDefault: Story = {
  args: {
    items: [{ id: "only", value: "only", label: "Only Option" }],
    placeholder: undefined,
  },
};

export const StandardSelect: Story = {
  // 10 or fewer items render a standard select.
  args: { items },
};

export const SearchableOverflow: Story = {
  // 11+ items automatically upgrade to a searchable combobox.
  args: { items: manyItems, placeholder: "Search options", noResultsLabel: "No matches found" },
};

export const ControlledExample: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("a");
    return <Select items={items} label="Choose one" value={value} onValueChange={setValue} />;
  },
};

export const UncontrolledExample: Story = {
  render: () => <Select items={items} label="Choose one" defaultValue="b" />,
};
