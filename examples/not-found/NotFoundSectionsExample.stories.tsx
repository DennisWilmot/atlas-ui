import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const pageStyle: CSSProperties = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1.25rem",
  maxWidth: "56rem",
};

const stackStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

const sectionStyle: CSSProperties = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "1rem",
  padding: "1rem",
};

const quietSectionStyle: CSSProperties = {
  ...sectionStyle,
  background: "var(--atlas-color-surface)",
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

const mutedStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  margin: 0,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const buttonStyle: CSSProperties = {
  background: "var(--atlas-color-primary)",
  border: "1px solid var(--atlas-color-primary)",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 600,
  padding: "0.5rem 0.75rem",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "var(--atlas-color-bg)",
  borderColor: "var(--atlas-color-border)",
  color: "var(--atlas-color-text)",
};

const suggestionGridStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
};

const suggestionStyle: CSSProperties = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "0.25rem",
  padding: "0.75rem",
};

const pillStyle: CSSProperties = {
  alignSelf: "start",
  background: "var(--atlas-color-bg)",
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "999px",
  color: "var(--atlas-color-muted)",
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "0.25rem 0.5rem",
};

const suggestions = ["Overview", "Records", "Settings"];

function NotFoundSectionsExample() {
  return (
    <main style={pageStyle}>
      <header style={stackStyle}>
        <h1 style={titleStyle}>Section not found</h1>
        <p style={mutedStyle}>
          Example-only treatment for unavailable sections without adding a public component export.
        </p>
      </header>

      <section aria-labelledby="missing-primary-section" style={quietSectionStyle}>
        <span style={pillStyle}>Reference only</span>
        <div style={stackStyle}>
          <h2 id="missing-primary-section" style={sectionTitleStyle}>Requested section is unavailable</h2>
          <p style={mutedStyle}>
            The supplied context does not match an available section. Keep the response short and route the app-owned action through the consuming product.
          </p>
        </div>
        <div style={actionRowStyle}>
          <button style={buttonStyle} type="button">Open overview</button>
          <button style={secondaryButtonStyle} type="button">Search records</button>
        </div>
      </section>

      <section aria-labelledby="missing-inline-section" style={sectionStyle}>
        <div style={stackStyle}>
          <h2 id="missing-inline-section" style={sectionTitleStyle}>Inline missing section</h2>
          <p style={mutedStyle}>
            Use this treatment when the surrounding page is still meaningful and only one region cannot render.
          </p>
        </div>
      </section>

      <section aria-labelledby="not-found-suggestions" style={sectionStyle}>
        <div style={stackStyle}>
          <h2 id="not-found-suggestions" style={sectionTitleStyle}>Suggested sections</h2>
          <p style={mutedStyle}>Neutral labels keep the reference reusable across products.</p>
        </div>
        <div style={suggestionGridStyle}>
          {suggestions.map((suggestion) => (
            <div key={suggestion} style={suggestionStyle}>
              <strong>{suggestion}</strong>
              <span style={mutedStyle}>Available section</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const meta = {
  title: "Examples/Not Found",
  tags: ["autodocs"],
  render: () => <NotFoundSectionsExample />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NeutralNotFoundSections: Story = {};
