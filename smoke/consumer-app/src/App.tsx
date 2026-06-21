import { useState } from "react";
import { Badge, Button, Input } from "atlas-ui/primitives";
import { ActionMenu, MetricView, SelectView, TableView } from "atlas-ui/patterns";
import type { Action, Metric, Row, SelectItem, TableColumn } from "atlas-ui/types";
import "../../../src/styles/index.css";
import "./smoke.css";

type SmokeRow = Row & {
  id: string;
  label: string;
  state: string;
  count: number;
};

const actions: Action[] = [
  { id: "open", label: "Open" },
  { id: "review", label: "Review" },
  { id: "archive", label: "Archive", intent: "danger", disabled: true },
];

const metric: Metric = {
  id: "metric-a",
  label: "Metric A",
  value: 42,
  trend: 4,
  unit: "%",
};

const selectItems: SelectItem[] = [
  { id: "item-a", label: "Item A" },
  { id: "item-b", label: "Item B" },
];

const rows: SmokeRow[] = [
  { id: "record-1", label: "Record 1", state: "Ready", count: 3 },
  { id: "record-2", label: "Record 2", state: "Pending", count: 5 },
];

const columns: TableColumn<SmokeRow>[] = [
  { key: "label", label: "Record" },
  {
    key: "state",
    label: "State",
    render: (row) => <Badge variant="info">{row.state}</Badge>,
  },
  { key: "count", label: "Count" },
];

export function App() {
  const [selectedItem, setSelectedItem] = useState("item-a");
  const [lastAction, setLastAction] = useState("open");

  return (
    <main className="smoke-shell">
      <section className="atlas-stack smoke-panel" aria-label="Atlas UI consumer smoke">
        <div className="atlas-cluster">
          <Button variant="primary" onClick={() => setLastAction("primary")}>
            Primary
          </Button>
          <Badge variant="success" dot>
            Item A
          </Badge>
        </div>
        <Input label="Field A" value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)} />
        <SelectView
          items={selectItems}
          label="Select item"
          onChange={setSelectedItem}
          value={selectedItem}
        />
        <MetricView metric={metric} showZero />
        <ActionMenu actions={actions} onAction={setLastAction} />
        <TableView
          actions={actions}
          columns={columns}
          getRowKey={(row) => row.id}
          label="Records"
          onAction={setLastAction}
          rows={rows}
        />
        <p className="smoke-note">Last action: {lastAction}</p>
      </section>
    </main>
  );
}
