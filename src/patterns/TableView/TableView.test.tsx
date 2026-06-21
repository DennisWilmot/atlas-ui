import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TableColumn } from "../../types";
import { TableView } from "./TableView";

type RecordRow = {
  id: string;
  record: string;
  value: number;
};

const makeRows = (count: number): RecordRow[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `record-${index + 1}`,
    record: `Record ${index + 1}`,
    value: index + 1,
  }));

const columns: TableColumn<RecordRow>[] = [
  { key: "record", label: "Record" },
  { key: "value", label: "Value" },
];

describe("TableView", () => {
  it("returns null for empty rows by default", () => {
    const { container } = render(<TableView rows={[]} columns={columns} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders search for fifty one rows", () => {
    render(<TableView rows={makeRows(51)} columns={columns} />);

    expect(screen.getByLabelText("Table search")).toBeInTheDocument();
  });

  it("gives the table an accessible name", () => {
    render(<TableView rows={makeRows(1)} columns={columns} label="Records table" />);

    expect(screen.getByRole("table", { name: "Records table" })).toBeInTheDocument();
  });

  it("does not display hidden row actions", () => {
    render(
      <TableView
        rows={makeRows(1)}
        columns={columns}
        actions={[
          { id: "open", label: "Open" },
          { id: "internal", label: "Internal", hidden: true },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Internal" })).not.toBeInTheDocument();
  });

  it("does not render a row action menu when no actions exist", () => {
    render(<TableView rows={makeRows(1)} columns={columns} actions={[]} />);

    expect(screen.queryByLabelText("Row actions")).not.toBeInTheDocument();
  });

  it("does not execute disabled row actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <TableView
        rows={makeRows(1)}
        columns={columns}
        actions={[{ id: "open", label: "Open", disabled: true }]}
        onAction={onAction}
      />,
    );

    const actionButton = screen.getByRole("button", { name: "Open" });
    expect(actionButton).toBeDisabled();

    await user.click(actionButton);

    expect(onAction).not.toHaveBeenCalled();
  });
});
