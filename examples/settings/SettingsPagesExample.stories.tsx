import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionMenu, FieldView, SelectView, TableView } from "../../src/patterns";
import { Badge } from "../../src/primitives";
import type { Action, Field, SelectItem, TableColumn } from "../../src/types";

type SettingRow = {
  id: string;
  setting: string;
  value: string;
  state: string;
} & Record<string, unknown>;

const pageStyle: CSSProperties = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1.25rem",
  maxWidth: "64rem",
};

const headerStyle: CSSProperties = {
  alignItems: "start",
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  justifyContent: "space-between",
};

const stackStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

const sectionGridStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
};

const sectionStyle: CSSProperties = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "1rem",
  padding: "1rem",
};

const sectionHeaderStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: "0.75rem",
  justifyContent: "space-between",
};

const mutedStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "1.5rem",
  lineHeight: 1.2,
  margin: 0,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "1rem",
  margin: 0,
};

const fields: Field[] = [
  { key: "workspace-label", label: "Workspace label", value: "Configured" },
  { key: "interface-density", label: "Interface density", value: "Compact" },
  { key: "default-mode", label: "Default mode", value: "System" },
  { key: "change-window", label: "Change window", value: "Scheduled" },
];

const actions: Action[] = [
  { id: "apply", intent: "primary", label: "Apply changes" },
  { id: "review", label: "Review changes" },
  { id: "discard", disabled: true, label: "Discard pending" },
];

const options: SelectItem[] = Array.from({ length: 11 }, (_, index) => ({
  id: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

const rows: SettingRow[] = [
  { id: "setting-a", setting: "Preference A", state: "Ready", value: "Enabled" },
  { id: "setting-b", setting: "Preference B", state: "Pending", value: "Manual" },
  { id: "setting-c", setting: "Preference C", state: "Ready", value: "Standard" },
];

const columns: TableColumn<SettingRow>[] = [
  { key: "setting", label: "Setting" },
  { key: "value", label: "Value" },
  {
    key: "state",
    label: "State",
    render: (row) => <Badge variant={row.state === "Ready" ? "success" : "warning"}>{row.state}</Badge>,
  },
];

function SettingsPagesExample() {
  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div style={stackStyle}>
          <h1 style={titleStyle}>Settings</h1>
          <p style={mutedStyle}>Preferences and defaults.</p>
        </div>
        <ActionMenu actions={actions} ariaLabel="Settings actions" />
      </header>

      <div style={sectionGridStyle}>
        <section aria-labelledby="settings-general" style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 id="settings-general" style={sectionTitleStyle}>General</h2>
            <Badge variant="success">Ready</Badge>
          </div>
          <FieldView fields={fields} label="General settings" />
        </section>

        <section aria-labelledby="settings-defaults" style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h2 id="settings-defaults" style={sectionTitleStyle}>Defaults</h2>
            <Badge variant="info">Options</Badge>
          </div>
          <SelectView items={options} label="Default option" value="option-2" />
        </section>
      </div>

      <section aria-labelledby="settings-summary" style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 id="settings-summary" style={sectionTitleStyle}>Summary</h2>
          <Badge variant="neutral">Active</Badge>
        </div>
        <TableView columns={columns} getRowKey={(row) => row.id} label="Settings summary" rows={rows} />
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Settings",
  tags: ["autodocs"],
  render: () => <SettingsPagesExample />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralSettingsPage: Story = {};
