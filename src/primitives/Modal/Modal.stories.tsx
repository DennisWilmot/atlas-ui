import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Modal } from "./Modal";
import type { ModalProps } from "./Modal";

function ModalExample(props: Omit<ModalProps, "open" | "onOpenChange">) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant="secondary">Open</Button>
      <Modal {...props} open={open} onOpenChange={setOpen}>
        <p>Item A content</p>
      </Modal>
    </div>
  );
}

const meta = {
  title: "Primitives/Modal",
  component: Modal,
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ModalExample title="Item A" description="Optional supporting text" />,
};

export const WithFooter: Story = {
  render: () => <ModalExample footer={<Button>Action</Button>} title="Item A" />,
};

export const NonDismissable: Story = {
  render: () => <ModalExample dismissable={false} title="Item A" />,
};
