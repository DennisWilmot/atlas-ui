import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedIcon } from "./FeaturedIcon";

// Generic, meaning-free icons (no xmlns: React adds the SVG namespace, and the
// guardrail rejects hardcoded http(s) URLs in primitive source).
const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 9.5l6.9-.6z" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: "Primitives/FeaturedIcon",
  component: FeaturedIcon,
  tags: ["autodocs"],
  args: {
    icon: StarIcon,
    size: "md",
    tone: "neutral",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    tone: { control: "select", options: ["neutral", "info", "success", "warning", "danger"] },
    icon: { control: false },
  },
  parameters: {
    controls: { include: ["size", "tone"] },
  },
} satisfies Meta<typeof FeaturedIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <FeaturedIcon icon={StarIcon} size="sm" />
      <FeaturedIcon icon={StarIcon} size="md" />
      <FeaturedIcon icon={StarIcon} size="lg" />
      <FeaturedIcon icon={StarIcon} size="xl" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <FeaturedIcon icon={StarIcon} tone="neutral" />
      <FeaturedIcon icon={StarIcon} tone="info" />
      <FeaturedIcon icon={StarIcon} tone="success" />
      <FeaturedIcon icon={StarIcon} tone="warning" />
      <FeaturedIcon icon={StarIcon} tone="danger" />
    </div>
  ),
};

export const WithCustomIcon: Story = {
  args: {
    icon: CheckIcon,
    tone: "success",
  },
};

// URA Law 4: with no icon the wrapper renders nothing.
export const EmptyHidden: Story = {
  args: {
    icon: undefined,
  },
};
