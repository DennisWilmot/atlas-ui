import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "../../../src/primitives";

type InlineCtaItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  tone: "blue" | "green" | "neutral";
};

const toneStyles: Record<InlineCtaItem["tone"], CSSProperties> = {
  blue: {
    background: "#f8fbff",
    borderColor: "#bfdbfe",
  },
  green: {
    background: "#f7fdf9",
    borderColor: "#bbf7d0",
  },
  neutral: {
    background: "var(--atlas-color-bg)",
    borderColor: "var(--atlas-color-border)",
  },
};

const ctas: InlineCtaItem[] = [
  {
    id: "cta-a",
    label: "Prompt",
    title: "Ready for the next step?",
    description: "Place a focused action inside surrounding content without turning it into a full page section.",
    primaryAction: "Start",
    secondaryAction: "Later",
    tone: "blue",
  },
  {
    id: "cta-b",
    label: "Choice",
    title: "Compare the available paths",
    description: "Use an inline callout when the user can act now or continue scanning the page.",
    primaryAction: "Compare",
    secondaryAction: "Keep reading",
    tone: "green",
  },
  {
    id: "cta-c",
    label: "Reminder",
    title: "Save the current selection",
    description: "Keep the message compact so it supports the current task instead of interrupting it.",
    primaryAction: "Save",
    tone: "neutral",
  },
];

const pageStyle: CSSProperties = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1rem",
  maxWidth: "58rem",
};

const introStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
};

const titleStyle: CSSProperties = {
  fontSize: "1.5rem",
  lineHeight: 1.2,
  margin: 0,
};

const mutedStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: 0,
};

const contentStyle: CSSProperties = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "1rem",
  padding: "1rem",
};

const ctaStyle: CSSProperties = {
  alignItems: "center",
  border: "1px solid",
  borderRadius: "8px",
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  justifyContent: "space-between",
  padding: "1rem",
};

const ctaContentStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
  minWidth: "14rem",
};

const ctaHeaderStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const ctaTitleStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.3,
  margin: 0,
};

const actionsStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

function InlineCta({ item }: { item: InlineCtaItem }) {
  return (
    <aside aria-labelledby={`${item.id}-title`} style={{ ...ctaStyle, ...toneStyles[item.tone] }}>
      <div style={ctaContentStyle}>
        <div style={ctaHeaderStyle}>
          <Badge variant="info">{item.label}</Badge>
          <h2 id={`${item.id}-title`} style={ctaTitleStyle}>{item.title}</h2>
        </div>
        <p style={mutedStyle}>{item.description}</p>
      </div>
      <div style={actionsStyle}>
        <Button size="sm">{item.primaryAction}</Button>
        {item.secondaryAction ? (
          <Button size="sm" variant="secondary">{item.secondaryAction}</Button>
        ) : null}
      </div>
    </aside>
  );
}

function InlineCtasExample() {
  return (
    <main style={pageStyle}>
      <header style={introStyle}>
        <h1 style={titleStyle}>Inline CTAs</h1>
        <p style={mutedStyle}>Marketing callouts embedded between neutral content blocks.</p>
      </header>

      <section aria-label="Inline call to action examples" style={contentStyle}>
        <p style={mutedStyle}>
          Content block A gives context before the first action appears.
        </p>
        <InlineCta item={ctas[0]} />
        <p style={mutedStyle}>
          Content block B continues the page flow and keeps the action surface compact.
        </p>
        <InlineCta item={ctas[1]} />
        <p style={mutedStyle}>
          Content block C shows how a final prompt can remain lightweight.
        </p>
        <InlineCta item={ctas[2]} />
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Marketing/Inline CTAs",
  tags: ["autodocs"],
  render: () => <InlineCtasExample />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralInlineCtas: Story = {};
