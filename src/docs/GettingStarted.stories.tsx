import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "atlas-ui/primitives";
import { ActionMenu, MetricView } from "atlas-ui/patterns";
import type { Action, Metric } from "atlas-ui/types";

const actions: Action[] = [
  { id: "review", label: "Review" },
  { id: "open", label: "Open" },
];

const metric: Metric = {
  id: "metric-a",
  label: "Metric A",
  value: 42,
  trend: 8,
  unit: "%",
};

const meta = {
  title: "Docs/Getting Started",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Atlas UI ships URA-compliant capabilities. Import primitives, patterns, and types from the public package entry points only.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Imports: Story = {
  render: () => (
    <section className="atlas-stack">
      <div className="atlas-cluster">
        <Button variant="primary">Primary</Button>
        <Badge variant="info">Item A</Badge>
      </div>
      <MetricView metric={metric} />
      <ActionMenu actions={actions} onAction={() => undefined} />
      <pre className="atlas-code-sample">
        <code>{`import { Button } from "atlas-ui/primitives";
import { MetricView } from "atlas-ui/patterns";
import type { Action, Metric, Row } from "atlas-ui/types";`}</code>
      </pre>
    </section>
  ),
};

export const PublicEntryPoints: Story = {
  render: () => (
    <section className="atlas-stack">
      <h2 className="atlas-doc-heading">Public Entry Points</h2>
      <ul className="atlas-doc-list">
        <li><code>atlas-ui</code></li>
        <li><code>atlas-ui/primitives</code></li>
        <li><code>atlas-ui/patterns</code></li>
        <li><code>atlas-ui/types</code></li>
        <li><code>atlas-ui/headless</code></li>
      </ul>
    </section>
  ),
};
