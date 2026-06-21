import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "atlas-ui/primitives";
import { MetricView } from "atlas-ui/patterns";
import type { Action, Metric } from "atlas-ui/types";

const actions: Action[] = [
  { id: "approve", label: "Approve", intent: "primary" },
  { id: "hold", label: "Hold", intent: "secondary" },
];

const metric: Metric = {
  label: "Metric A",
  value: 42,
  trend: 8,
  unit: "pts",
};

const pageStyle = {
  display: "grid",
  gap: "24px",
  padding: "32px",
} as const;

const sectionStyle = {
  display: "grid",
  gap: "12px",
  padding: "24px",
  border: "1px solid #d7deea",
  borderRadius: "20px",
  background: "linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%)",
} as const;

const codeStyle = {
  margin: 0,
  padding: "20px",
  borderRadius: "16px",
  backgroundColor: "#0f172a",
  color: "#e2e8f0",
  overflowX: "auto",
} as const;

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

export const Overview: Story = {
  render: () => (
    <section style={pageStyle}>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Public entrypoints</h2>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li><code>atlas-ui/primitives</code> for dumb, reusable building blocks.</li>
          <li><code>atlas-ui/patterns</code> for URA-shaped compositions.</li>
          <li><code>atlas-ui/types</code> for neutral contracts such as <code>Action</code> and <code>Metric</code>.</li>
        </ul>
      </section>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Start from the shipped surface</h2>
        <pre style={codeStyle}>
          <code>{`import { Button } from "atlas-ui/primitives";
import { MetricView } from "atlas-ui/patterns";
import type { Action, Metric } from "atlas-ui/types";

const actions: Action[] = [
  { id: "approve", label: "Approve", intent: "primary" },
  { id: "hold", label: "Hold", intent: "secondary" },
];

const metric: Metric = {
  label: "Metric A",
  value: 42,
  unit: "pts",
};

export function ReviewPanel() {
  return (
    <section>
      <Button>{actions[0].label}</Button>
      <MetricView metric={metric} />
    </section>
  );
}`}</code>
        </pre>
      </section>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Live preview</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.intent === "secondary" ? "secondary" : "primary"}
            >
              {action.label}
            </Button>
          ))}
        </div>
        <div style={{ maxWidth: "240px" }}>
          <MetricView metric={metric} />
        </div>
      </section>
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>URA guardrails</h2>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li>Components accept data through props and do not fetch internally.</li>
          <li>Patterns hide empty or meaningless states by default unless the app opts in.</li>
          <li>Actions stay injected by props so the library ships capability while the app ships meaning.</li>
          <li>Examples stay in the <code>Examples</code> branch of Storybook and never become package exports.</li>
        </ul>
      </section>
    </section>
  ),
};
