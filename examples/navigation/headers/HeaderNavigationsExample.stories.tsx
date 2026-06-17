import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionMenu } from "../../../src/patterns";
import type { Action } from "../../../src/types";

type HeaderNavItem = {
  id: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
};

type HeaderNavigationExampleProps = {
  actions?: Action[];
  brandLabel?: string;
  compact?: boolean;
  currentItemId?: string;
  disabled?: boolean;
  items?: HeaderNavItem[];
  statusLabel?: string;
  onAction?: (actionId: string) => void;
  onNavigate?: (itemId: string) => void;
};

const pageStyle: CSSProperties = {
  background: "var(--atlas-color-surface)",
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1rem",
  minHeight: "18rem",
  padding: "clamp(1rem, 4vw, 2rem)",
};

const headerStyle: CSSProperties = {
  alignItems: "center",
  background: "var(--atlas-color-bg)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  justifyContent: "space-between",
  padding: "0.875rem 1rem",
};

const compactHeaderStyle: CSSProperties = {
  ...headerStyle,
  alignItems: "stretch",
  display: "grid",
};

const identityStyle: CSSProperties = {
  alignItems: "center",
  display: "inline-flex",
  gap: "0.75rem",
  minWidth: 0,
};

const brandStyle: CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
};

const statusStyle: CSSProperties = {
  background: "var(--atlas-color-surface)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "999px",
  color: "var(--atlas-color-muted)",
  fontSize: "0.75rem",
  fontWeight: 700,
  lineHeight: 1,
  padding: "0.375rem 0.625rem",
};

const navListStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const navButtonStyle: CSSProperties = {
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "8px",
  color: "var(--atlas-color-muted)",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 700,
  minHeight: "2.25rem",
  padding: "0 0.75rem",
};

const activeNavButtonStyle: CSSProperties = {
  ...navButtonStyle,
  background: "var(--atlas-color-surface)",
  borderColor: "var(--atlas-color-border)",
  color: "var(--atlas-color-text)",
};

const disabledNavButtonStyle: CSSProperties = {
  ...navButtonStyle,
  cursor: "not-allowed",
  opacity: 0.58,
};

const contentStyle: CSSProperties = {
  background: "var(--atlas-color-bg)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "0.5rem",
  padding: "1rem",
};

const contentTitleStyle: CSSProperties = {
  fontSize: "1rem",
  margin: 0,
};

const contentTextStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  lineHeight: 1.5,
  margin: 0,
};

const defaultItems: HeaderNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

const defaultActions: Action[] = [
  { id: "review", label: "Review" },
  { id: "create", intent: "primary", label: "Create" },
];

const secondaryActions: Action[] = [
  { id: "filter", label: "Filter" },
  { id: "sync", label: "Sync", disabled: true },
];

function getVisibleItems(items: HeaderNavItem[]) {
  return items.filter((item) => !item.hidden);
}

function getActionState(actions: Action[], disabled: boolean) {
  return actions.map((action) => ({
    ...action,
    disabled: disabled || action.disabled,
  }));
}

function HeaderNavigationExample({
  actions = defaultActions,
  brandLabel = "Workspace",
  compact = false,
  currentItemId = "overview",
  disabled = false,
  items = defaultItems,
  onAction,
  onNavigate,
  statusLabel = "Active",
}: HeaderNavigationExampleProps) {
  const visibleItems = getVisibleItems(items);
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleItems.length === 0 && visibleActions.length === 0 && !statusLabel) return null;

  return (
    <main style={pageStyle}>
      <header
        aria-label={`${brandLabel} navigation`}
        style={compact ? compactHeaderStyle : headerStyle}
      >
        <div style={identityStyle}>
          <p style={brandStyle}>{brandLabel}</p>
          {statusLabel ? <span style={statusStyle}>{statusLabel}</span> : null}
        </div>

        {visibleItems.length > 0 ? (
          <nav aria-label="Primary">
            <ul style={navListStyle}>
              {visibleItems.map((item) => {
                const active = item.id === currentItemId;
                const itemDisabled = disabled || item.disabled;

                return (
                  <li key={item.id}>
                    <button
                      aria-current={active ? "page" : undefined}
                      disabled={itemDisabled}
                      onClick={() => {
                        if (!itemDisabled) onNavigate?.(item.id);
                      }}
                      style={
                        itemDisabled
                          ? disabledNavButtonStyle
                          : active
                            ? activeNavButtonStyle
                            : navButtonStyle
                      }
                      type="button"
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        <ActionMenu
          actions={getActionState(actions, disabled)}
          ariaLabel="Header actions"
          onAction={onAction}
        />
      </header>

      <section aria-labelledby="header-navigation-current" style={contentStyle}>
        <h2 id="header-navigation-current" style={contentTitleStyle}>
          {visibleItems.find((item) => item.id === currentItemId)?.label ?? brandLabel}
        </h2>
        <p style={contentTextStyle}>Current section content.</p>
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Navigation/Headers",
  tags: ["autodocs"],
  render: (args) => <HeaderNavigationExample {...args} />,
  args: {
    actions: defaultActions,
    brandLabel: "Workspace",
    compact: false,
    currentItemId: "overview",
    disabled: false,
    items: defaultItems,
    statusLabel: "Active",
  },
  argTypes: {
    compact: {
      control: "boolean",
    },
    currentItemId: {
      control: "radio",
      options: defaultItems.map((item) => item.id),
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<HeaderNavigationExampleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimaryHeader: Story = {};

export const CompactHeader: Story = {
  args: {
    actions: secondaryActions,
    compact: true,
    currentItemId: "activity",
    statusLabel: "Pending",
  },
};

export const DisabledHeader: Story = {
  args: {
    disabled: true,
  },
};

export const HiddenWhenEmpty: Story = {
  args: {
    actions: [],
    items: [],
    statusLabel: "",
  },
};
