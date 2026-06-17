import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUploader } from "./Component";
import type { FileUploadItem } from "../../types";

const makeFiles = (count: number): FileUploadItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `file-${index + 1}`,
    name: `Record ${index + 1}.pdf`,
    size: 1024 * (index + 1),
    type: "application/pdf",
  }));

const meta = {
  title: "Patterns/FileUploader",
  component: FileUploader,
  tags: ["autodocs"],
  args: {
    files: makeFiles(2),
    label: "Files",
    onFilesSelected: () => undefined,
  },
} satisfies Meta<typeof FileUploader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyHidden: Story = {
  args: {
    files: [],
    onFilesSelected: undefined,
  },
};

export const EmptyInput: Story = {
  args: {
    files: [],
    hint: "PDF or text files",
  },
};

export const ExplicitEmptyState: Story = {
  args: {
    files: [],
    onFilesSelected: undefined,
    showEmptyState: true,
  },
};

export const WithActions: Story = {
  args: {
    actions: [{ id: "process", label: "Process", intent: "primary" }],
    files: [
      {
        id: "file-1",
        name: "Record 1.pdf",
        size: 2048,
        type: "application/pdf",
        actions: [{ id: "review", label: "Review" }],
      },
    ],
    onAction: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    files: [
      {
        id: "file-1",
        name: "Record 1.pdf",
        size: 2048,
        type: "application/pdf",
        actions: [{ id: "review", label: "Review" }],
      },
    ],
    readOnly: true,
  },
};

export const TwentyFiles: Story = {
  args: {
    files: makeFiles(20),
  },
};

export const TwentyOneFilesWithSearch: Story = {
  args: {
    files: makeFiles(21),
  },
};
