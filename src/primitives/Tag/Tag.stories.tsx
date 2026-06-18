import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../Avatar";
import { Tag } from "./Tag";

// Generic, meaning-free icon (no xmlns: React adds the SVG namespace, and the
// guardrail rejects hardcoded http(s) URLs in primitive source).
const TagIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="6" />
  </svg>
);

const meta = {
  title: "Primitives/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: {
    children: "Label",
    size: "md",
    tone: "neutral",
  },
  argTypes: {
    children: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["neutral", "info", "success", "warning", "danger"] },
    icon: { control: false },
    avatar: { control: false },
    onRemove: { control: false },
  },
  parameters: {
    controls: { include: ["children", "size", "tone"] },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Tag tone="neutral">Neutral</Tag>
      <Tag tone="info">Info</Tag>
      <Tag tone="success">Success</Tag>
      <Tag tone="warning">Warning</Tag>
      <Tag tone="danger">Danger</Tag>
    </div>
  ),
};

export const Removable: Story = {
  args: {
    children: "Removable",
    onRemove: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    children: "With icon",
    icon: TagIcon,
    tone: "info",
  },
};

export const WithAvatar: Story = {
  args: {
    children: "With avatar",
    avatar: <Avatar size="xs" alt="Record A" initials="RA" />,
  },
};

// URA Law 4: with no content the tag renders nothing.
export const EmptyHidden: Story = {
  args: {
    children: "",
  },
};
