import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const illustrations = [
  {
    alt: "Neutral empty canvas illustration",
    fileName: "empty-canvas.svg",
    src: new URL("./empty-canvas.svg", import.meta.url).href,
  },
  {
    alt: "Neutral workflow illustration",
    fileName: "flow-reference.svg",
    src: new URL("./flow-reference.svg", import.meta.url).href,
  },
];

const pageStyle: CSSProperties = {
  color: "var(--atlas-color-text)",
  display: "grid",
  gap: "1rem",
  maxWidth: "48rem",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
};

const figureStyle: CSSProperties = {
  border: "1px solid var(--atlas-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "0.75rem",
  margin: 0,
  padding: "1rem",
};

const imageStyle: CSSProperties = {
  aspectRatio: "16 / 11",
  display: "block",
  height: "auto",
  width: "100%",
};

const captionStyle: CSSProperties = {
  color: "var(--atlas-color-muted)",
  fontSize: "0.875rem",
};

function IllustrationsExample() {
  return (
    <section aria-label="Example illustration assets" style={pageStyle}>
      <div style={gridStyle}>
        {illustrations.map((illustration) => (
          <figure key={illustration.fileName} style={figureStyle}>
            <img alt={illustration.alt} src={illustration.src} style={imageStyle} />
            <figcaption style={captionStyle}>{illustration.fileName}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: "Examples/Assets/Illustrations",
  tags: ["autodocs"],
  render: () => <IllustrationsExample />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReferenceAssets: Story = {};
