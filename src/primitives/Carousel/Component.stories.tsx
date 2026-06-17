import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Carousel, type CarouselSlide } from "./Component";

const slideContentStyle = {
  display: "grid",
  gap: "0.5rem",
} satisfies CSSProperties;

const defaultSlides: CarouselSlide[] = [
  {
    id: "item-a",
    label: "Item A",
    content: (
      <div style={slideContentStyle}>
        <strong>Item A</strong>
        <span>Primary content</span>
      </div>
    ),
  },
  {
    id: "item-b",
    label: "Item B",
    content: (
      <div style={slideContentStyle}>
        <strong>Item B</strong>
        <span>Secondary content</span>
      </div>
    ),
  },
  {
    id: "item-c",
    label: "Item C",
    content: (
      <div style={slideContentStyle}>
        <strong>Item C</strong>
        <span>Tertiary content</span>
      </div>
    ),
  },
];

const meta = {
  title: "Primitives/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  args: {
    label: "Items",
    slides: defaultSlides,
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSlide: Story = {
  args: {
    slides: defaultSlides.slice(0, 1),
  },
};

export const EmptyHidden: Story = {
  args: {
    slides: [],
  },
};

export const HiddenSlides: Story = {
  args: {
    slides: [
      { ...defaultSlides[0], hidden: true },
      defaultSlides[1],
      { ...defaultSlides[2], hidden: true },
    ],
  },
};

export const Looping: Story = {
  args: {
    loop: true,
  },
};

export const IndicatorsOnly: Story = {
  args: {
    showControls: false,
  },
};

export const NoNavigation: Story = {
  args: {
    showControls: false,
    showIndicators: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [index, setIndex] = useState(1);

    return <Carousel {...args} index={index} onIndexChange={setIndex} />;
  },
};
