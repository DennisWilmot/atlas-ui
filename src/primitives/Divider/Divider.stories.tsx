import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta = {
  title: "Primitives/Divider",
  component: Divider,
  tags: ["autodocs"],
  args: {
    orientation: "horizontal",
    label: "OR",
    labelPosition: "center",
    spacing: "md",
    decorative: false,
    hidden: false,
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    label: { control: "text" },
    labelPosition: { control: "inline-radio", options: ["start", "center", "end"] },
    spacing: { control: "select", options: ["none", "sm", "md", "lg"] },
    decorative: { control: "boolean" },
    hidden: { control: "boolean" },
  },
  parameters: {
    controls: { include: ["orientation", "label", "labelPosition", "spacing", "decorative", "hidden"] },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive: drive every prop from the Controls panel.
export const Playground: Story = {
  render: (args) => {
    const vertical = args.orientation === "vertical";
    return (
      <div
        style={
          vertical
            ? { display: "flex", alignItems: "center", height: "3rem" }
            : { width: "20rem" }
        }
      >
        {vertical ? <span>Left</span> : null}
        <Divider {...args} />
        {vertical ? <span>Right</span> : null}
      </div>
    );
  },
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <div>Section A</div>
      <Divider />
      <div>Section B</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", height: "2rem" }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <Divider label="OR" />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <div style={{ width: "20rem", display: "grid", gap: "0.5rem" }}>
      <Divider label="Start" labelPosition="start" />
      <Divider label="Center" labelPosition="center" />
      <Divider label="End" labelPosition="end" />
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <div>Above</div>
      <Divider spacing="none" />
      <div>none</div>
      <Divider spacing="sm" />
      <div>sm</div>
      <Divider spacing="md" />
      <div>md</div>
      <Divider spacing="lg" />
      <div>lg</div>
    </div>
  ),
};

export const Decorative: Story = {
  render: () => (
    <div style={{ width: "20rem" }}>
      <div>Section A</div>
      <Divider decorative />
      <div>Section B</div>
    </div>
  ),
};

// hidden renders nothing.
export const Hidden: Story = {
  args: {
    hidden: true,
  },
};
