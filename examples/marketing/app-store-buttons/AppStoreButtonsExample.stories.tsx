import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

type StoreButtonItem = {
  id: string;
  eyebrow: string;
  label: string;
  icon: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  hidden?: boolean;
};

type AppStoreButtonsExampleProps = {
  items: StoreButtonItem[];
  label: string;
};

const shellStyle: CSSProperties = {
  background: "var(--atlas-color-bg)",
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1rem",
  maxWidth: "38rem",
  padding: "1rem",
};

const headingStyle: CSSProperties = {
  fontSize: "1.25rem",
  lineHeight: 1.2,
  margin: 0,
};

const textStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
};

const groupStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const buttonStyle: CSSProperties = {
  alignItems: "center",
  background: "#111827",
  border: "1px solid #111827",
  borderRadius: "8px",
  color: "#ffffff",
  cursor: "pointer",
  display: "inline-flex",
  gap: "0.75rem",
  minHeight: "3.5rem",
  minWidth: "10.75rem",
  padding: "0.625rem 0.875rem",
  textAlign: "left",
};

const disabledButtonStyle: CSSProperties = {
  cursor: "not-allowed",
  opacity: 0.52,
};

const iconStyle: CSSProperties = {
  alignItems: "center",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  borderRadius: "7px",
  display: "inline-flex",
  flex: "0 0 auto",
  height: "2rem",
  justifyContent: "center",
  width: "2rem",
};

const copyStyle: CSSProperties = {
  display: "grid",
  gap: "0.125rem",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 600,
  lineHeight: 1,
};

const labelStyle: CSSProperties = {
  fontSize: "1.0625rem",
  fontWeight: 700,
  lineHeight: 1,
};

const phoneIcon = (
  <svg aria-hidden="true" fill="none" height="21" viewBox="0 0 16 21" width="16">
    <rect height="18" rx="2.5" stroke="currentColor" strokeWidth="1.5" width="11" x="2.5" y="1.5" />
    <path d="M6.5 16.5h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

const playIcon = (
  <svg aria-hidden="true" fill="none" height="21" viewBox="0 0 18 21" width="18">
    <path d="M3 3.2v14.6c0 .9 1 1.4 1.7.9l10.5-7.3a1.1 1.1 0 0 0 0-1.8L4.7 2.3C4 1.8 3 2.3 3 3.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const defaultItems: StoreButtonItem[] = [
  {
    id: "app-store",
    ariaLabel: "Download on the App Store",
    eyebrow: "Download on",
    icon: phoneIcon,
    label: "App Store",
  },
  {
    id: "google-play",
    ariaLabel: "Get it on Google Play",
    eyebrow: "Get it on",
    icon: playIcon,
    label: "Google Play",
  },
];

function AppStoreButtonsExample({ items, label }: AppStoreButtonsExampleProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section aria-label={label} style={shellStyle}>
      <div>
        <h2 style={headingStyle}>Mobile app access</h2>
        <p style={textStyle}>Continue from any device with the mobile app.</p>
      </div>

      <div style={groupStyle}>
        {visibleItems.map((item) => (
          <button
            aria-label={item.ariaLabel}
            disabled={item.disabled}
            key={item.id}
            style={item.disabled ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
            type="button"
          >
            <span style={iconStyle}>{item.icon}</span>
            <span style={copyStyle}>
              <span style={eyebrowStyle}>{item.eyebrow}</span>
              <span style={labelStyle}>{item.label}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: "Examples/Marketing/App Store Buttons",
  tags: ["autodocs"],
  render: (args) => <AppStoreButtonsExample {...args} />,
  args: {
    items: defaultItems,
    label: "Mobile app store links",
  },
} satisfies Meta<AppStoreButtonsExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleDestination: Story = {
  args: {
    items: defaultItems.slice(0, 1),
  },
};

export const DisabledDestination: Story = {
  args: {
    items: defaultItems.map((item) =>
      item.id === "google-play" ? { ...item, disabled: true } : item,
    ),
  },
};

export const HiddenWhenEmpty: Story = {
  args: {
    items: [],
  },
};
