import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Migration Reference/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Release candidate Storybook navigation keeps docs, primitives, patterns, examples, and migration reference material in separate top-level groups.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <section
      style={{
        display: "grid",
        gap: "24px",
        padding: "32px",
      }}
    >
      <section
        style={{
          display: "grid",
          gap: "12px",
          padding: "24px",
          border: "1px solid #d7deea",
          borderRadius: "20px",
          background: "linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%)",
        }}
      >
        <h2 style={{ margin: 0 }}>Storybook release structure</h2>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li><code>Docs</code> for onboarding and package usage.</li>
          <li><code>Primitives</code> for exported dumb building blocks.</li>
          <li><code>Patterns</code> for exported URA-shaped compositions.</li>
          <li><code>Examples</code> for full-screen references and mock pages only.</li>
          <li><code>Migration Reference</code> for audit and release review context.</li>
        </ul>
      </section>
      <section
        style={{
          display: "grid",
          gap: "12px",
          padding: "24px",
          border: "1px solid #d7deea",
          borderRadius: "20px",
          background: "linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%)",
        }}
      >
        <h2 style={{ margin: 0 }}>Current public surface</h2>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li><code>atlas-ui/primitives</code>: 29 public primitives.</li>
          <li><code>atlas-ui/patterns</code>: 30 public patterns.</li>
          <li><code>atlas-ui/types</code> and <code>atlas-ui/headless</code>: support contracts and utilities.</li>
          <li><code>examples/</code>: Storybook-only reference material, never a package export.</li>
        </ul>
      </section>
      <section
        style={{
          display: "grid",
          gap: "12px",
          padding: "24px",
          border: "1px solid #d7deea",
          borderRadius: "20px",
          background: "linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%)",
        }}
      >
        <h2 style={{ margin: 0 }}>Source-of-truth files</h2>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
          <li><code>docs/public-api-manifest.md</code> lists the shipped public exports and coverage files.</li>
          <li><code>docs/migration-map.md</code> tracks every legacy slug and disposition.</li>
          <li><code>docs/component-disposition.md</code> defines what can ship, merge, or remain reference-only.</li>
        </ul>
      </section>
    </section>
  ),
};
