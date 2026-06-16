import { useMemo, useState } from "react";
import type { Action, Row, TableColumn } from "../../types";
import { getVisibleActions, hasVisibleActions, shouldUseTableControls } from "../../headless";
import { ActionMenu } from "../ActionMenu";

export type TableViewProps<T extends Row = Row> = {
  rows?: T[];
  columns: TableColumn<T>[];
  actions?: Action[] | ((row: T) => Action[]);
  bulkActions?: Action[];
  readOnly?: boolean;
  pageSize?: number;
  showEmptyState?: boolean;
  emptyLabel?: React.ReactNode;
  label?: string;
  className?: string;
  getRowKey?: (row: T, index: number) => React.Key;
  onAction?: (actionId: string, row: T) => void;
  onBulkAction?: (actionId: string) => void;
};

function getCellText<T extends Row>(row: T, column: TableColumn<T>): string {
  const value = row[String(column.key)];
  if (value === null || value === undefined) return "";
  return String(value);
}

export function TableView<T extends Row = Row>({
  actions,
  bulkActions = [],
  className,
  columns,
  emptyLabel = "Nothing to show",
  getRowKey,
  label = "Table",
  onAction,
  onBulkAction,
  pageSize = 25,
  readOnly = false,
  rows = [],
  showEmptyState = false,
}: TableViewProps<T>) {
  const [query, setQuery] = useState("");
  const [filterKey, setFilterKey] = useState("all");
  const [page, setPage] = useState(0);
  const controlled = shouldUseTableControls(rows.length);

  const getRowActions = (row: T): Action[] => {
    if (!actions) return [];
    return typeof actions === "function" ? actions(row) : actions;
  };

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!controlled || !normalizedQuery) return rows;

    return rows.filter((row) => {
      if (filterKey !== "all") {
        return String(row[filterKey] ?? "").toLowerCase().includes(normalizedQuery);
      }

      return columns.some((column) => getCellText(row, column).toLowerCase().includes(normalizedQuery));
    });
  }, [columns, controlled, filterKey, query, rows]);

  if (rows.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = controlled ? safePage * pageSize : 0;
  const visibleRows = controlled ? filteredRows.slice(start, start + pageSize) : rows;
  const hasBulkActions = !readOnly && hasVisibleActions(bulkActions);
  const hasRowActions = !readOnly && visibleRows.some((row) => hasVisibleActions(getRowActions(row)));

  return (
    <section className={className ? `atlas-table-view ${className}` : "atlas-table-view"} aria-label={label}>
      {hasBulkActions ? (
        <ActionMenu actions={getVisibleActions(bulkActions)} ariaLabel="Bulk actions" onAction={onBulkAction} />
      ) : null}
      {controlled ? (
        <div className="atlas-action-menu" aria-label={`${label} controls`}>
          <label className="atlas-field">
            <span className="atlas-field__label">{label} search</span>
            <input
              className="atlas-field__control"
              onChange={(event) => {
                setPage(0);
                setQuery(event.target.value);
              }}
              type="search"
              value={query}
            />
          </label>
          <label className="atlas-field">
            <span className="atlas-field__label">Filter field</span>
            <select
              className="atlas-field__control"
              onChange={(event) => {
                setPage(0);
                setFilterKey(event.target.value);
              }}
              value={filterKey}
            >
              <option value="all">All fields</option>
              {columns.map((column) => (
                <option key={String(column.key)} value={String(column.key)}>
                  {column.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
      <div className="atlas-table-view__scroll">
        <table className="atlas-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} scope="col">
                  {column.label}
                </th>
              ))}
              {hasRowActions ? <th scope="col">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr key={getRowKey?.(row, rowIndex) ?? rowIndex}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render ? column.render(row) : getCellText(row, column)}
                  </td>
                ))}
                {hasRowActions ? (
                  <td>
                    <ActionMenu
                      actions={getRowActions(row)}
                      ariaLabel="Row actions"
                      onAction={(actionId) => onAction?.(actionId, row)}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleRows.length === 0 ? <div className="atlas-empty" role="status">Nothing matches</div> : null}
      {controlled && pageCount > 1 ? (
        <div className="atlas-pagination" aria-label={`${label} pagination`}>
          <button
            className="atlas-action-menu__item"
            disabled={safePage === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            type="button"
          >
            Previous
          </button>
          <span>
            {safePage + 1} / {pageCount}
          </span>
          <button
            className="atlas-action-menu__item"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </section>
  );
}
