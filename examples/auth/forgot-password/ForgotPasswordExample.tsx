import type { CSSProperties, FormEvent } from "react";
import { useId } from "react";
import { Button, type ButtonVariant, Input } from "../../../src/primitives";

type ForgotPasswordAction = {
  id: string;
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit";
};

type ForgotPasswordField = {
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  label: string;
  name: string;
  placeholder?: string;
  type?: "email" | "password" | "text";
};

export type ForgotPasswordExampleProps = {
  actions?: ForgotPasswordAction[];
  description?: string;
  disabled?: boolean;
  eyebrow?: string;
  fields?: ForgotPasswordField[];
  notice?: string;
  title?: string;
};

const shellStyle = {
  alignItems: "center",
  background: "var(--atlas-color-bg)",
  color: "var(--atlas-color-text)",
  display: "grid",
  minHeight: "40rem",
  padding: "clamp(1rem, 4vw, 3rem)",
} satisfies CSSProperties;

const panelStyle = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "var(--atlas-radius-md)",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
  display: "grid",
  gap: "var(--atlas-space-5)",
  margin: "0 auto",
  maxWidth: "30rem",
  padding: "clamp(1.25rem, 4vw, 2rem)",
  width: "100%",
} satisfies CSSProperties;

const headerStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const eyebrowStyle = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0",
  margin: 0,
  textTransform: "uppercase",
} satisfies CSSProperties;

const headingStyle = {
  fontSize: "1.5rem",
  lineHeight: 1.2,
  margin: 0,
} satisfies CSSProperties;

const descriptionStyle = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
} satisfies CSSProperties;

const formStyle = {
  display: "grid",
  gap: "var(--atlas-space-4)",
} satisfies CSSProperties;

const actionsStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const noticeStyle = {
  background: "var(--atlas-color-surface)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "var(--atlas-radius-md)",
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
  padding: "var(--atlas-space-4)",
} satisfies CSSProperties;

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function preventSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

export function ForgotPasswordExample({
  actions = [],
  description,
  disabled = false,
  eyebrow,
  fields = [],
  notice,
  title,
}: ForgotPasswordExampleProps) {
  const titleId = useId();
  const visibleActions = actions.filter((action) => hasText(action.label));
  const visibleFields = fields.filter((field) => hasText(field.label) && hasText(field.name));
  const hasHeader = hasText(eyebrow) || hasText(title) || hasText(description);
  const hasContent = hasHeader || hasText(notice) || visibleFields.length > 0 || visibleActions.length > 0;

  if (!hasContent) return null;

  const actionButtons = visibleActions.map((action) => (
    <Button
      disabled={disabled || action.disabled}
      key={action.id}
      type={action.type ?? "button"}
      variant={action.variant ?? "secondary"}
    >
      {action.label}
    </Button>
  ));

  return (
    <main style={shellStyle} aria-labelledby={hasText(title) ? titleId : undefined}>
      <section style={panelStyle}>
        {hasHeader ? (
          <header style={headerStyle}>
            {hasText(eyebrow) ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
            {hasText(title) ? (
              <h1 id={titleId} style={headingStyle}>
                {title}
              </h1>
            ) : null}
            {hasText(description) ? <p style={descriptionStyle}>{description}</p> : null}
          </header>
        ) : null}

        {visibleFields.length > 0 ? (
          <form onSubmit={preventSubmit} style={formStyle}>
            {visibleFields.map((field) => (
              <Input
                autoComplete={field.autoComplete}
                disabled={disabled || field.disabled}
                error={field.error}
                hint={field.hint}
                key={field.name}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
              />
            ))}
            {actionButtons.length > 0 ? <div style={actionsStyle}>{actionButtons}</div> : null}
          </form>
        ) : null}

        {hasText(notice) ? <p style={noticeStyle}>{notice}</p> : null}

        {visibleFields.length === 0 && actionButtons.length > 0 ? (
          <div style={actionsStyle}>{actionButtons}</div>
        ) : null}
      </section>
    </main>
  );
}
