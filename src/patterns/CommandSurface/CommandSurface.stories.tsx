import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandSurface } from "./CommandSurface";

const makeCommands = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `command-${index + 1}`,
    label: `Command ${index + 1}`,
  }));

const meta = {
  title: "Patterns/CommandSurface",
  component: CommandSurface,
  tags: ["autodocs"],
  args: {
    commands: makeCommands(4),
  },
} satisfies Meta<typeof CommandSurface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    commands: [],
  },
};

export const HiddenCommands: Story = {
  args: {
    commands: [
      { id: "command-1", label: "Command 1", hidden: true },
      { id: "command-2", label: "Command 2", hidden: true },
    ],
  },
};

export const DisabledCommands: Story = {
  args: {
    commands: [
      { id: "command-1", label: "Command 1", disabled: true },
      { id: "command-2", label: "Command 2" },
    ],
  },
};

export const DiscoveryFiltered: Story = {
  args: {
    commands: makeCommands(12),
    defaultInputValue: "12",
  },
};
