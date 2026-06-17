import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, InputHTMLAttributes } from "react";
import { useId } from "react";
import { Button, Input } from "../../../src/primitives";

type SignupField = {
  id: string;
  label: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  hint?: string;
};

type ProviderAction = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
};

type SignupPageExampleProps = {
  description: string;
  disabled?: boolean;
  fields: SignupField[];
  heading: string;
  providerActions?: ProviderAction[];
  secondaryActionLabel?: string;
  submitLabel: string;
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
  maxWidth: "28rem",
  padding: "clamp(1.25rem, 4vw, 2rem)",
  width: "100%",
} satisfies CSSProperties;

const headerStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
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

const providerGroupStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const providerIconStyle = {
  alignItems: "center",
  background: "#ecfdf5",
  borderRadius: "999px",
  display: "inline-flex",
  fontSize: "0.75rem",
  fontWeight: 700,
  height: "1.25rem",
  justifyContent: "center",
  width: "1.25rem",
} satisfies CSSProperties;

const dividerStyle = {
  alignItems: "center",
  color: "var(--atlas-color-muted)",
  display: "grid",
  fontSize: "0.8125rem",
  gap: "var(--atlas-space-3)",
  gridTemplateColumns: "1fr auto 1fr",
} satisfies CSSProperties;

const dividerLineStyle = {
  background: "var(--atlas-color-border)",
  height: "1px",
} satisfies CSSProperties;

const actionsStyle = {
  display: "grid",
  gap: "var(--atlas-space-2)",
} satisfies CSSProperties;

const defaultFields: SignupField[] = [
  {
    id: "account-email",
    label: "Email",
    type: "email",
    autoComplete: "email",
  },
  {
    id: "account-password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: "Use a unique password.",
  },
];

const providerActions: ProviderAction[] = [
  {
    id: "provider-a",
    label: "Create with Provider A",
    icon: "A",
  },
  {
    id: "provider-b",
    label: "Create with Provider B",
    icon: "B",
  },
];

function SignupPageExample({
  description,
  disabled = false,
  fields,
  heading,
  providerActions = [],
  secondaryActionLabel,
  submitLabel,
}: SignupPageExampleProps) {
  const headingId = useId();
  const visibleProviderActions = providerActions.filter((action) => action.label.trim().length > 0);

  return (
    <main style={shellStyle}>
      <section aria-labelledby={headingId} style={panelStyle}>
        <div style={headerStyle}>
          <h1 id={headingId} style={headingStyle}>
            {heading}
          </h1>
          <p style={descriptionStyle}>{description}</p>
        </div>

        {visibleProviderActions.length > 0 ? (
          <div aria-label="Identity provider access" role="group" style={providerGroupStyle}>
            {visibleProviderActions.map((action) => (
              <Button
                disabled={disabled || action.disabled}
                key={action.id}
                leftIcon={
                  action.icon ? (
                    <span aria-hidden="true" style={providerIconStyle}>
                      {action.icon}
                    </span>
                  ) : undefined
                }
                type="button"
                variant="secondary"
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}

        {visibleProviderActions.length > 0 ? (
          <div aria-hidden="true" style={dividerStyle}>
            <span style={dividerLineStyle} />
            <span>or</span>
            <span style={dividerLineStyle} />
          </div>
        ) : null}

        <form
          style={formStyle}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {fields.map((field) => (
            <Input
              autoComplete={field.autoComplete}
              disabled={disabled}
              hint={field.hint}
              id={field.id}
              key={field.id}
              label={field.label}
              required
              type={field.type}
            />
          ))}

          <div style={actionsStyle}>
            <Button disabled={disabled} type="submit">
              {submitLabel}
            </Button>
            {secondaryActionLabel ? (
              <Button disabled={disabled} type="button" variant="ghost">
                {secondaryActionLabel}
              </Button>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Auth/Signup",
  tags: ["autodocs"],
  render: (args) => <SignupPageExample {...args} />,
  args: {
    description: "Create a new account with only the information needed to continue.",
    fields: defaultFields,
    heading: "Create account",
    secondaryActionLabel: "Use an existing account",
    submitLabel: "Create account",
  },
} satisfies Meta<SignupPageExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    description: "Start with an email address.",
    fields: defaultFields.slice(0, 1),
    secondaryActionLabel: undefined,
  },
};

export const ProviderButtons: Story = {
  args: {
    providerActions,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    providerActions,
  },
};
