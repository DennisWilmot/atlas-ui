import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldView } from "./FieldView";

const meta = {
  title: "Patterns/FieldView",
  component: FieldView,
  tags: ["autodocs"],
  args: {
    fields: [
      { key: "field-a", label: "Field A", value: "Alpha", shape: "text" },
      { key: "field-b", label: "Field B", value: 21, shape: "number" },
    ],
  },
} satisfies Meta<typeof FieldView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    fields: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    fields: [],
    showEmptyState: true,
  },
};

export const Shapes: Story = {
  args: {
    fields: [
      { key: "text", label: "Field A", value: "Alpha", shape: "text" },
      { key: "number", label: "Field B", value: 12, shape: "number" },
      { key: "status", label: "Field C", value: "active", shape: "status" },
      { key: "date", label: "Field D", value: "2026-06-16", shape: "date" },
      { key: "currency", label: "Field E", value: 129, shape: "currency" },
      { key: "badge", label: "Field F", value: "Beta", shape: "badge" },
    ],
  },
};

export const HideEmptyFields: Story = {
  args: {
    fields: [
      { key: "visible", label: "Field A", value: "Alpha", shape: "text" },
      { key: "empty", label: "Field B", value: "" },
      { key: "optional", label: "Field C", value: null as unknown },
    ],
  },
};
