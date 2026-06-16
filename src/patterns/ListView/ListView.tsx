import type { Key, ReactNode } from "react";
import { useMemo, useState } from "react";
import { shouldUseSearchableList } from "../../headless";

export type ListViewProps<T> = {
  items?: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => Key;
  searchPredicate?: (item: T, query: string) => boolean;
  label?: string;
  className?: string;
  pageSize?: number;
  showEmptyState?: boolean;
  emptyLabel?: ReactNode;
};

function defaultSearchPredicate<T>(item: T, query: string): boolean {
  return JSON.stringify(item).toLowerCase().includes(query);
}

export function ListView<T>({
  className,
  emptyLabel = "Nothing to show",
  getItemKey,
  items = [],
  label = "Items",
  pageSize = 20,
  renderItem,
  searchPredicate = defaultSearchPredicate,
  showEmptyState = false,
}: ListViewProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const searchable = shouldUseSearchableList(items.length);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return items;

    return items.filter((item) => searchPredicate(item, normalizedQuery));
  }, [items, query, searchable, searchPredicate]);

  if (items.length === 0) {
    if (!showEmptyState) return null;
    return <div className="atlas-empty" role="status">{emptyLabel}</div>;
  }

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = searchable ? safePage * pageSize : 0;
  const visibleItems = searchable ? filteredItems.slice(start, start + pageSize) : items;

  return (
    <section className={className ? `atlas-list-view ${className}` : "atlas-list-view"} aria-label={label}>
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
      {visibleItems.length > 0 ? (
        <ul className="atlas-list-view__items" aria-label={label}>
          {visibleItems.map((item, index) => (
            <li key={getItemKey?.(item, index) ?? index}>{renderItem(item, index)}</li>
          ))}
        </ul>
      ) : (
        <div className="atlas-empty" role="status">Nothing matches</div>
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
