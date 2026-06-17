import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button } from "../../../src/primitives";
import type { BadgeVariant, ButtonVariant } from "../../../src/primitives";

type HeaderAction = {
  id: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
  variant?: ButtonVariant;
};

type HeaderBadge = {
  label: string;
  variant?: BadgeVariant;
};

type SectionHeader = {
  id: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  badge?: HeaderBadge;
  actions?: HeaderAction[];
};

type SectionHeadersExampleProps = {
  headers: SectionHeader[];
  layout?: "stacked" | "split";
};

const pageStyle = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "var(--atlas-space-5)",
  maxWidth: "64rem",
} satisfies CSSProperties;

const listStyle = {
  display: "grid",
  gap: "var(--atlas-space-4)",
} satisfies CSSProperties;

const splitListStyle = {
  ...listStyle,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
} satisfies CSSProperties;

const headerStyle = {
  alignItems: "start",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "var(--atlas-radius-md)",
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--atlas-space-4)",
  justifyContent: "space-between",
  padding: "var(--atlas-space-5)",
} satisfies CSSProperties;

const copyStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
  minWidth: 0,
} satisfies CSSProperties;

const titleRowStyle = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const eyebrowStyle = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: 0,
  margin: 0,
  textTransform: "uppercase",
} satisfies CSSProperties;

const titleStyle = {
  fontSize: "1.125rem",
  lineHeight: 1.3,
  margin: 0,
} satisfies CSSProperties;

const descriptionStyle = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
  maxWidth: "42rem",
} satisfies CSSProperties;

const actionsStyle = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const defaultHeaders: SectionHeader[] = [
  {
    id: "header-alpha",
    eyebrow: "Group A",
    title: "Primary section",
    description: "Use the heading to name the work area and the description to set scope.",
    badge: { label: "Ready", variant: "success" },
    actions: [
      { id: "primary-action", label: "Primary action", variant: "primary" },
      { id: "secondary-action", label: "Secondary action", variant: "secondary" },
    ],
  },
  {
    id: "header-beta",
    eyebrow: "Group B",
    title: "Supporting section",
    description: "Keep supporting text short enough to scan before the next surface begins.",
    badge: { label: "Optional", variant: "info" },
  },
  {
    id: "header-gamma",
    title: "Review section",
    description: "Disabled actions can stay visible when they explain an unavailable step.",
    actions: [{ id: "review-action", label: "Review action", disabled: true, variant: "secondary" }],
  },
];

function hasMeaningfulHeader(header: SectionHeader) {
  const visibleActions = getVisibleActions(header.actions);

  return Boolean(
    hasText(header.title) ||
      hasText(header.description) ||
      hasText(header.eyebrow) ||
      hasText(header.badge?.label) ||
      visibleActions.length,
  );
}

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function getVisibleActions(actions: HeaderAction[] = []) {
  return actions.filter((action) => !action.hidden && hasText(action.label));
}

function SectionHeadersExample({ headers, layout = "stacked" }: SectionHeadersExampleProps) {
  const visibleHeaders = headers.filter(hasMeaningfulHeader);

  if (!visibleHeaders.length) return null;

  return (
    <main style={pageStyle}>
      <div style={layout === "split" ? splitListStyle : listStyle}>
        {visibleHeaders.map((header) => {
          const visibleActions = getVisibleActions(header.actions);
          const eyebrow = header.eyebrow?.trim();
          const title = header.title?.trim();
          const description = header.description?.trim();
          const badgeLabel = header.badge?.label.trim();
          const titleId = title ? `${header.id}-title` : undefined;

          return (
            <section aria-labelledby={titleId} key={header.id} style={headerStyle}>
              <div style={copyStyle}>
                {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
                <div style={titleRowStyle}>
                  {title ? (
                    <h2 id={titleId} style={titleStyle}>
                      {title}
                    </h2>
                  ) : null}
                  {badgeLabel ? (
                    <Badge variant={header.badge?.variant ?? "neutral"}>{badgeLabel}</Badge>
                  ) : null}
                </div>
                {description ? <p style={descriptionStyle}>{description}</p> : null}
              </div>

              {visibleActions.length ? (
                <div aria-label={`${title ?? header.id} actions`} style={actionsStyle}>
                  {visibleActions.map((action) => (
                    <Button
                      disabled={action.disabled}
                      key={action.id}
                      size="sm"
                      type="button"
                      variant={action.variant ?? "secondary"}
                    >
                      {action.label.trim()}
                    </Button>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </main>
  );
}

const meta = {
  title: "Examples/Sections/Headers",
  tags: ["autodocs"],
  render: (args) => <SectionHeadersExample {...args} />,
  args: {
    headers: defaultHeaders,
    layout: "stacked",
  },
  argTypes: {
    layout: {
      control: "radio",
      options: ["stacked", "split"],
    },
  },
} satisfies Meta<SectionHeadersExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Stacked: Story = {};

export const Split: Story = {
  args: {
    layout: "split",
  },
};

export const Minimal: Story = {
  args: {
    headers: [
      {
        id: "minimal-header",
        title: "Compact section",
        description: "A header can render with just the meaningful copy.",
      },
    ],
  },
};

export const HiddenWhenEmpty: Story = {
  args: {
    headers: [
      {
        id: "empty-header",
        actions: [{ id: "hidden-action", hidden: true, label: "Hidden action" }],
      },
    ],
  },
};
