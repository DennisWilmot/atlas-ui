import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TableColumn } from "../../types";
import { TableView } from "./TableView";

type RecordRow = {
  id: string;
  record: string;
  value: number;
  state: string;
};

const makeRows = (count: number): RecordRow[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `record-${index + 1}`,
    record: `Record ${index + 1}`,
    value: index + 1,
    state: index % 2 === 0 ? "Alpha" : "Beta",
  }));

const columns: TableColumn<RecordRow>[] = [
  { key: "record", label: "Record" },
  { key: "value", label: "Value" },
  { key: "state", label: "State" },
];

const meta = {
  title: "Patterns/TableView",
  component: TableView<RecordRow>,
  tags: ["autodocs"],
  args: {
    rows: makeRows(10),
    columns,
    getRowKey: (row) => row.id,
  },
} satisfies Meta<typeof TableView<RecordRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    rows: [],
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    rows: [],
    showEmptyState: true,
  },
};

export const TenRows: Story = {
  args: {
    rows: makeRows(10),
  },
};

export const FiftyOneRowsWithControls: Story = {
  args: {
    rows: makeRows(51),
  },
};

export const NoActions: Story = {
  args: {
    rows: makeRows(4),
    actions: [],
  },
};

export const DisabledAction: Story = {
  args: {
    rows: makeRows(4),
    actions: [{ id: "flag", label: "Flag", intent: "danger", disabled: true }],
  },
};
