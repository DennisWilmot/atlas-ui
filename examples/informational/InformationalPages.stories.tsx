import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../src/primitives";
import { ActionMenu, FieldView, ListView } from "../../src/patterns";
import type { Action, Field } from "../../src/types";

type InformationSection = {
  id: string;
  title: string;
  body: ReactNode;
  detail?: string;
};

type InformationalPageProps = {
  actions?: Action[];
  badge: ReactNode;
  fields?: Field[];
  sections: InformationSection[];
  summary: ReactNode;
  title: ReactNode;
};

const layoutStyle = {
  background: "var(--atlas-color-bg)",
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "2rem",
  maxWidth: "56rem",
  padding: "2rem",
} satisfies CSSProperties;

const headerStyle = {
  borderBottom: "1px solid var(--atlas-color-border)",
  display: "grid",
  gap: "1rem",
  paddingBottom: "1.5rem",
} satisfies CSSProperties;

const titleStyle = {
  fontSize: "2rem",
  lineHeight: 1.15,
  margin: 0,
} satisfies CSSProperties;

const summaryStyle = {
  color: "var(--atlas-color-muted)",
  fontSize: "1rem",
  lineHeight: 1.6,
  margin: 0,
  maxWidth: "42rem",
} satisfies CSSProperties;

const contentStyle = {
  display: "grid",
  gap: "1.5rem",
} satisfies CSSProperties;

const sectionStyle = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "var(--atlas-radius-md)",
  display: "grid",
  gap: "0.5rem",
  padding: "1rem",
} satisfies CSSProperties;

const sectionTitleStyle = {
  fontSize: "1rem",
  margin: 0,
} satisfies CSSProperties;

const sectionBodyStyle = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.6,
  margin: 0,
} satisfies CSSProperties;

const metaStyle = {
  borderTop: "1px solid var(--atlas-color-border)",
  paddingTop: "1.5rem",
} satisfies CSSProperties;

const referenceSections: InformationSection[] = [
  {
    id: "purpose",
    title: "Purpose",
    body: "Collect durable context in one place so the surrounding application can decide what to show next.",
  },
  {
    id: "scope",
    title: "Scope",
    body: "Use the page for stable reference content, process notes, and status-neutral guidance supplied by the app.",
  },
  {
    id: "next-step",
    title: "Next step",
    body: "Keep actions explicit and pass them into the page shell from the owning product surface.",
    detail: "No navigation target is assumed by the example.",
  },
];

const noticeSections: InformationSection[] = [
  {
    id: "notice-summary",
    title: "Summary",
    body: "The requested content is not available in the current context.",
  },
  {
    id: "notice-resolution",
    title: "Resolution",
    body: "Return to the previous surface or use the product-owned discovery flow.",
  },
];

const referenceFields: Field[] = [
  { key: "category", label: "Category", value: "Reference", shape: "badge" },
  { key: "state", label: "State", value: "Ready", shape: "status" },
  { key: "owner", label: "Owner", value: "App supplied" },
];

const referenceActions: Action[] = [
  { id: "acknowledge", label: "Acknowledge", intent: "primary" },
  { id: "open-context", label: "Open context" },
];

const unavailableActions: Action[] = [
  { id: "return", label: "Return", intent: "primary" },
  { id: "search", label: "Search" },
];

function InformationalPage({
  actions = [],
  badge,
  fields = [],
  sections,
  summary,
  title,
}: InformationalPageProps) {
  return (
    <main style={layoutStyle}>
      <header style={headerStyle}>
        <div>{badge}</div>
        <h1 style={titleStyle}>{title}</h1>
        <p style={summaryStyle}>{summary}</p>
        <ActionMenu actions={actions} ariaLabel="Page actions" onAction={() => null} />
      </header>
      <div style={contentStyle}>
        <ListView
          getItemKey={(section) => section.id}
          items={sections}
          label="Information sections"
          renderItem={(section) => (
            <article style={sectionStyle}>
              <h2 style={sectionTitleStyle}>{section.title}</h2>
              <p style={sectionBodyStyle}>{section.body}</p>
              {section.detail ? <p style={sectionBodyStyle}>{section.detail}</p> : null}
            </article>
          )}
        />
        <div style={metaStyle}>
          <FieldView fields={fields} label="Page details" />
        </div>
      </div>
    </main>
  );
}

const meta = {
  title: "Examples/Informational",
  tags: ["autodocs"],
  render: (args) => <InformationalPage {...args} />,
  args: {
    actions: referenceActions,
    badge: <Badge variant="info">Reference</Badge>,
    fields: referenceFields,
    sections: referenceSections,
    summary: "A quiet informational page shell for app-owned content that should not become a public Atlas UI export.",
    title: "Information page",
  },
} satisfies Meta<InformationalPageProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReferencePage: Story = {};

export const NoticePage: Story = {
  args: {
    actions: [],
    badge: <Badge variant="warning">Notice</Badge>,
    fields: [],
    sections: noticeSections,
    summary: "A compact notice page with no visible action surface when the app supplies no actions.",
    title: "Content unavailable",
  },
};

export const UnavailablePage: Story = {
  args: {
    actions: unavailableActions,
    badge: <Badge variant="neutral">404</Badge>,
    fields: [
      { key: "state", label: "State", value: "Attention", shape: "status" },
      { key: "category", label: "Category", value: "Notice", shape: "badge" },
    ],
    sections: noticeSections,
    summary: "The destination cannot be resolved from the current app context.",
    title: "Page unavailable",
  },
};
