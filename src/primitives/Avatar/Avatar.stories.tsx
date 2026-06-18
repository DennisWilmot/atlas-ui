import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

// Neutral, generic image data URI — a flat swatch, no real person or asset URL.
const sampleImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGM4ffUhSYhhVMOohuGrAQCui4EfaoABDwAAAABJRU5ErkJggg==";

// An intentionally invalid source so the fallback path is exercised in the browser.
const brokenImage = "data:image/png;base64,not-a-real-image";

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    alt: "Record A",
    initials: "RA",
    size: "md",
    showPlaceholder: false,
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    initials: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    status: { control: "select", options: [undefined, "online", "offline", "busy", "away"] },
    statusLabel: {
      control: "text",
      description:
        "Accessible text announced for the status. The colored status dot is decorative (aria-hidden), so screen readers rely on this. Optional — defaults to the raw status value (e.g. \"online\"). Set it to customize or localize, e.g. \"Active now\".",
    },
    showPlaceholder: { control: "boolean" },
  },
  parameters: {
    controls: { include: ["src", "alt", "initials", "size", "status", "statusLabel", "showPlaceholder"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Image: Story = {
  args: {
    src: sampleImage,
    alt: "Record A",
  },
};

export const Initials: Story = {
  args: {
    initials: "AB",
    alt: "Account B",
  },
};

export const Status: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Avatar alt="Record A" initials="RA" status="online" />
      <Avatar alt="Record B" initials="RB" status="away" />
      <Avatar alt="Record C" initials="RC" status="busy" />
      <Avatar alt="Record D" initials="RD" status="offline" />
    </div>
  ),
};

// The status dot is decorative; `statusLabel` is the accessible text a screen
// reader announces for it. Optional — without it the raw status ("busy") is
// announced. Inspect the accessibility tree to see "Record A, In a meeting".
export const StatusWithLabel: Story = {
  args: {
    alt: "Record A",
    initials: "RA",
    status: "busy",
    statusLabel: "In a meeting",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Avatar alt="Record A" initials="XS" size="xs" />
      <Avatar alt="Record A" initials="SM" size="sm" />
      <Avatar alt="Record A" initials="MD" size="md" />
      <Avatar alt="Record A" initials="LG" size="lg" />
      <Avatar alt="Record A" initials="XL" size="xl" />
    </div>
  ),
};

export const BrokenImageFallback: Story = {
  args: {
    src: brokenImage,
    initials: "RA",
    alt: "Record A",
  },
};

// URA Law 4: with no image, initials, or alt, the avatar renders nothing.
export const HiddenWhenEmpty: Story = {
  args: {
    alt: "",
    initials: undefined,
  },
};

// Opt in to a neutral placeholder when the app needs a stable slot.
export const Placeholder: Story = {
  args: {
    alt: "",
    initials: undefined,
    showPlaceholder: true,
  },
};
