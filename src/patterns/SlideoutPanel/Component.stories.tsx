import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlideoutPanel } from "./Component";

const sections = [
  {
    id: "alpha",
    title: "Alpha",
    content: <p>Alpha content</p>,
  },
  {
    id: "beta",
    title: "Beta",
    content: <p>Beta content</p>,
    actions: [{ id: "inspect", label: "Inspect" }],
  },
];

const meta = {
  title: "Patterns/SlideoutPanel",
  component: SlideoutPanel,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Details",
    description: "Context for the selected item.",
    children: <p>Primary panel content</p>,
    sections,
    actions: [
      { id: "open", label: "Open", intent: "primary" },
      { id: "share", label: "Share" },
    ],
  },
} satisfies Meta<typeof SlideoutPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HiddenWhenClosed: Story = {
  args: {
    open: false,
  },
};

export const EmptyHidden: Story = {
  args: {
    title: "",
    description: "",
    children: "",
    sections: [],
    actions: [],
  },
};

export const SheetMode: Story = {
  args: {
    mode: "sheet",
    placement: "bottom",
  },
};

export const ModalMode: Story = {
  args: {
    mode: "modal",
  },
};

export const DisabledActions: Story = {
  args: {
    actions: [
      { id: "approve", label: "Approve", intent: "primary", disabled: true },
      { id: "flag", label: "Flag", intent: "danger", disabled: true },
    ],
  },
};

export const NoActions: Story = {
  args: {
    actions: [],
    sections,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};

export const HiddenSections: Story = {
  args: {
    sections: [
      ...sections,
      { id: "gamma", title: "Gamma", content: <p>Gamma content</p>, hidden: true },
      { id: "delta", title: "", content: null },
    ],
  },
};

export const ScrollableContent: Story = {
  args: {
    children: (
      <ul>
        {Array.from({ length: 24 }, (_, index) => (
          <li key={index}>Item {index + 1}</li>
        ))}
      </ul>
    ),
  },
};
