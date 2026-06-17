import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

type EmailBlock = {
  heading: string;
  body: string;
  items?: string[];
  actionLabel?: string;
};

type EmailTemplate = {
  id: string;
  label: string;
  subject: string;
  preheader: string;
  blocks: EmailBlock[];
  finePrint: string;
};

const templates: EmailTemplate[] = [
  {
    id: "workspace-update",
    label: "Workspace update",
    subject: "Workspace settings changed",
    preheader: "Review the latest workspace activity.",
    blocks: [
      {
        heading: "Summary",
        body: "A workspace setting was updated. Review the change before taking any follow-up action.",
        actionLabel: "Review settings",
      },
      {
        heading: "Details",
        body: "The message body stays neutral and app-owned. Atlas UI does not ship recipient data, routes, or delivery logic.",
      },
    ],
    finePrint: "Notification preferences are managed by the host application.",
  },
  {
    id: "record-digest",
    label: "Record digest",
    subject: "Workspace digest",
    preheader: "A concise summary of records that need attention.",
    blocks: [
      {
        heading: "Needs attention",
        body: "Use generic record labels in examples and keep business context in the host application.",
        items: ["Record A is waiting for review.", "Record B has a new status.", "Record C is ready to archive."],
      },
      {
        heading: "Next step",
        body: "Action labels are presentational in this example. Links and handlers belong to the application.",
        actionLabel: "Open workspace",
      },
    ],
    finePrint: "This reference is not exported from the package.",
  },
];

const styles: Record<string, CSSProperties> = {
  canvas: {
    background: "#eef3f8",
    color: "var(--atlas-color-text)",
    display: "grid",
    gap: "1rem",
    padding: "1.5rem",
  },
  layout: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
  },
  preview: {
    background: "#ffffff",
    border: "1px solid var(--atlas-color-border)",
    borderRadius: "8px",
    boxShadow: "0 12px 28px rgb(16 42 67 / 0.08)",
    overflow: "hidden",
  },
  header: {
    background: "#102a43",
    color: "#ffffff",
    display: "grid",
    gap: "0.25rem",
    padding: "1rem",
  },
  label: {
    color: "#9fb3c8",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0",
    textTransform: "uppercase",
  },
  subject: {
    fontSize: "1.125rem",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  preheader: {
    color: "#d9e2ec",
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  body: {
    display: "grid",
    gap: "1rem",
    padding: "1rem",
  },
  block: {
    display: "grid",
    gap: "0.5rem",
  },
  heading: {
    color: "var(--atlas-color-text)",
    fontSize: "0.875rem",
    fontWeight: 700,
    lineHeight: 1.4,
  },
  paragraph: {
    color: "var(--atlas-color-muted)",
    fontSize: "0.875rem",
    lineHeight: 1.55,
    margin: 0,
  },
  list: {
    display: "grid",
    gap: "0.375rem",
    margin: 0,
    paddingInlineStart: "1.125rem",
  },
  action: {
    background: "var(--atlas-color-primary)",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-flex",
    fontSize: "0.875rem",
    fontWeight: 700,
    justifyContent: "center",
    lineHeight: 1,
    padding: "0.75rem 1rem",
    width: "fit-content",
  },
  footer: {
    borderTop: "1px solid var(--atlas-color-border)",
    color: "var(--atlas-color-muted)",
    fontSize: "0.75rem",
    lineHeight: 1.5,
    padding: "1rem",
  },
};

function EmailTemplatePreview({ template }: { template: EmailTemplate }) {
  const visibleBlocks = template.blocks.filter((block) => block.heading && block.body);

  if (!template.subject || visibleBlocks.length === 0) return null;

  return (
    <article aria-label={template.label} style={styles.preview}>
      <header style={styles.header}>
        <div style={styles.label}>{template.label}</div>
        <div style={styles.subject}>{template.subject}</div>
        <div style={styles.preheader}>{template.preheader}</div>
      </header>
      <div style={styles.body}>
        {visibleBlocks.map((block) => (
          <section key={block.heading} style={styles.block}>
            <div style={styles.heading}>{block.heading}</div>
            <p style={styles.paragraph}>{block.body}</p>
            {block.items && block.items.length > 0 ? (
              <ul style={styles.list}>
                {block.items.map((item) => (
                  <li key={item} style={styles.paragraph}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {block.actionLabel ? <span style={styles.action}>{block.actionLabel}</span> : null}
          </section>
        ))}
      </div>
      <footer style={styles.footer}>{template.finePrint}</footer>
    </article>
  );
}

const meta = {
  title: "Examples/Email",
  tags: ["autodocs"],
  render: () => (
    <div style={styles.canvas}>
      <div style={styles.layout}>
        {templates.map((template) => (
          <EmailTemplatePreview key={template.id} template={template} />
        ))}
      </div>
    </div>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralTemplates: Story = {};
