import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup, type AvatarGroupItem } from "./AvatarGroup";

// Neutral, generic image data URI — a flat swatch, no real person or asset URL.
const sampleImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGM4ffUhSYhhVMOohuGrAQCui4EfaoABDwAAAABJRU5ErkJggg==";

const items: AvatarGroupItem[] = [
  { id: "a", label: "Record A", initials: "RA", imageSrc: sampleImage },
  { id: "b", label: "Record B", initials: "RB" },
  { id: "c", label: "Record C", initials: "RC" },
  { id: "d", label: "Record D", initials: "RD" },
  { id: "e", label: "Record E", initials: "RE" },
  { id: "f", label: "Record F", initials: "RF" },
  { id: "g", label: "Record G", initials: "RG" },
  { id: "h", label: "Record H", initials: "RH" },
];

const meta = {
  title: "Primitives/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  args: {
    items: items.slice(0, 3),
    maxVisible: 5,
    size: "md",
  },
  argTypes: {
    items: { control: "object" },
    maxVisible: { control: { type: "number", min: 0 } },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    ringColor: { control: "color" },
  },
  parameters: {
    controls: { include: ["items", "maxVisible", "size", "ringColor"] },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive: drive every prop from the Controls panel.
export const Playground: Story = {
  args: {
    items,
    maxVisible: 5,
  },
};

// URA Law 4: with no items the group renders nothing.
export const EmptyHidden: Story = {
  args: {
    items: [],
  },
};

export const ThreeAvatars: Story = {
  args: {
    items: items.slice(0, 3),
  },
};

export const Overflow: Story = {
  args: {
    items,
    maxVisible: 5,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
      <AvatarGroup items={items} maxVisible={4} size="xs" />
      <AvatarGroup items={items} maxVisible={4} size="sm" />
      <AvatarGroup items={items} maxVisible={4} size="md" />
      <AvatarGroup items={items} maxVisible={4} size="lg" />
      <AvatarGroup items={items} maxVisible={4} size="xl" />
    </div>
  ),
};

// Match the cut-out ring to the surface the group sits on.
export const CustomRingColor: Story = {
  args: {
    items: items.slice(0, 5),
    ringColor: "#eef2f7",
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#eef2f7", padding: "1.5rem", borderRadius: "0.5rem" }}>
        <Story />
      </div>
    ),
  ],
};
