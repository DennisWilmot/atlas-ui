import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

function PaginationExample() {
  const [page, setPage] = useState(2);

  return <Pagination onPageChange={setPage} page={page} pageSize={10} totalItems={42} />;
}

const meta = {
  title: "Primitives/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    page: 1,
    pageSize: 10,
    totalItems: 42,
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnePageHidden: Story = {
  args: {
    page: 1,
    pageSize: 10,
    totalItems: 10,
  },
};

export const ManyPages: Story = {
  render: () => <PaginationExample />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
