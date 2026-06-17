import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Overlay } from "./Overlay";
import type { OverlayProps } from "./Overlay";

function OverlayExample(props: Omit<OverlayProps, "open" | "onOpenChange">) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="secondary">Open</Button>
      <Overlay {...props} open={open} onOpenChange={setOpen}>
        <p>Item A content</p>
      </Overlay>
    </div>
  );
}

const meta = {
  title: "Primitives/Overlay",
  component: Overlay,
  tags: ["autodocs"],
} satisfies Meta<typeof Overlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Modal: Story = {
  render: () => <OverlayExample mode="modal" title="Item A" description="Optional supporting text" />,
};

export const Sheet: Story = {
  render: () => <OverlayExample mode="sheet" title="Item A" />,
};

export const Drawer: Story = {
  render: () => <OverlayExample mode="drawer" title="Item A" />,
};

export const NonDismissable: Story = {
  render: () => <OverlayExample dismissable={false} mode="modal" title="Item A" />,
};
