import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SelectItem } from "../../types";
import { shouldUseSearchableSelect } from "../../headless";

export type SelectViewProps = {
  items?: SelectItem[];
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoSelectSingle?: boolean;
  className?: string;
  onChange?: (itemId: string) => void;
};

export function SelectView({
  autoSelectSingle = true,
  className,
  disabled = false,
  items = [],
  label = "Select item",
  onChange,
  placeholder = "Choose an item",
  value,
}: SelectViewProps) {
  const selectId = useId();
  const [query, setQuery] = useState("");
  const autoSelectedId = useRef<string | null>(null);
  const searchable = shouldUseSearchableSelect(items.length);

  useEffect(() => {
    const singleItem = items[0];
    if (
      autoSelectSingle &&
      items.length === 1 &&
      singleItem &&
      value !== singleItem.id &&
      autoSelectedId.current !== singleItem.id
    ) {
      autoSelectedId.current = singleItem.id;
      onChange?.(singleItem.id);
    }
  }, [autoSelectSingle, items, onChange, value]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!searchable || !normalizedQuery) return items;

    return items.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
  }, [items, query, searchable]);

  if (items.length === 0) return null;

  if (!searchable) {
    return (
      <label className={className ? `atlas-select-view ${className}` : "atlas-select-view"} htmlFor={selectId}>
        <span className="atlas-field__label">{label}</span>
        <select
          className="atlas-field__control"
          disabled={disabled}
          id={selectId}
          onChange={(event) => onChange?.(event.target.value)}
          value={value ?? ""}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {items.map((item) => (
            <option disabled={item.disabled} key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className={className ? `atlas-select-view ${className}` : "atlas-select-view"}>
      <label className="atlas-field" htmlFor={selectId}>
        <span className="atlas-field__label">{label}</span>
        <input
          aria-autocomplete="list"
          aria-controls={`${selectId}-options`}
          aria-expanded="true"
          aria-label={`${label} search`}
          className="atlas-field__control"
          disabled={disabled}
          id={selectId}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search items"
          role="combobox"
          value={query}
        />
      </label>
      <div id={`${selectId}-options`} role="listbox">
        {filteredItems.map((item) => (
          <button
            aria-selected={value === item.id}
            className="atlas-action-menu__item"
            disabled={disabled || item.disabled}
            key={item.id}
            onClick={() => onChange?.(item.id)}
            role="option"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
