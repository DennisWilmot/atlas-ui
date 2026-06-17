import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextEditor } from "./Component";

const meta = {
  title: "Patterns/TextEditor",
  component: TextEditor,
  tags: ["autodocs"],
  args: {
    label: "Text",
    placeholder: "Enter text",
  },
} satisfies Meta<typeof TextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    label: "",
    placeholder: "",
  },
};

export const ExplicitlyHidden: Story = {
  args: {
    hidden: true,
  },
};

export const WithToolbarActions: Story = {
  args: {
    defaultValue: "Alpha text",
    toolbarActions: [
      { id: "strong", label: "Strong", intent: "primary" },
      { id: "emphasis", label: "Emphasis" },
      { id: "reset", label: "Reset" },
    ],
  },
};

export const NoToolbarActions: Story = {
  args: {
    defaultValue: "Alpha text",
    toolbarActions: [],
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    toolbarActions: [{ id: "strong", label: "Strong" }],
    value: "Alpha text",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Enter text",
    toolbarActions: [{ id: "strong", label: "Strong" }],
  },
};
