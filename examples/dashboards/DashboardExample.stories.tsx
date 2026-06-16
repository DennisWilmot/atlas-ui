import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetricView, TableView } from "../../src/patterns";
import type { TableColumn } from "../../src/types";

type ExampleRow = {
  id: string;
  record: string;
  value: number;
};

const rows: ExampleRow[] = [
  { id: "record-1", record: "Record 1", value: 12 },
  { id: "record-2", record: "Record 2", value: 24 },
];

const columns: TableColumn<ExampleRow>[] = [
  { key: "record", label: "Record" },
  { key: "value", label: "Value" },
];

const meta = {
  title: "Examples/Dashboards",
  tags: ["autodocs"],
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "42rem" }}>
      <MetricView metric={{ label: "Metric A", value: 42 }} />
      <TableView rows={rows} columns={columns} getRowKey={(row) => row.id} />
    </div>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralDashboard: Story = {};
