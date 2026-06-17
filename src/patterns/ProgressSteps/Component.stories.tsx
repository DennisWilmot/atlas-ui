import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ProgressStep } from "../../types";
import { ProgressSteps } from "./Component";

const defaultSteps: ProgressStep[] = [
  { id: "step-a", label: "Step A", state: "complete", description: "Finished" },
  {
    id: "step-b",
    label: "Step B",
    state: "current",
    description: "In progress",
    actions: [{ id: "advance", label: "Advance", intent: "primary" }],
  },
  { id: "step-c", label: "Step C", state: "upcoming", description: "Queued" },
];

const makeSteps = (count: number): ProgressStep[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `step-${index + 1}`,
    label: `Step ${index + 1}`,
    state: index === 0 ? "current" : "upcoming",
  }));

const meta = {
  title: "Patterns/ProgressSteps",
  component: ProgressSteps,
  tags: ["autodocs"],
  args: {
    steps: defaultSteps,
  },
} satisfies Meta<typeof ProgressSteps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    steps: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    steps: [],
    showEmptyState: true,
  },
};

export const HiddenSteps: Story = {
  args: {
    steps: [
      { id: "step-a", label: "Step A", state: "complete", hidden: true },
      { id: "step-b", label: " ", state: "current" },
    ],
  },
};

export const TwentySteps: Story = {
  args: {
    steps: makeSteps(20),
  },
};

export const TwentyOneStepsWithSearch: Story = {
  args: {
    steps: makeSteps(21),
  },
};

export const WithActions: Story = {
  args: {
    steps: defaultSteps,
  },
};

export const NoActions: Story = {
  args: {
    steps: defaultSteps.map(({ actions, ...step }) => step),
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    steps: defaultSteps,
  },
};

export const DisabledAction: Story = {
  args: {
    steps: [
      {
        id: "step-a",
        label: "Step A",
        state: "blocked",
        actions: [{ id: "retry", label: "Retry", disabled: true }],
      },
    ],
  },
};
