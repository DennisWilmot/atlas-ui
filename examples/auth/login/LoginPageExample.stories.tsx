import type { CSSProperties, FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Input } from "../../../src/primitives";

type LoginPageExampleProps = {
  disabled?: boolean;
  layout?: "centered" | "split";
  passwordError?: string;
  providerActions?: ProviderAction[];
  supportActionLabel?: string;
};

type ProviderAction = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
};

const pageStyle: CSSProperties = {
  background: "#f8fafc",
  color: "#111827",
  display: "grid",
  minHeight: "42rem",
  placeItems: "center",
  padding: "clamp(1rem, 4vw, 4rem)",
};

const shellStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  boxShadow: "0 16px 48px rgb(15 23 42 / 0.08)",
  display: "grid",
  overflow: "hidden",
  width: "min(100%, 58rem)",
};

const splitShellStyle: CSSProperties = {
  ...shellStyle,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
};

const panelStyle: CSSProperties = {
  display: "grid",
  gap: "1.25rem",
  padding: "clamp(1.5rem, 4vw, 3rem)",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
};

const titleStyle: CSSProperties = {
  fontSize: "1.75rem",
  lineHeight: 1.2,
  margin: 0,
};

const textStyle: CSSProperties = {
  color: "#4b5563",
  lineHeight: 1.6,
  margin: 0,
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const providerGroupStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

const providerButtonStyle: CSSProperties = {
  width: "100%",
};

const providerIconStyle: CSSProperties = {
  alignItems: "center",
  background: "#eef2ff",
  borderRadius: "999px",
  display: "inline-flex",
  fontSize: "0.75rem",
  fontWeight: 700,
  height: "1.25rem",
  justifyContent: "center",
  width: "1.25rem",
};

const dividerStyle: CSSProperties = {
  alignItems: "center",
  color: "#6b7280",
  display: "grid",
  fontSize: "0.8125rem",
  gap: "0.75rem",
  gridTemplateColumns: "1fr auto 1fr",
};

const dividerLineStyle: CSSProperties = {
  background: "#e5e7eb",
  height: "1px",
};

const actionsStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  justifyContent: "space-between",
};

const asideStyle: CSSProperties = {
  alignContent: "end",
  background: "#172554",
  color: "#ffffff",
  display: "grid",
  gap: "1rem",
  minHeight: "28rem",
  padding: "clamp(1.5rem, 4vw, 3rem)",
};

const asideKickerStyle: CSSProperties = {
  color: "#bfdbfe",
  fontSize: "0.8125rem",
  fontWeight: 700,
  margin: 0,
  textTransform: "uppercase",
};

const providerActions: ProviderAction[] = [
  {
    id: "provider-a",
    label: "Continue with Provider A",
    icon: "A",
  },
  {
    id: "provider-b",
    label: "Continue with Provider B",
    icon: "B",
  },
];

function preventSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function LoginPageExample({
  disabled = false,
  layout = "centered",
  passwordError,
  providerActions = [],
  supportActionLabel = "Use recovery access",
}: LoginPageExampleProps) {
  const isSplit = layout === "split";
  const visibleProviderActions = providerActions.filter((action) => action.label.trim().length > 0);

  return (
    <main style={pageStyle}>
      <section style={isSplit ? splitShellStyle : shellStyle} aria-label="Workspace sign in">
        <div style={panelStyle}>
          <header style={headerStyle}>
            <p style={{ ...textStyle, fontWeight: 700 }}>Workspace access</p>
            <h1 style={titleStyle}>Sign in</h1>
            <p style={textStyle}>Enter your credentials to continue.</p>
          </header>

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
                  style={providerButtonStyle}
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

          <form style={formStyle} onSubmit={preventSubmit}>
            <Input
              autoComplete="username"
              disabled={disabled}
              label="Email address"
              name="email"
              type="email"
            />
            <Input
              autoComplete="current-password"
              disabled={disabled}
              error={passwordError}
              label="Password"
              name="password"
              type="password"
            />

            <div style={actionsStyle}>
              <Button disabled={disabled} type="submit">
                Continue
              </Button>
              <Button disabled={disabled} type="button" variant="ghost">
                {supportActionLabel}
              </Button>
            </div>
          </form>
        </div>

        {isSplit ? (
          <aside style={asideStyle} aria-label="Access context">
            <p style={asideKickerStyle}>Secure workspace</p>
            <h2 style={{ fontSize: "1.5rem", lineHeight: 1.25, margin: 0 }}>
              Start from the same workspace every time.
            </h2>
            <p style={{ ...textStyle, color: "#dbeafe" }}>
              Use your credentials to restore access to the work already assigned to you.
            </p>
          </aside>
        ) : null}
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Auth/Login",
  tags: ["autodocs"],
  render: (args) => <LoginPageExample {...args} />,
  args: {
    disabled: false,
    layout: "centered",
    supportActionLabel: "Use recovery access",
  },
  argTypes: {
    layout: {
      control: "radio",
      options: ["centered", "split"],
    },
  },
} satisfies Meta<LoginPageExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Centered: Story = {};

export const SplitPanel: Story = {
  args: {
    layout: "split",
  },
};

export const ProviderButtons: Story = {
  args: {
    providerActions,
  },
};

export const Validation: Story = {
  args: {
    passwordError: "Enter a password.",
    providerActions,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    providerActions,
  },
};
