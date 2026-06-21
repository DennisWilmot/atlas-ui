import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Migration Reference/Release Taxonomy",
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

export const Taxonomy: Story = {
  render: () => (
    <section className="atlas-stack">
      <h2 className="atlas-doc-heading">Storybook Groups</h2>
      <ul className="atlas-doc-list">
        <li>Docs</li>
        <li>Primitives</li>
        <li>Patterns</li>
        <li>Examples</li>
        <li>Migration Reference</li>
      </ul>
    </section>
  ),
};
