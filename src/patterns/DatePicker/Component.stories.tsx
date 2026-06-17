import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./Component";

const meta = {
  title: "Patterns/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    defaultValue: "2026-02-14",
    label: "Date",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyValue: Story = {
  args: {
    defaultValue: null,
  },
};

export const ModalOverlay: Story = {
  args: {
    defaultOpen: true,
    mode: "modal",
  },
};

export const SheetOverlay: Story = {
  args: {
    defaultOpen: true,
    mode: "sheet",
  },
};

export const DrawerOverlay: Story = {
  args: {
    defaultOpen: true,
    mode: "drawer",
  },
};

export const BoundedRange: Story = {
  args: {
    defaultOpen: true,
    max: "2026-12-31",
    min: "2026-01-01",
  },
};

export const HiddenWhenInvalidRange: Story = {
  args: {
    max: "2026-01-01",
    min: "2026-12-31",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
