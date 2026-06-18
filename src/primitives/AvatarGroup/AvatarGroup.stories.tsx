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
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

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
