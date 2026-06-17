import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileUploader } from "./Component";
import type { FileUploadItem } from "../../types";

const makeFiles = (count: number): FileUploadItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `file-${index + 1}`,
    name: `Record ${index + 1}.pdf`,
    size: 1024 * (index + 1),
    type: "application/pdf",
  }));

describe("FileUploader", () => {
  it("returns null when no files or upload capability exist", () => {
    const { container } = render(<FileUploader files={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an explicit empty state when opted in", () => {
    render(<FileUploader files={[]} showEmptyState />);

    expect(screen.getByRole("status")).toHaveTextContent("Nothing to show");
  });

  it("sends selected files to the app without uploading internally", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    const file = new File(["alpha"], "record.txt", { type: "text/plain" });

    render(<FileUploader files={[]} onFilesSelected={onFilesSelected} />);

    await user.upload(screen.getByLabelText("Files file input"), file);

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("renders search for twenty one files", () => {
    render(<FileUploader files={makeFiles(21)} />);

    expect(screen.getByLabelText("Files search")).toBeInTheDocument();
  });

  it("hides files without meaningful names", () => {
    render(
      <FileUploader
        files={[
          { id: "empty", name: " " },
          { id: "visible", name: "Record 1.pdf" },
        ]}
      />,
    );

    expect(screen.queryByText("empty")).not.toBeInTheDocument();
    expect(screen.getByText("Record 1.pdf")).toBeInTheDocument();
  });

  it("hides files without meaningful ids", () => {
    render(
      <FileUploader
        files={[
          { id: " ", name: "Record A.pdf" },
          { id: "visible", name: "Record B.pdf" },
        ]}
      />,
    );

    expect(screen.queryByText("Record A.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("Record B.pdf")).toBeInTheDocument();
  });

  it("uses injected actions and passes the selected file context", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <FileUploader
        files={[
          {
            id: "file-1",
            name: "Record 1.pdf",
            actions: [{ id: "inspect", label: "Inspect" }],
          },
        ]}
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Inspect" }));

    expect(onAction).toHaveBeenCalledWith(
      "inspect",
      expect.objectContaining({ id: "file-1", name: "Record 1.pdf" }),
    );
  });

  it("does not render injected actions while read only", () => {
    render(
      <FileUploader
        files={[
          {
            id: "file-1",
            name: "Record 1.pdf",
            actions: [{ id: "inspect", label: "Inspect" }],
          },
        ]}
        readOnly
      />,
    );

    expect(screen.queryByRole("button", { name: "Inspect" })).not.toBeInTheDocument();
  });
});
