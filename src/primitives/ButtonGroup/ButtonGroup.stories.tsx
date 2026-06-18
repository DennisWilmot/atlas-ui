import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ButtonGroup, type ButtonGroupItem } from "./ButtonGroup";

const items: ButtonGroupItem[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

const meta = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: {
    items,
    variant: "attached",
    size: "md",
    selectionMode: "toggle",
    "aria-label": "View range",
  },
  argTypes: {
    items: { control: "object", description: "Items/actions rendered as buttons." },
    variant: {
      control: "inline-radio",
      options: ["attached", "segmented"],
      description: "attached: joined buttons. segmented: track with a raised selected segment.",
    },
    selectedId: { control: "text", description: "Optional selected item id." },
    size: { control: "select", options: ["sm", "md", "lg"] },
    selectionMode: {
      control: "inline-radio",
      options: ["toggle", "single"],
      description:
        "toggle (default): toolbar of toggle buttons (role=group, aria-pressed). single: radio group (role=radiogroup, aria-checked) with arrow-key roving focus.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible name for the group — recommended so screen readers can announce its purpose.",
    },
    onItemClick: { control: false, description: "Called with the clicked item's id. Disabled items do not fire." },
  },
  parameters: {
    controls: { include: ["items", "variant", "selectedId", "size", "selectionMode", "aria-label"] },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Attached: Story = {
  args: { variant: "attached" },
};

export const Segmented: Story = {
  args: { variant: "segmented" },
};

export const Disabled: Story = {
  args: {
    variant: "attached",
    items: [
      { id: "day", label: "Day" },
      { id: "week", label: "Week", disabled: true },
      { id: "month", label: "Month" },
    ],
  },
};

export const Selected: Story = {
  render: function SelectedStory() {
    const [selected, setSelected] = useState("week");
    return (
      <ButtonGroup
        variant="segmented"
        items={items}
        selectedId={selected}
        onItemClick={setSelected}
      />
    );
  },
};

export const AttachedSelected: Story = {
  render: function AttachedSelectedStory() {
    const [selected, setSelected] = useState("week");
    return (
      <ButtonGroup
        variant="attached"
        items={items}
        selectedId={selected}
        onItemClick={setSelected}
      />
    );
  },
};

// Opt into the single-select radio pattern: role=radiogroup, aria-checked,
// arrow-key roving focus. Use for "pick one of N" selectors.
export const SingleSelect: Story = {
  render: function SingleSelectStory() {
    const [selected, setSelected] = useState("week");
    return (
      <ButtonGroup
        variant="segmented"
        selectionMode="single"
        aria-label="View range"
        items={items}
        selectedId={selected}
        onItemClick={setSelected}
      />
    );
  },
};
