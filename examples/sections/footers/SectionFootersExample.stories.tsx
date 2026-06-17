import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "../../../src/primitives";
import type { BadgeVariant } from "../../../src/primitives/Badge";

type FooterAction = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
};

type FooterNote = {
  id: string;
  label: string;
  variant?: BadgeVariant;
};

type FooterSection = {
  id: string;
  title: string;
  description: string;
  notes?: FooterNote[];
  actions?: FooterAction[];
};

type SectionFootersExampleProps = {
  sections: FooterSection[];
};

const pageStyle: CSSProperties = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1rem",
  maxWidth: "58rem",
};

const sectionStyle: CSSProperties = {
  background: "var(--atlas-color-bg)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "1rem",
  overflow: "hidden",
};

const sectionBodyStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
  padding: "1rem",
};

const titleStyle: CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.3,
  margin: 0,
};

const textStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
};

const footerStyle: CSSProperties = {
  alignItems: "center",
  background: "var(--atlas-color-surface)",
  borderTop: "1px solid var(--atlas-color-border)",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  justifyContent: "space-between",
  minHeight: "3.75rem",
  padding: "0.75rem 1rem",
};

const notesStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const actionsStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const defaultSections: FooterSection[] = [
  {
    id: "section-a",
    title: "Section A",
    description: "A compact footer can expose the next useful actions after the section content.",
    notes: [
      { id: "state-a", label: "Ready", variant: "success" },
      { id: "mode-a", label: "Optional", variant: "neutral" },
    ],
    actions: [
      { id: "secondary-a", label: "Secondary option", variant: "secondary" },
      { id: "primary-a", label: "Primary action" },
    ],
  },
  {
    id: "section-b",
    title: "Section B",
    description: "Footer content can remain quiet when there are only supporting details to show.",
    notes: [{ id: "state-b", label: "Reference", variant: "info" }],
    actions: [{ id: "primary-b", label: "Continue" }],
  },
  {
    id: "section-c",
    title: "Section C",
    description: "Disabled actions remain visible only when their unavailable state is meaningful.",
    notes: [{ id: "state-c", label: "Paused", variant: "warning" }],
    actions: [
      { id: "secondary-c", label: "Review", variant: "secondary" },
      { id: "primary-c", label: "Unavailable", disabled: true },
    ],
  },
];

const readOnlySections: FooterSection[] = [
  {
    id: "section-readonly",
    title: "Read-only section",
    description: "The footer can provide status context without presenting actions.",
    notes: [
      { id: "state-readonly", label: "Read-only", variant: "neutral" },
      { id: "mode-readonly", label: "Stable", variant: "success" },
    ],
  },
];

function SectionFooter({ section }: { section: FooterSection }) {
  const hasNotes = Boolean(section.notes?.length);
  const hasActions = Boolean(section.actions?.length);

  return (
    <section aria-labelledby={`${section.id}-title`} style={sectionStyle}>
      <div style={sectionBodyStyle}>
        <h2 id={`${section.id}-title`} style={titleStyle}>
          {section.title}
        </h2>
        <p style={textStyle}>{section.description}</p>
      </div>

      {hasNotes || hasActions ? (
        <footer style={footerStyle}>
          {hasNotes ? (
            <div aria-label={`${section.title} notes`} style={notesStyle}>
              {section.notes?.map((note) => (
                <Badge key={note.id} variant={note.variant ?? "neutral"}>
                  {note.label}
                </Badge>
              ))}
            </div>
          ) : null}

          {hasActions ? (
            <div aria-label={`${section.title} actions`} style={actionsStyle}>
              {section.actions?.map((action) => (
                <Button
                  disabled={action.disabled}
                  key={action.id}
                  size="sm"
                  type="button"
                  variant={action.variant ?? "primary"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </footer>
      ) : null}
    </section>
  );
}

function SectionFootersExample({ sections }: SectionFootersExampleProps) {
  return (
    <main style={pageStyle}>
      {sections.map((section) => (
        <SectionFooter key={section.id} section={section} />
      ))}
    </main>
  );
}

const meta = {
  title: "Examples/Sections/Footers",
  tags: ["autodocs"],
  render: (args) => <SectionFootersExample {...args} />,
  args: {
    sections: defaultSections,
  },
} satisfies Meta<SectionFootersExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    sections: readOnlySections,
  },
};

export const FooterHidden: Story = {
  args: {
    sections: [
      {
        id: "section-empty-footer",
        title: "Section without footer content",
        description: "When there are no meaningful notes or actions, the footer is omitted.",
      },
    ],
  },
};
