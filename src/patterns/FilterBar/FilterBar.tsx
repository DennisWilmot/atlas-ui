import { useId, useMemo, useState } from "react";
import type { Filter, SelectItem } from "../../types";
import { shouldUseSearchableSelect } from "../../headless";

export type FilterBarProps = {
  filters?: Filter[];
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (filterId: string, itemId: string) => void;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getVisibleFilters(filters: Filter[]): Filter[] {
  return filters.filter((filter) => !filter.hidden && filter.items.length > 0);
}

function getMatchingItems(items: SelectItem[], query: string): SelectItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
}

export function FilterBar({
  ariaLabel = "Filters",
  className,
  disabled = false,
  filters = [],
  onChange,
  readOnly = false,
}: FilterBarProps) {
  const baseId = useId();
  const [queries, setQueries] = useState<Record<string, string>>({});
  const visibleFilters = useMemo(() => getVisibleFilters(filters), [filters]);

  if (visibleFilters.length === 0) return null;

  const controlsDisabled = disabled || readOnly;

  return (
    <section className={joinClasses("atlas-filter-bar", className)} aria-label={ariaLabel}>
      {visibleFilters.map((filter) => {
        const controlId = `${baseId}-${filter.id}`;
        const filterDisabled = controlsDisabled || filter.disabled;
        const searchable = shouldUseSearchableSelect(filter.items.length);
        const query = queries[filter.id] ?? "";
        const matchingItems = searchable ? getMatchingItems(filter.items, query) : filter.items;

        if (!searchable) {
          return (
            <label className="atlas-field atlas-filter-bar__filter" htmlFor={controlId} key={filter.id}>
              <span className="atlas-field__label">{filter.label}</span>
              <select
                className="atlas-field__control"
                disabled={filterDisabled}
                id={controlId}
                onChange={(event) => onChange?.(filter.id, event.target.value)}
                value={filter.value ?? ""}
              >
                <option value="" disabled>
                  {filter.placeholder ?? "Select value"}
                </option>
                {filter.items.map((item) => (
                  <option disabled={item.disabled} key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        return (
          <div className="atlas-filter-bar__filter" key={filter.id}>
            <label className="atlas-field" htmlFor={controlId}>
              <span className="atlas-field__label">{filter.label}</span>
              <input
                aria-autocomplete="list"
                aria-controls={`${controlId}-options`}
                aria-expanded="true"
                aria-label={`${filter.label} search`}
                className="atlas-field__control"
                disabled={filterDisabled}
                id={controlId}
                onChange={(event) => {
                  setQueries((current) => ({
                    ...current,
                    [filter.id]: event.target.value,
                  }));
                }}
                placeholder={filter.placeholder ?? "Search values"}
                role="combobox"
                type="search"
                value={query}
              />
            </label>
            <div className="atlas-filter-bar__options" id={`${controlId}-options`} role="listbox">
              {matchingItems.length > 0 ? (
                matchingItems.map((item) => (
                  <button
                    aria-selected={filter.value === item.id}
                    className="atlas-action-menu__item"
                    disabled={filterDisabled || item.disabled}
                    key={item.id}
                    onClick={() => onChange?.(filter.id, item.id)}
                    role="option"
                    type="button"
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className="atlas-empty" role="status">
                  Nothing matches
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
