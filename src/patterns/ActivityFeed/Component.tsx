import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { hasVisibleActions, shouldUseSearchableList } from "../../headless";
import type { ActivityFeedItem, Field } from "../../types";
import { ActionMenu } from "../ActionMenu";

export type { ActivityFeedItem } from "../../types";

export type ActivityFeedProps = {
  items?: ActivityFeedItem[];
  label?: string;
  className?: string;
  pageSize?: number;
  readOnly?: boolean;
  showEmptyState?: boolean;
  emptyLabel?: ReactNode;
  searchPredicate?: (item: ActivityFeedItem, query: string) => boolean;
  onAction?: (actionId: string, item: ActivityFeedItem) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function isMeaningfulNode(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return Number.isFinite(node);
  if (Array.isArray(node)) return node.some(isMeaningfulNode);
  return true;
}

function isMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.some(isMeaningfulValue);
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function getMeaningfulFields(fields: Field[] = []): Field[] {
  return fields.filter((field) => isMeaningfulValue(field.value));
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.filter(isMeaningfulValue).map(normalizeValue).join(", ");
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return "";
}

function nodeToText(node: ReactNode): string {
  if (!isMeaningfulNode(node)) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).filter(Boolean).join(" ");
  return "";
}

function isMeaningfulItem(item: ActivityFeedItem): boolean {
  if (item.hidden) return false;

  return (
    isMeaningfulNode(item.summary) ||
    isMeaningfulNode(item.description) ||
    isMeaningfulNode(item.source) ||
    getMeaningfulFields(item.fields).length > 0
  );
}

function getSearchText(item: ActivityFeedItem): string {
  const fields = getMeaningfulFields(item.fields).flatMap((field) => [
    field.label,
    normalizeValue(field.value),
  ]);

  return [
    item.searchText,
    nodeToText(item.summary),
    nodeToText(item.description),
    nodeToText(item.source),
    nodeToText(item.timestamp),
    ...fields,
  ]
    .filter(Boolean)
    .join(" ");
}

function defaultSearchPredicate(item: ActivityFeedItem, query: string): boolean {
  return getSearchText(item).toLowerCase().includes(query);
}

export function ActivityFeed({
  className,
  emptyLabel = "Nothing to show",
  items = [],
  label = "Activity feed",
  onAction,
  pageSize = 20,
  readOnly = false,
  searchPredicate = defaultSearchPredicate,
  showEmptyState = false,
}: ActivityFeedProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const visibleItems = useMemo(() => items.filter(isMeaningfulItem), [items]);
  const searchable = shouldUseSearchableList(visibleItems.length);
  const safePageSize = Math.max(1, pageSize);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return visibleItems;

    return visibleItems.filter((item) => searchPredicate(item, normalizedQuery));
  }, [query, searchable, searchPredicate, visibleItems]);

  if (visibleItems.length === 0) {
    if (!showEmptyState) return null;
    return (
      <div className="atlas-empty" role="status">
        {emptyLabel}
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / safePageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * safePageSize : 0;
  const renderedItems = searchable ? filteredItems.slice(start, start + safePageSize) : visibleItems;

  return (
    <section className={joinClasses("atlas-activity-feed", className)} aria-label={label}>
      {searchable ? (
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
      ) : null}
      {renderedItems.length > 0 ? (
        <ol className="atlas-activity-feed__items" aria-label={label}>
          {renderedItems.map((item) => {
            const fields = getMeaningfulFields(item.fields);
            const hasItemActions = !readOnly && hasVisibleActions(item.actions);

            return (
              <li className="atlas-activity-feed__item" key={item.id}>
                <span className="atlas-activity-feed__marker" aria-hidden="true">
                  {item.marker}
                </span>
                <div className="atlas-activity-feed__body">
                  {isMeaningfulNode(item.source) || isMeaningfulNode(item.timestamp) ? (
                    <div className="atlas-activity-feed__meta">
                      {isMeaningfulNode(item.source) ? <span>{item.source}</span> : null}
                      {isMeaningfulNode(item.timestamp) ? <span>{item.timestamp}</span> : null}
                    </div>
                  ) : null}
                  {isMeaningfulNode(item.summary) ? (
                    <div className="atlas-activity-feed__summary">{item.summary}</div>
                  ) : null}
                  {isMeaningfulNode(item.description) ? (
                    <div className="atlas-activity-feed__description">{item.description}</div>
                  ) : null}
                  {fields.length > 0 ? (
                    <dl className="atlas-activity-feed__fields">
                      {fields.map((field) => (
                        <div className="atlas-activity-feed__field" key={field.key}>
                          <dt>{field.label}</dt>
                          <dd>{normalizeValue(field.value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {hasItemActions ? (
                    <ActionMenu
                      actions={item.actions}
                      ariaLabel="Activity item actions"
                      onAction={(actionId) => onAction?.(actionId, item)}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="atlas-empty" role="status">
          Nothing matches
        </div>
      )}
      {searchable && pageCount > 1 ? (
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
